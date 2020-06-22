describe('Polyline Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')

  })

  it('Polyline with sugared reffed points', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point>(3,5)</point>
    <point>(-4,-1)</point>
    <point>(5,2)</point>
    <point>(-3,4)</point>
    <polyline>
      <ref>_point1</ref>
      <ref>_point2</ref>
      <ref>_point3</ref>
      <ref>_point4</ref>
    </polyline>
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_polyline1'].stateValues.vertices[0].tree).eqls(['vector', 3, 5]);
      expect(components['/_polyline1'].stateValues.vertices[1].tree).eqls(['vector', -4, -1]);
      expect(components['/_polyline1'].stateValues.vertices[2].tree).eqls(['vector', 5, 2]);
      expect(components['/_polyline1'].stateValues.vertices[3].tree).eqls(['vector', -3, 4]);
    })

    cy.log('move individual vertex')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      components['/_polyline1'].movePolyline({ 1: [4, 7] });
      expect(components['/_polyline1'].stateValues.vertices[0].tree).eqls(['vector', 3, 5]);
      expect(components['/_polyline1'].stateValues.vertices[1].tree).eqls(['vector', 4, 7]);
      expect(components['/_polyline1'].stateValues.vertices[2].tree).eqls(['vector', 5, 2]);
      expect(components['/_polyline1'].stateValues.vertices[3].tree).eqls(['vector', -3, 4]);

    })


    cy.log('move polyline up and to the right')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let vertices = [];
      for (let i = 0; i < components['/_polyline1'].stateValues.nVertices; i++) {
        vertices.push([
          components['/_polyline1'].stateValues.vertices[i].get_component(0),
          components['/_polyline1'].stateValues.vertices[i].get_component(1)
        ])
      }

      let moveX = 3;
      let moveY = 2;

      for (let i = 0; i < vertices.length; i++) {
        vertices[i][0] = vertices[i][0].add(moveX).simplify().tree;
        vertices[i][1] = vertices[i][1].add(moveY).simplify().tree;
      }

      components['/_polyline1'].movePolyline(vertices);

      let pxs = [];
      let pys = [];
      for (let i = 0; i < vertices.length; i++) {
        pxs.push(vertices[i][0]);
        pys.push(vertices[i][1]);
      }

      for (let i = 0; i < vertices.length; i++) {
        expect(components['/_polyline1'].stateValues.vertices[i].tree).eqls(['vector', pxs[i], pys[i]]);
      }

    })
  })

  it('Polyline vertices and reffed points', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point>(3,5)</point>
    <point>(-4,-1)</point>
    <point>(5,2)</point>
    <point>(-3,4)</point>
    <polyline><vertices>
      <ref>_point1</ref>
      <ref>_point2</ref>
      <ref>_point3</ref>
      <ref>_point4</ref>
    </vertices></polyline>
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_polyline1'].stateValues.vertices[0].tree).eqls(['vector', 3, 5]);
      expect(components['/_polyline1'].stateValues.vertices[1].tree).eqls(['vector', -4, -1]);
      expect(components['/_polyline1'].stateValues.vertices[2].tree).eqls(['vector', 5, 2]);
      expect(components['/_polyline1'].stateValues.vertices[3].tree).eqls(['vector', -3, 4]);
    })

    cy.log('move individual vertex')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      components['/_polyline1'].movePolyline({ 1: [4, 7] });
      expect(components['/_polyline1'].stateValues.vertices[0].tree).eqls(['vector', 3, 5]);
      expect(components['/_polyline1'].stateValues.vertices[1].tree).eqls(['vector', 4, 7]);
      expect(components['/_polyline1'].stateValues.vertices[2].tree).eqls(['vector', 5, 2]);
      expect(components['/_polyline1'].stateValues.vertices[3].tree).eqls(['vector', -3, 4]);

    })


    cy.log('move polyline up and to the right')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let vertices = [];
      for (let i = 0; i < components['/_polyline1'].stateValues.nVertices; i++) {
        vertices.push([
          components['/_polyline1'].stateValues.vertices[i].get_component(0),
          components['/_polyline1'].stateValues.vertices[i].get_component(1)
        ])
      }

      let moveX = 3;
      let moveY = 2;

      for (let i = 0; i < vertices.length; i++) {
        vertices[i][0] = vertices[i][0].add(moveX).simplify().tree;
        vertices[i][1] = vertices[i][1].add(moveY).simplify().tree;
      }

      components['/_polyline1'].movePolyline(vertices);

      let pxs = [];
      let pys = [];
      for (let i = 0; i < vertices.length; i++) {
        pxs.push(vertices[i][0]);
        pys.push(vertices[i][1]);
      }

      for (let i = 0; i < vertices.length; i++) {
        expect(components['/_polyline1'].stateValues.vertices[i].tree).eqls(['vector', pxs[i], pys[i]]);
      }

    })
  })

  it('Polyline string points', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <math>-1</math>
  <graph>
    <polyline>
      (3,5), (-4,<ref>_math1</ref>),(5,2),(-3,4)
    </polyline>
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_polyline1'].stateValues.vertices[0].tree).eqls(['vector', 3, 5]);
      expect(components['/_polyline1'].stateValues.vertices[1].tree).eqls(['vector', -4, -1]);
      expect(components['/_polyline1'].stateValues.vertices[2].tree).eqls(['vector', 5, 2]);
      expect(components['/_polyline1'].stateValues.vertices[3].tree).eqls(['vector', -3, 4]);
    })

    cy.log('move individual vertex')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      components['/_polyline1'].movePolyline({ 1: [4, 7] });
      expect(components['/_polyline1'].stateValues.vertices[0].tree).eqls(['vector', 3, 5]);
      expect(components['/_polyline1'].stateValues.vertices[1].tree).eqls(['vector', 4, 7]);
      expect(components['/_polyline1'].stateValues.vertices[2].tree).eqls(['vector', 5, 2]);
      expect(components['/_polyline1'].stateValues.vertices[3].tree).eqls(['vector', -3, 4]);

    })


    cy.log('move polyline up and to the right')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let vertices = [];
      for (let i = 0; i < components['/_polyline1'].stateValues.nVertices; i++) {
        vertices.push([
          components['/_polyline1'].stateValues.vertices[i].get_component(0),
          components['/_polyline1'].stateValues.vertices[i].get_component(1)
        ])
      }

      let moveX = 3;
      let moveY = 2;

      for (let i = 0; i < vertices.length; i++) {
        vertices[i][0] = vertices[i][0].add(moveX).simplify().tree;
        vertices[i][1] = vertices[i][1].add(moveY).simplify().tree;
      }

      components['/_polyline1'].movePolyline(vertices);

      let pxs = [];
      let pys = [];
      for (let i = 0; i < vertices.length; i++) {
        pxs.push(vertices[i][0]);
        pys.push(vertices[i][1]);
      }

      for (let i = 0; i < vertices.length; i++) {
        expect(components['/_polyline1'].stateValues.vertices[i].tree).eqls(['vector', pxs[i], pys[i]]);
      }

    })
  })

  it('Polyline string points in vertices', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <math>-1</math>
  <graph>
    <polyline><vertices>
      (3,5), (-4,<ref>_math1</ref>),(5,2),(-3,4)
    </vertices></polyline>
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_polyline1'].stateValues.vertices[0].tree).eqls(['vector', 3, 5]);
      expect(components['/_polyline1'].stateValues.vertices[1].tree).eqls(['vector', -4, -1]);
      expect(components['/_polyline1'].stateValues.vertices[2].tree).eqls(['vector', 5, 2]);
      expect(components['/_polyline1'].stateValues.vertices[3].tree).eqls(['vector', -3, 4]);
    })

    cy.log('move individual vertex')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      components['/_polyline1'].movePolyline({ 1: [4, 7] });
      expect(components['/_polyline1'].stateValues.vertices[0].tree).eqls(['vector', 3, 5]);
      expect(components['/_polyline1'].stateValues.vertices[1].tree).eqls(['vector', 4, 7]);
      expect(components['/_polyline1'].stateValues.vertices[2].tree).eqls(['vector', 5, 2]);
      expect(components['/_polyline1'].stateValues.vertices[3].tree).eqls(['vector', -3, 4]);

    })


    cy.log('move polyline up and to the right')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let vertices = [];
      for (let i = 0; i < components['/_polyline1'].stateValues.nVertices; i++) {
        vertices.push([
          components['/_polyline1'].stateValues.vertices[i].get_component(0),
          components['/_polyline1'].stateValues.vertices[i].get_component(1)
        ])
      }

      let moveX = 3;
      let moveY = 2;

      for (let i = 0; i < vertices.length; i++) {
        vertices[i][0] = vertices[i][0].add(moveX).simplify().tree;
        vertices[i][1] = vertices[i][1].add(moveY).simplify().tree;
      }

      components['/_polyline1'].movePolyline(vertices);

      let pxs = [];
      let pys = [];
      for (let i = 0; i < vertices.length; i++) {
        pxs.push(vertices[i][0]);
        pys.push(vertices[i][1]);
      }

      for (let i = 0; i < vertices.length; i++) {
        expect(components['/_polyline1'].stateValues.vertices[i].tree).eqls(['vector', pxs[i], pys[i]]);
      }

    })
  })

  it('dynamic polyline, initially zero, reffed', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <mathinput name="count" prefill="0" />
  <graph>
  <polyline><vertices>
    <map>
      <template><point>(<copyFromSubs/>, 5sin(<copyFromSubs/>))</point></template>
      <substitutions><sequence from="0">
        <count><ref prop="value">count</ref></count>
      </sequence></substitutions>
    </map>
    </vertices></polyline>
  </graph>
  
  <graph>
  <ref name="polyline2">_polyline1</ref>
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let polyline2 = components["/polyline2"].replacements[0];

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_polyline1'].stateValues.nVertices).eq(0);
        expect(polyline2.stateValues.nVertices).eq(0);
      })

      cy.get('#\\/count_input').clear().type("1{enter}");
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let nVertices = 1;
        expect(components['/_polyline1'].stateValues.nVertices).eq(nVertices);
        expect(polyline2.stateValues.nVertices).eq(nVertices);
        for (let i = 0; i < nVertices; i++) {
          expect(components['/_polyline1'].stateValues.vertices[i].get_component(0).tree).eq(i);
          expect(components['/_polyline1'].stateValues.vertices[i].get_component(1).tree).closeTo(5 * Math.sin(i), 1E-12);
          expect(polyline2.stateValues.vertices[i].get_component(0).tree).eq(i);
          expect(polyline2.stateValues.vertices[i].get_component(1).tree).closeTo(5 * Math.sin(i), 1E-12);
        }

      })

      cy.get('#\\/count_input').clear().type("2{enter}");
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let nVertices = 2;
        expect(components['/_polyline1'].stateValues.nVertices).eq(nVertices);
        expect(polyline2.stateValues.nVertices).eq(nVertices);
        for (let i = 0; i < nVertices; i++) {
          expect(components['/_polyline1'].stateValues.vertices[i].get_component(0).tree).eq(i);
          expect(components['/_polyline1'].stateValues.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
          expect(polyline2.stateValues.vertices[i].get_component(0).tree).eq(i);
          expect(polyline2.stateValues.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        }

      })

      cy.get('#\\/count_input').clear().type("3{enter}");
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let nVertices = 3;
        expect(components['/_polyline1'].stateValues.nVertices).eq(nVertices);
        expect(polyline2.stateValues.nVertices).eq(nVertices);
        for (let i = 0; i < nVertices; i++) {
          expect(components['/_polyline1'].stateValues.vertices[i].get_component(0).tree).eq(i);
          expect(components['/_polyline1'].stateValues.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
          expect(polyline2.stateValues.vertices[i].get_component(0).tree).eq(i);
          expect(polyline2.stateValues.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        }

      })

      cy.get('#\\/count_input').clear().type("2{enter}");
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let nVertices = 2;
        expect(components['/_polyline1'].stateValues.nVertices).eq(nVertices);
        expect(polyline2.stateValues.nVertices).eq(nVertices);
        for (let i = 0; i < nVertices; i++) {
          expect(components['/_polyline1'].stateValues.vertices[i].get_component(0).tree).eq(i);
          expect(components['/_polyline1'].stateValues.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
          expect(polyline2.stateValues.vertices[i].get_component(0).tree).eq(i);
          expect(polyline2.stateValues.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        }

      })


      cy.get('#\\/count_input').clear().type("0{enter}");
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let nVertices = 0;
        expect(components['/_polyline1'].stateValues.nVertices).eq(nVertices);
        expect(polyline2.stateValues.nVertices).eq(nVertices);
        for (let i = 0; i < nVertices; i++) {
          expect(components['/_polyline1'].stateValues.vertices[i].get_component(0).tree).eq(i);
          expect(components['/_polyline1'].stateValues.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
          expect(polyline2.stateValues.vertices[i].get_component(0).tree).eq(i);
          expect(polyline2.stateValues.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        }

      })

      cy.get('#\\/count_input').clear().type("5{enter}");
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let nVertices = 5;
        expect(components['/_polyline1'].stateValues.nVertices).eq(nVertices);
        expect(polyline2.stateValues.nVertices).eq(nVertices);
        for (let i = 0; i < nVertices; i++) {
          expect(components['/_polyline1'].stateValues.vertices[i].get_component(0).tree).eq(i);
          expect(components['/_polyline1'].stateValues.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
          expect(polyline2.stateValues.vertices[i].get_component(0).tree).eq(i);
          expect(polyline2.stateValues.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        }

      })
    })

    cy.log("start over and begin with big increment")

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>b</text>
  <mathinput name="count" prefill="0" />
  <graph>
  <polyline><vertices>
    <map>
      <template><point>(<copyFromSubs/>, 5sin(<copyFromSubs/>))</point></template>
      <substitutions><sequence from="0">
        <count><ref prop="value">count</ref></count>
      </sequence></substitutions>
    </map>
    </vertices></polyline>
  </graph>
  
  <graph>
  <ref name="polyline2">_polyline1</ref>
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'b') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let polyline2 = components["/polyline2"].replacements[0];

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_polyline1'].stateValues.nVertices).eq(0);
        expect(polyline2.stateValues.nVertices).eq(0);
      })


      cy.get('#\\/count_input').clear().type("10{enter}");
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let nVertices = 10;
        expect(components['/_polyline1'].stateValues.nVertices).eq(nVertices);
        expect(polyline2.stateValues.nVertices).eq(nVertices);
        for (let i = 0; i < nVertices; i++) {
          expect(components['/_polyline1'].stateValues.vertices[i].get_component(0).tree).eq(i);
          expect(components['/_polyline1'].stateValues.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
          expect(polyline2.stateValues.vertices[i].get_component(0).tree).eq(i);
          expect(polyline2.stateValues.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        }

      })

      cy.get('#\\/count_input').clear().type("1{enter}");
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let nVertices = 1;
        expect(components['/_polyline1'].stateValues.nVertices).eq(nVertices);
        expect(polyline2.stateValues.nVertices).eq(nVertices);
        for (let i = 0; i < nVertices; i++) {
          expect(components['/_polyline1'].stateValues.vertices[i].get_component(0).tree).eq(i);
          expect(components['/_polyline1'].stateValues.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
          expect(polyline2.stateValues.vertices[i].get_component(0).tree).eq(i);
          expect(polyline2.stateValues.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        }

      })
    })

  })

  it('dynamic polyline with sugared vertices, initially zero, reffed', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <mathinput name="count" prefill="0" />
  <graph>
  <polyline>
    <map>
      <template><point>(<copyFromSubs/>, 5sin(<copyFromSubs/>))</point></template>
      <substitutions><sequence from="0">
        <count><ref prop="value">count</ref></count>
      </sequence></substitutions>
    </map>
    </polyline>
  </graph>
  
  <graph>
  <ref name="polyline2">_polyline1</ref>
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let polyline2 = components["/polyline2"].replacements[0];

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_polyline1'].stateValues.nVertices).eq(0);
        expect(polyline2.stateValues.nVertices).eq(0);
      })

      cy.get('#\\/count_input').clear().type("1{enter}");
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let nVertices = 1;
        expect(components['/_polyline1'].stateValues.nVertices).eq(nVertices);
        expect(polyline2.stateValues.nVertices).eq(nVertices);
        for (let i = 0; i < nVertices; i++) {
          expect(components['/_polyline1'].stateValues.vertices[i].get_component(0).tree).eq(i);
          expect(components['/_polyline1'].stateValues.vertices[i].get_component(1).tree).closeTo(5 * Math.sin(i), 1E-12);
          expect(polyline2.stateValues.vertices[i].get_component(0).tree).eq(i);
          expect(polyline2.stateValues.vertices[i].get_component(1).tree).closeTo(5 * Math.sin(i), 1E-12);
        }

      })

      cy.get('#\\/count_input').clear().type("2{enter}");
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let nVertices = 2;
        expect(components['/_polyline1'].stateValues.nVertices).eq(nVertices);
        expect(polyline2.stateValues.nVertices).eq(nVertices);
        for (let i = 0; i < nVertices; i++) {
          expect(components['/_polyline1'].stateValues.vertices[i].get_component(0).tree).eq(i);
          expect(components['/_polyline1'].stateValues.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
          expect(polyline2.stateValues.vertices[i].get_component(0).tree).eq(i);
          expect(polyline2.stateValues.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        }

      })

      cy.get('#\\/count_input').clear().type("3{enter}");
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let nVertices = 3;
        expect(components['/_polyline1'].stateValues.nVertices).eq(nVertices);
        expect(polyline2.stateValues.nVertices).eq(nVertices);
        for (let i = 0; i < nVertices; i++) {
          expect(components['/_polyline1'].stateValues.vertices[i].get_component(0).tree).eq(i);
          expect(components['/_polyline1'].stateValues.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
          expect(polyline2.stateValues.vertices[i].get_component(0).tree).eq(i);
          expect(polyline2.stateValues.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        }

      })

      cy.get('#\\/count_input').clear().type("2{enter}");
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let nVertices = 2;
        expect(components['/_polyline1'].stateValues.nVertices).eq(nVertices);
        expect(polyline2.stateValues.nVertices).eq(nVertices);
        for (let i = 0; i < nVertices; i++) {
          expect(components['/_polyline1'].stateValues.vertices[i].get_component(0).tree).eq(i);
          expect(components['/_polyline1'].stateValues.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
          expect(polyline2.stateValues.vertices[i].get_component(0).tree).eq(i);
          expect(polyline2.stateValues.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        }

      })


      cy.get('#\\/count_input').clear().type("0{enter}");
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let nVertices = 0;
        expect(components['/_polyline1'].stateValues.nVertices).eq(nVertices);
        expect(polyline2.stateValues.nVertices).eq(nVertices);
        for (let i = 0; i < nVertices; i++) {
          expect(components['/_polyline1'].stateValues.vertices[i].get_component(0).tree).eq(i);
          expect(components['/_polyline1'].stateValues.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
          expect(polyline2.stateValues.vertices[i].get_component(0).tree).eq(i);
          expect(polyline2.stateValues.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        }

      })

      cy.get('#\\/count_input').clear().type("5{enter}");
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let nVertices = 5;
        expect(components['/_polyline1'].stateValues.nVertices).eq(nVertices);
        expect(polyline2.stateValues.nVertices).eq(nVertices);
        for (let i = 0; i < nVertices; i++) {
          expect(components['/_polyline1'].stateValues.vertices[i].get_component(0).tree).eq(i);
          expect(components['/_polyline1'].stateValues.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
          expect(polyline2.stateValues.vertices[i].get_component(0).tree).eq(i);
          expect(polyline2.stateValues.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        }

      })

    })

    cy.log("start over and begin with big increment")

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>b</text>
  <mathinput name="count" prefill="0" />
  <graph>
  <polyline>
    <map>
      <template><point>(<copyFromSubs/>, 5sin(<copyFromSubs/>))</point></template>
      <substitutions><sequence from="0">
        <count><ref prop="value">count</ref></count>
      </sequence></substitutions>
    </map>
    </polyline>
  </graph>
  
  <graph>
  <ref name="polyline2">_polyline1</ref>
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'b') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let polyline2 = components["/polyline2"].replacements[0];

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_polyline1'].stateValues.nVertices).eq(0);
        expect(polyline2.stateValues.nVertices).eq(0);
      })


      cy.get('#\\/count_input').clear().type("10{enter}");
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let nVertices = 10;
        expect(components['/_polyline1'].stateValues.nVertices).eq(nVertices);
        expect(polyline2.stateValues.nVertices).eq(nVertices);
        for (let i = 0; i < nVertices; i++) {
          expect(components['/_polyline1'].stateValues.vertices[i].get_component(0).tree).eq(i);
          expect(components['/_polyline1'].stateValues.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
          expect(polyline2.stateValues.vertices[i].get_component(0).tree).eq(i);
          expect(polyline2.stateValues.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        }

      })

      cy.get('#\\/count_input').clear().type("1{enter}");
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let nVertices = 1;
        expect(components['/_polyline1'].stateValues.nVertices).eq(nVertices);
        expect(polyline2.stateValues.nVertices).eq(nVertices);
        for (let i = 0; i < nVertices; i++) {
          expect(components['/_polyline1'].stateValues.vertices[i].get_component(0).tree).eq(i);
          expect(components['/_polyline1'].stateValues.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
          expect(polyline2.stateValues.vertices[i].get_component(0).tree).eq(i);
          expect(polyline2.stateValues.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        }

      })
    })

  })

  it('dynamic polyline with sugared vertices from reffed map, initially zero, reffed', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>

  <mathinput name="count" prefill="0" />
  <graph>
  <map>
    <template><point>(<copyFromSubs/>, 5sin(<copyFromSubs/>))</point></template>
    <substitutions><sequence from="0">
      <count><ref prop="value">count</ref></count>
    </sequence></substitutions>
  </map>
  <polyline>
    <ref>_map1</ref>
  </polyline>
  </graph>
  
  <graph>
  <ref name="polyline2">_polyline1</ref>
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let polyline2 = components["/polyline2"].replacements[0];

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_polyline1'].stateValues.nVertices).eq(0);
        expect(polyline2.stateValues.nVertices).eq(0);
      })

      cy.get('#\\/count_input').clear().type("1{enter}");
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let nVertices = 1;
        expect(components['/_polyline1'].stateValues.nVertices).eq(nVertices);
        expect(polyline2.stateValues.nVertices).eq(nVertices);
        for (let i = 0; i < nVertices; i++) {
          expect(components['/_polyline1'].stateValues.vertices[i].get_component(0).tree).eq(i);
          expect(components['/_polyline1'].stateValues.vertices[i].get_component(1).tree).closeTo(5 * Math.sin(i), 1E-12);
          expect(polyline2.stateValues.vertices[i].get_component(0).tree).eq(i);
          expect(polyline2.stateValues.vertices[i].get_component(1).tree).closeTo(5 * Math.sin(i), 1E-12);
        }

      })

      cy.get('#\\/count_input').clear().type("2{enter}");
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let nVertices = 2;
        expect(components['/_polyline1'].stateValues.nVertices).eq(nVertices);
        expect(polyline2.stateValues.nVertices).eq(nVertices);
        for (let i = 0; i < nVertices; i++) {
          expect(components['/_polyline1'].stateValues.vertices[i].get_component(0).tree).eq(i);
          expect(components['/_polyline1'].stateValues.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
          expect(polyline2.stateValues.vertices[i].get_component(0).tree).eq(i);
          expect(polyline2.stateValues.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        }

      })

      cy.get('#\\/count_input').clear().type("3{enter}");
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let nVertices = 3;
        expect(components['/_polyline1'].stateValues.nVertices).eq(nVertices);
        expect(polyline2.stateValues.nVertices).eq(nVertices);
        for (let i = 0; i < nVertices; i++) {
          expect(components['/_polyline1'].stateValues.vertices[i].get_component(0).tree).eq(i);
          expect(components['/_polyline1'].stateValues.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
          expect(polyline2.stateValues.vertices[i].get_component(0).tree).eq(i);
          expect(polyline2.stateValues.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        }

      })

      cy.get('#\\/count_input').clear().type("2{enter}");
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let nVertices = 2;
        expect(components['/_polyline1'].stateValues.nVertices).eq(nVertices);
        expect(polyline2.stateValues.nVertices).eq(nVertices);
        for (let i = 0; i < nVertices; i++) {
          expect(components['/_polyline1'].stateValues.vertices[i].get_component(0).tree).eq(i);
          expect(components['/_polyline1'].stateValues.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
          expect(polyline2.stateValues.vertices[i].get_component(0).tree).eq(i);
          expect(polyline2.stateValues.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        }

      })


      cy.get('#\\/count_input').clear().type("0{enter}");
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let nVertices = 0;
        expect(components['/_polyline1'].stateValues.nVertices).eq(nVertices);
        expect(polyline2.stateValues.nVertices).eq(nVertices);
        for (let i = 0; i < nVertices; i++) {
          expect(components['/_polyline1'].stateValues.vertices[i].get_component(0).tree).eq(i);
          expect(components['/_polyline1'].stateValues.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
          expect(polyline2.stateValues.vertices[i].get_component(0).tree).eq(i);
          expect(polyline2.stateValues.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        }

      })

      cy.get('#\\/count_input').clear().type("5{enter}");
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let nVertices = 5;
        expect(components['/_polyline1'].stateValues.nVertices).eq(nVertices);
        expect(polyline2.stateValues.nVertices).eq(nVertices);
        for (let i = 0; i < nVertices; i++) {
          expect(components['/_polyline1'].stateValues.vertices[i].get_component(0).tree).eq(i);
          expect(components['/_polyline1'].stateValues.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
          expect(polyline2.stateValues.vertices[i].get_component(0).tree).eq(i);
          expect(polyline2.stateValues.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        }

      })
    })

    cy.log("start over and begin with big increment")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>b</text>

  <mathinput name="count" prefill="0" />
  <graph>
  <map>
    <template><point>(<copyFromSubs/>, 5sin(<copyFromSubs/>))</point></template>
    <substitutions><sequence from="0">
      <count><ref prop="value">count</ref></count>
    </sequence></substitutions>
  </map>
  <polyline>
    <ref>_map1</ref>
  </polyline>
  </graph>
  
  <graph>
  <ref name="polyline2">_polyline1</ref>
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'b') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let polyline2 = components["/polyline2"].replacements[0];

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_polyline1'].stateValues.nVertices).eq(0);
        expect(polyline2.stateValues.nVertices).eq(0);
      })


      cy.get('#\\/count_input').clear().type("10{enter}");
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let nVertices = 10;
        expect(components['/_polyline1'].stateValues.nVertices).eq(nVertices);
        expect(polyline2.stateValues.nVertices).eq(nVertices);
        for (let i = 0; i < nVertices; i++) {
          expect(components['/_polyline1'].stateValues.vertices[i].get_component(0).tree).eq(i);
          expect(components['/_polyline1'].stateValues.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
          expect(polyline2.stateValues.vertices[i].get_component(0).tree).eq(i);
          expect(polyline2.stateValues.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        }

      })

      cy.get('#\\/count_input').clear().type("1{enter}");
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let nVertices = 1;
        expect(components['/_polyline1'].stateValues.nVertices).eq(nVertices);
        expect(polyline2.stateValues.nVertices).eq(nVertices);
        for (let i = 0; i < nVertices; i++) {
          expect(components['/_polyline1'].stateValues.vertices[i].get_component(0).tree).eq(i);
          expect(components['/_polyline1'].stateValues.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
          expect(polyline2.stateValues.vertices[i].get_component(0).tree).eq(i);
          expect(polyline2.stateValues.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        }

      })
    })

  })

  it('polyline with initially undefined point', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <mathinput/>
  <graph>
  <polyline>
    <point>(1,2)</point>
    <point>(-1,5)</point>
    <point>(<ref prop="value">_mathinput1</ref>,7)</point>
    <point>(3,-5)</point>
    <point>(-4,-3)</point>
  </polyline>
  </graph>
  
  <graph>
  <ref name="polyline2">_polyline1</ref>
  </graph>  
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let polyline2 = components["/polyline2"].replacements[0];

      let polylines = [components["/_polyline1"], polyline2]
      cy.window().then((win) => {
        for (let polyline of polylines) {
          expect(polyline.stateValues.nVertices).eq(5);
          expect(polyline.stateValues.vertices[0].get_component(0).tree).eq(1);
          expect(polyline.stateValues.vertices[0].get_component(1).tree).eq(2);
          expect(polyline.stateValues.vertices[1].get_component(0).tree).eq(-1);
          expect(polyline.stateValues.vertices[1].get_component(1).tree).eq(5);
          expect(polyline.stateValues.vertices[2].get_component(0).tree).eq('\uFF3F');
          expect(polyline.stateValues.vertices[2].get_component(1).tree).eq(7);
          expect(polyline.stateValues.vertices[3].get_component(0).tree).eq(3);
          expect(polyline.stateValues.vertices[3].get_component(1).tree).eq(-5);
          expect(polyline.stateValues.vertices[4].get_component(0).tree).eq(-4);
          expect(polyline.stateValues.vertices[4].get_component(1).tree).eq(-3);
        }
      })

      cy.get('#\\/_mathinput1_input').clear().type("-2{enter}");
      cy.window().then((win) => {
        for (let polyline of polylines) {
          expect(polyline.stateValues.nVertices).eq(5);
          expect(polyline.stateValues.vertices[0].get_component(0).tree).eq(1);
          expect(polyline.stateValues.vertices[0].get_component(1).tree).eq(2);
          expect(polyline.stateValues.vertices[1].get_component(0).tree).eq(-1);
          expect(polyline.stateValues.vertices[1].get_component(1).tree).eq(5);
          expect(polyline.stateValues.vertices[2].get_component(0).tree).eq(-2);
          expect(polyline.stateValues.vertices[2].get_component(1).tree).eq(7);
          expect(polyline.stateValues.vertices[3].get_component(0).tree).eq(3);
          expect(polyline.stateValues.vertices[3].get_component(1).tree).eq(-5);
          expect(polyline.stateValues.vertices[4].get_component(0).tree).eq(-4);
          expect(polyline.stateValues.vertices[4].get_component(1).tree).eq(-3);
        }
      })
    })
  })

  it(`can't move polyline based on map`, () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>

  <graph>
  <polyline><vertices hide="false">
    <map>
      <template><point>(<copyFromSubs/>, 5sin(<copyFromSubs/>))</point></template>
      <substitutions><sequence from="-5" to="5"/></substitutions>
    </map>
    </vertices></polyline>
  </graph>
  
  <graph>
  <ref name="polyline2">_polyline1</ref>
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let polyline2 = components["/polyline2"].replacements[0];
      let points = components["/_map1"].replacements;

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_polyline1'].stateValues.nVertices).eq(11);
        expect(polyline2.stateValues.nVertices).eq(11);
        for (let i = -5; i <= 5; i++) {
          expect(components['/_polyline1'].stateValues.vertices[i + 5].get_component(0).tree).eq(i);
          expect(components['/_polyline1'].stateValues.vertices[i + 5].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
          expect(polyline2.stateValues.vertices[i + 5].get_component(0).tree).eq(i);
          expect(polyline2.stateValues.vertices[i + 5].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
          expect(points[i + 5].stateValues.xs[0].tree).eq(i);
          expect(points[i + 5].stateValues.xs[1].evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);

        }
      })

      cy.log("can't move points")
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        points[0].movePoint({ x: 9, y: -8 });
        points[8].movePoint({ x: -8, y: 4 });
        expect(components['/_polyline1'].stateValues.nVertices).eq(11);
        expect(polyline2.stateValues.nVertices).eq(11);
        for (let i = -5; i <= 5; i++) {
          expect(components['/_polyline1'].stateValues.vertices[i + 5].get_component(0).tree).eq(i);
          expect(components['/_polyline1'].stateValues.vertices[i + 5].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
          expect(polyline2.stateValues.vertices[i + 5].get_component(0).tree).eq(i);
          expect(polyline2.stateValues.vertices[i + 5].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
          expect(points[i + 5].stateValues.xs[0].tree).eq(i);
          expect(points[i + 5].stateValues.xs[1].evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        }
      })


      cy.log("can't move polyline1")
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let vertices = [];
        for (let i = 0; i < components['/_polyline1'].stateValues.nVertices; i++) {
          vertices.push([
            components['/_polyline1'].stateValues.vertices[i].get_component(0),
            components['/_polyline1'].stateValues.vertices[i].get_component(1)
          ])
        }

        let moveX = 3;
        let moveY = 2;

        for (let i = 0; i < vertices.length; i++) {
          vertices[i][0] = vertices[i][0].add(moveX);
          vertices[i][1] = vertices[i][1].add(moveY);
        }

        components['/_polyline1'].movePolyline(vertices);

        expect(components['/_polyline1'].stateValues.nVertices).eq(11);
        expect(polyline2.stateValues.nVertices).eq(11);
        for (let i = -5; i <= 5; i++) {
          expect(components['/_polyline1'].stateValues.vertices[i + 5].get_component(0).tree).eq(i);
          expect(components['/_polyline1'].stateValues.vertices[i + 5].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
          expect(polyline2.stateValues.vertices[i + 5].get_component(0).tree).eq(i);
          expect(polyline2.stateValues.vertices[i + 5].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
          expect(points[i + 5].stateValues.xs[0].tree).eq(i);
          expect(points[i + 5].stateValues.xs[1].evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        }
      })

      cy.log("can't move polyline2")
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let vertices = [];
        for (let i = 0; i < components['/_polyline1'].stateValues.nVertices; i++) {
          vertices.push([
            components['/_polyline1'].stateValues.vertices[i].get_component(0),
            components['/_polyline1'].stateValues.vertices[i].get_component(1)
          ])
        }

        let moveX = -5;
        let moveY = 6;

        for (let i = 0; i < vertices.length; i++) {
          vertices[i][0] = vertices[i][0].add(moveX);
          vertices[i][1] = vertices[i][1].add(moveY);
        }

        polyline2.movePolyline(vertices);

        expect(components['/_polyline1'].stateValues.nVertices).eq(11);
        expect(polyline2.stateValues.nVertices).eq(11);
        for (let i = -5; i <= 5; i++) {
          expect(components['/_polyline1'].stateValues.vertices[i + 5].get_component(0).tree).eq(i);
          expect(components['/_polyline1'].stateValues.vertices[i + 5].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
          expect(polyline2.stateValues.vertices[i + 5].get_component(0).tree).eq(i);
          expect(polyline2.stateValues.vertices[i + 5].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
          expect(points[i + 5].stateValues.xs[0].tree).eq(i);
          expect(points[i + 5].stateValues.xs[1].evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        }
      })
    })
  })

  it(`create moveable polyline based on map`, () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>

  <graph>
  <polyline><vertices hide="false">
    <map>
      <template><point>(<copyFromSubs/> + <math>0</math>, 5sin(<copyFromSubs/>) + <math>0</math>)</point></template>
      <substitutions><sequence from="-5" to="5"/></substitutions>
    </map>
    </vertices></polyline>
  </graph>
  
  <graph>
  <ref name="polyline2">_polyline1</ref>
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let polyline2 = components["/polyline2"].replacements[0];
      let points = components["/_map1"].replacements;

      let xs = [], ys = [];
      for (let i = -5; i <= 5; i++) {
        xs.push(i);
        ys.push(5 * Math.sin(i))
      }

      let nVertices = 11;

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_polyline1'].stateValues.nVertices).eq(nVertices);
        expect(polyline2.stateValues.nVertices).eq(nVertices);
        for (let i = 0; i < nVertices; i++) {
          expect(components['/_polyline1'].stateValues.vertices[i].get_component(0).tree).eq(xs[i]);
          expect(components['/_polyline1'].stateValues.vertices[i].get_component(1).evaluate_to_constant()).closeTo(ys[i], 1E-12);
          expect(polyline2.stateValues.vertices[i].get_component(0).tree).eq(xs[i]);
          expect(polyline2.stateValues.vertices[i].get_component(1).evaluate_to_constant()).closeTo(ys[i], 1E-12);
          expect(points[i].stateValues.xs[0].tree).eq(xs[i]);
          expect(points[i].stateValues.xs[1].evaluate_to_constant()).closeTo(ys[i], 1E-12);

        }
      })

      cy.log("can move points")
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        xs[0] = 9;
        ys[0] = -8;
        points[0].movePoint({ x: xs[0], y: ys[0] });
        xs[8] = -8;
        ys[8] = -4;
        points[8].movePoint({ x: xs[8], y: ys[8] });

        expect(components['/_polyline1'].stateValues.nVertices).eq(nVertices);
        expect(polyline2.stateValues.nVertices).eq(nVertices);
        for (let i = 0; i < nVertices; i++) {
          expect(components['/_polyline1'].stateValues.vertices[i].get_component(0).tree).eq(xs[i]);
          expect(components['/_polyline1'].stateValues.vertices[i].get_component(1).evaluate_to_constant()).closeTo(ys[i], 1E-12);
          expect(polyline2.stateValues.vertices[i].get_component(0).tree).eq(xs[i]);
          expect(polyline2.stateValues.vertices[i].get_component(1).evaluate_to_constant()).closeTo(ys[i], 1E-12);
          expect(points[i].stateValues.xs[0].tree).eq(xs[i]);
          expect(points[i].stateValues.xs[1].evaluate_to_constant()).closeTo(ys[i], 1E-12);
        }
      })


      cy.log("can move polyline1")
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let vertices = [];
        for (let i = 0; i < nVertices; i++) {
          vertices.push([
            components['/_polyline1'].stateValues.vertices[i].get_component(0),
            components['/_polyline1'].stateValues.vertices[i].get_component(1)
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

        components['/_polyline1'].movePolyline(vertices);

        expect(components['/_polyline1'].stateValues.nVertices).eq(nVertices);
        expect(polyline2.stateValues.nVertices).eq(nVertices);
        for (let i = 0; i < nVertices; i++) {
          expect(components['/_polyline1'].stateValues.vertices[i].get_component(0).tree).eq(xs[i]);
          expect(components['/_polyline1'].stateValues.vertices[i].get_component(1).evaluate_to_constant()).closeTo(ys[i], 1E-12);
          expect(polyline2.stateValues.vertices[i].get_component(0).tree).eq(xs[i]);
          expect(polyline2.stateValues.vertices[i].get_component(1).evaluate_to_constant()).closeTo(ys[i], 1E-12);
          expect(points[i].stateValues.xs[0].tree).eq(xs[i]);
          expect(points[i].stateValues.xs[1].evaluate_to_constant()).closeTo(ys[i], 1E-12);
        }
      })

      cy.log("can move polyline2")
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let vertices = [];
        for (let i = 0; i < nVertices; i++) {
          vertices.push([
            components['/_polyline1'].stateValues.vertices[i].get_component(0),
            components['/_polyline1'].stateValues.vertices[i].get_component(1)
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

        polyline2.movePolyline(vertices);

        expect(components['/_polyline1'].stateValues.nVertices).eq(nVertices);
        expect(polyline2.stateValues.nVertices).eq(nVertices);
        for (let i = 0; i < nVertices; i++) {
          expect(components['/_polyline1'].stateValues.vertices[i].get_component(0).tree).eq(xs[i]);
          expect(components['/_polyline1'].stateValues.vertices[i].get_component(1).evaluate_to_constant()).closeTo(ys[i], 1E-12);
          expect(polyline2.stateValues.vertices[i].get_component(0).tree).eq(xs[i]);
          expect(polyline2.stateValues.vertices[i].get_component(1).evaluate_to_constant()).closeTo(ys[i], 1E-12);
          expect(points[i].stateValues.xs[0].tree).eq(xs[i]);
          expect(points[i].stateValues.xs[1].evaluate_to_constant()).closeTo(ys[i], 1E-12);
        }
      })
    })
  })

  it('ref vertices of polyline', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <polyline>(-3,-1),(1,2),(3,4),(6,-2)</polyline>
  </graph>
  <graph>
  <ref name="v1" prop="vertex1">_polyline1</ref>
  <ref name="v2" prop="vertex2">_polyline1</ref>
  <ref name="v3" prop="vertex3">_polyline1</ref>
  <ref name="v4" prop="vertex4">_polyline1</ref>
  </graph>
  <graph>
  <ref name="vs" prop="vertices">_polyline1</ref>
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let polylineVs = components["/_polyline1"].activeChildren[0].activeChildren;
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

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let ps = [[-3, -1], [1, 2], [3, 4], [6, -2]];

        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 3; j++) {
            expect(components[pointnames[i][j]].stateValues.xs[0].tree).eq(ps[i][0]);
            expect(components[pointnames[i][j]].stateValues.xs[1].tree).eq(ps[i][1]);
          }
        }
      })

      cy.log('move individually reffed vertices');
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let ps = [[-5, 3], [-2, 7], [0, -8], [9, -6]];

        for (let i = 0; i < 4; i++) {
          components[pointnames[i][1]].movePoint({ x: ps[i][0], y: ps[i][1] });
        }

        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 3; j++) {
            expect(components[pointnames[i][j]].stateValues.xs[0].tree).eq(ps[i][0]);
            expect(components[pointnames[i][j]].stateValues.xs[1].tree).eq(ps[i][1]);
          }
        }

      })

      cy.log('move array-reffed vertices');
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let ps = [[-7, -1], [-3, 5], [2, 4], [6, 0]];

        for (let i = 0; i < 4; i++) {
          components[pointnames[i][2]].movePoint({ x: ps[i][0], y: ps[i][1] });
        }

        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 3; j++) {
            expect(components[pointnames[i][j]].stateValues.xs[0].tree).eq(ps[i][0]);
            expect(components[pointnames[i][j]].stateValues.xs[1].tree).eq(ps[i][1]);
          }
        }

      })
    })
  })

  it('new polyline from reffed vertices of polyline', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <polyline>(-9,6),(-3,7),(4,0),(8,5)</polyline>
  </graph>
  <graph>
  <polyline>
    <ref prop="vertices">_polyline1</ref>
  </polyline>
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let polyline1Vs = components["/_polyline1"].activeChildren[0].activeChildren;
      let polyline2Vs = components["/_polyline2"].activeChildren[0].activeChildren;
      let pointnames = [
        [polyline1Vs[0].componentName, polyline2Vs[0].componentName],
        [polyline1Vs[1].componentName, polyline2Vs[1].componentName],
        [polyline1Vs[2].componentName, polyline2Vs[2].componentName],
        [polyline1Vs[3].componentName, polyline2Vs[3].componentName]
      ];

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let ps = [[-9, 6], [-3, 7], [4, 0], [8, 5]];

        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 2; j++) {
            expect(components[pointnames[i][j]].stateValues.xs[0].tree).eq(ps[i][0]);
            expect(components[pointnames[i][j]].stateValues.xs[1].tree).eq(ps[i][1]);
            expect(components['/_polyline1'].stateValues.vertices[i].tree).eqls(['vector', ps[i][0], ps[i][1]]);
            expect(components['/_polyline2'].stateValues.vertices[i].tree).eqls(['vector', ps[i][0], ps[i][1]]);
          }
        }
      })

      cy.log('move first polyline up and to the right')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let ps = [[-9, 6], [-3, 7], [4, 0], [8, 5]];

        let vertices = [];
        for (let i = 0; i < components['/_polyline1'].stateValues.nVertices; i++) {
          vertices.push([
            components['/_polyline1'].stateValues.vertices[i].get_component(0),
            components['/_polyline1'].stateValues.vertices[i].get_component(1)
          ])
        }

        let moveX = 4;
        let moveY = 2;

        for (let i = 0; i < vertices.length; i++) {
          vertices[i][0] = vertices[i][0].add(moveX);
          vertices[i][1] = vertices[i][1].add(moveY);
        }

        components['/_polyline1'].movePolyline(vertices);

        for (let i = 0; i < vertices.length; i++) {
          ps[i][0] += moveX;
          ps[i][1] += moveY;
        }

        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 2; j++) {
            expect(components[pointnames[i][j]].stateValues.xs[0].tree).eq(ps[i][0]);
            expect(components[pointnames[i][j]].stateValues.xs[1].tree).eq(ps[i][1]);
            expect(components['/_polyline1'].stateValues.vertices[i].tree).eqls(['vector', ps[i][0], ps[i][1]]);
            expect(components['/_polyline2'].stateValues.vertices[i].tree).eqls(['vector', ps[i][0], ps[i][1]]);
          }
        }

      })


      cy.log('move second line segment up and to the left')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let vertices = [];
        for (let i = 0; i < components['/_polyline2'].stateValues.nVertices; i++) {
          vertices.push([
            components['/_polyline2'].stateValues.vertices[i].get_component(0),
            components['/_polyline2'].stateValues.vertices[i].get_component(1)
          ])
        }

        let moveX = -7;
        let moveY = 3;

        for (let i = 0; i < vertices.length; i++) {
          vertices[i][0] = vertices[i][0].add(moveX);
          vertices[i][1] = vertices[i][1].add(moveY);
        }

        components['/_polyline2'].movePolyline(vertices);

        let ps = [[-9, 6], [-3, 7], [4, 0], [8, 5]];

        for (let i = 0; i < vertices.length; i++) {
          ps[i][0] += 4 + moveX;
          ps[i][1] += 2 + moveY;
        }

        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 2; j++) {
            expect(components[pointnames[i][j]].stateValues.xs[0].tree).eq(ps[i][0]);
            expect(components[pointnames[i][j]].stateValues.xs[1].tree).eq(ps[i][1]);
            expect(components['/_polyline1'].stateValues.vertices[i].tree).eqls(['vector', ps[i][0], ps[i][1]]);
            expect(components['/_polyline2'].stateValues.vertices[i].tree).eqls(['vector', ps[i][0], ps[i][1]]);
          }
        }

      })
    })

  })

  it('new polyline from reffed vertices, some flipped', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <polyline>(-9,6),(-3,7),(4,0),(8,5)</polyline>
  </graph>
  <graph>
  <polyline>
    <ref prop="vertex1">_polyline1</ref>
    <point>
      (<extract prop="y"><ref prop="vertex2">_polyline1</ref></extract>,
      <extract prop="x"><ref prop="vertex2">_polyline1</ref></extract>)
    </point>
    <ref prop="vertex3">_polyline1</ref>
    <point>
      <x><extract prop="y"><ref prop="vertex4">_polyline1</ref></extract></x>
      <y><extract prop="x"><ref prop="vertex4">_polyline1</ref></extract></y>
    </point>
  </polyline>
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let ps = [[-9, 6], [-3, 7], [4, 0], [8, 5]];
      let psflipped = [[-9, 6], [7, -3], [4, 0], [5, 8]];
      let components = Object.assign({}, win.state.components);
      expect(components['/_polyline1'].stateValues.vertices[0].tree).eqls(['vector', ...ps[0]]);
      expect(components['/_polyline1'].stateValues.vertices[1].tree).eqls(['vector', ...ps[1]]);
      expect(components['/_polyline1'].stateValues.vertices[2].tree).eqls(['vector', ...ps[2]]);
      expect(components['/_polyline1'].stateValues.vertices[3].tree).eqls(['vector', ...ps[3]]);
      expect(components['/_polyline2'].stateValues.vertices[0].tree).eqls(['vector', ...psflipped[0]]);
      expect(components['/_polyline2'].stateValues.vertices[1].tree).eqls(['vector', ...psflipped[1]]);
      expect(components['/_polyline2'].stateValues.vertices[2].tree).eqls(['vector', ...psflipped[2]]);
      expect(components['/_polyline2'].stateValues.vertices[3].tree).eqls(['vector', ...psflipped[3]]);
    })

    cy.log('move first polyline verticies')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let ps = [[7, 2], [1, -3], [2, 9], [-4, -3]];
      let psflipped = [[7, 2], [-3, 1], [2, 9], [-3, -4]];

      components['/_polyline1'].movePolyline(ps);

      expect(components['/_polyline1'].stateValues.vertices[0].tree).eqls(['vector', ...ps[0]]);
      expect(components['/_polyline1'].stateValues.vertices[1].tree).eqls(['vector', ...ps[1]]);
      expect(components['/_polyline1'].stateValues.vertices[2].tree).eqls(['vector', ...ps[2]]);
      expect(components['/_polyline1'].stateValues.vertices[3].tree).eqls(['vector', ...ps[3]]);
      expect(components['/_polyline2'].stateValues.vertices[0].tree).eqls(['vector', ...psflipped[0]]);
      expect(components['/_polyline2'].stateValues.vertices[1].tree).eqls(['vector', ...psflipped[1]]);
      expect(components['/_polyline2'].stateValues.vertices[2].tree).eqls(['vector', ...psflipped[2]]);
      expect(components['/_polyline2'].stateValues.vertices[3].tree).eqls(['vector', ...psflipped[3]]);

    })

    cy.log('move second polyline verticies')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let ps = [[-1, 9], [7, 5], [-8, 1], [6, -7]];
      let psflipped = [[-1, 9], [5, 7], [-8, 1], [-7, 6]];

      components['/_polyline2'].movePolyline(psflipped);

      expect(components['/_polyline1'].stateValues.vertices[0].tree).eqls(['vector', ...ps[0]]);
      expect(components['/_polyline1'].stateValues.vertices[1].tree).eqls(['vector', ...ps[1]]);
      expect(components['/_polyline1'].stateValues.vertices[2].tree).eqls(['vector', ...ps[2]]);
      expect(components['/_polyline1'].stateValues.vertices[3].tree).eqls(['vector', ...ps[3]]);
      expect(components['/_polyline2'].stateValues.vertices[0].tree).eqls(['vector', ...psflipped[0]]);
      expect(components['/_polyline2'].stateValues.vertices[1].tree).eqls(['vector', ...psflipped[1]]);
      expect(components['/_polyline2'].stateValues.vertices[2].tree).eqls(['vector', ...psflipped[2]]);
      expect(components['/_polyline2'].stateValues.vertices[3].tree).eqls(['vector', ...psflipped[3]]);

    })


  })

  it('four vertex polyline based on three points', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <polyline>
    <point name="A">(1,2)</point>
    <point name="B">(3,4)</point>
    <point name="C">(-5,6)</point>
    <point name="D">
      <x><ref fixed prop="x">C</ref>+<ref fixed prop="x">B</ref>-<ref prop="x">A</ref></x>
      <y><ref fixed prop="y">C</ref>+<ref fixed prop="y">B</ref>-<ref prop="y">A</ref></y>
    </point>
  </polyline>
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let A = [1, 2];
    let B = [3, 4];
    let C = [-5, 6];
    let D = [C[0] + B[0] - A[0], C[1] + B[1] - A[1]];
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_polyline1'].stateValues.vertices[0].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[1].tree).eqls(['vector', ...B]);
      expect(components['/_polyline1'].stateValues.vertices[2].tree).eqls(['vector', ...C]);
      expect(components['/_polyline1'].stateValues.vertices[3].tree).eqls(['vector', ...D]);
    })

    cy.log('move first vertex')
    cy.window().then((win) => {
      A = [-4, -1];
      D = [C[0] + B[0] - A[0], C[1] + B[1] - A[1]];

      let components = Object.assign({}, win.state.components);
      components['/_polyline1'].movePolyline({ 0: A });
      expect(components['/_polyline1'].stateValues.vertices[0].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[1].tree).eqls(['vector', ...B]);
      expect(components['/_polyline1'].stateValues.vertices[2].tree).eqls(['vector', ...C]);
      expect(components['/_polyline1'].stateValues.vertices[3].tree).eqls(['vector', ...D]);
    })

    cy.log('move second vertex')
    cy.window().then((win) => {
      B = [8, 9];
      D = [C[0] + B[0] - A[0], C[1] + B[1] - A[1]];

      let components = Object.assign({}, win.state.components);
      components['/_polyline1'].movePolyline({ 1: B });
      expect(components['/_polyline1'].stateValues.vertices[0].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[1].tree).eqls(['vector', ...B]);
      expect(components['/_polyline1'].stateValues.vertices[2].tree).eqls(['vector', ...C]);
      expect(components['/_polyline1'].stateValues.vertices[3].tree).eqls(['vector', ...D]);
    })

    cy.log('move third vertex')
    cy.window().then((win) => {
      C = [-3, 7];
      D = [C[0] + B[0] - A[0], C[1] + B[1] - A[1]];

      let components = Object.assign({}, win.state.components);
      components['/_polyline1'].movePolyline({ 2: C });
      expect(components['/_polyline1'].stateValues.vertices[0].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[1].tree).eqls(['vector', ...B]);
      expect(components['/_polyline1'].stateValues.vertices[2].tree).eqls(['vector', ...C]);
      expect(components['/_polyline1'].stateValues.vertices[3].tree).eqls(['vector', ...D]);
    })

    cy.log('move fourth vertex')
    cy.window().then((win) => {
      D = [7, 0];
      A = [C[0] + B[0] - D[0], C[1] + B[1] - D[1]];
      let components = Object.assign({}, win.state.components);
      components['/_polyline1'].movePolyline({ 3: D });
      expect(components['/_polyline1'].stateValues.vertices[0].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[1].tree).eqls(['vector', ...B]);
      expect(components['/_polyline1'].stateValues.vertices[2].tree).eqls(['vector', ...C]);
      expect(components['/_polyline1'].stateValues.vertices[3].tree).eqls(['vector', ...D]);
    })

  })

  it('fourth vertex depends on internal ref of first vertex', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <polyline>
  <vertices>
  <point>(1,2)</point>
  <point>(3,4)</point>
  <point>(-5,6)</point>
  <ref prop="vertex1">_polyline1</ref>
  </vertices>
  </polyline>
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let A = [1, 2];
    let B = [3, 4];
    let C = [-5, 6];
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_polyline1'].stateValues.vertices[0].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[1].tree).eqls(['vector', ...B]);
      expect(components['/_polyline1'].stateValues.vertices[2].tree).eqls(['vector', ...C]);
      expect(components['/_polyline1'].stateValues.vertices[3].tree).eqls(['vector', ...A]);
    })

    cy.log('move first vertex')
    cy.window().then((win) => {
      A = [-4, -1];

      let components = Object.assign({}, win.state.components);
      components['/_polyline1'].movePolyline({ 0: A });
      expect(components['/_polyline1'].stateValues.vertices[0].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[1].tree).eqls(['vector', ...B]);
      expect(components['/_polyline1'].stateValues.vertices[2].tree).eqls(['vector', ...C]);
      expect(components['/_polyline1'].stateValues.vertices[3].tree).eqls(['vector', ...A]);
    })

    cy.log('move second vertex')
    cy.window().then((win) => {
      B = [8, 9];

      let components = Object.assign({}, win.state.components);
      components['/_polyline1'].movePolyline({ 1: B });
      expect(components['/_polyline1'].stateValues.vertices[0].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[1].tree).eqls(['vector', ...B]);
      expect(components['/_polyline1'].stateValues.vertices[2].tree).eqls(['vector', ...C]);
      expect(components['/_polyline1'].stateValues.vertices[3].tree).eqls(['vector', ...A]);
    })

    cy.log('move third vertex')
    cy.window().then((win) => {
      C = [-3, 7];

      let components = Object.assign({}, win.state.components);
      components['/_polyline1'].movePolyline({ 2: C });
      expect(components['/_polyline1'].stateValues.vertices[0].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[1].tree).eqls(['vector', ...B]);
      expect(components['/_polyline1'].stateValues.vertices[2].tree).eqls(['vector', ...C]);
      expect(components['/_polyline1'].stateValues.vertices[3].tree).eqls(['vector', ...A]);
    })

    cy.log('move fourth vertex')
    cy.window().then((win) => {
      A = [7, 0];
      let components = Object.assign({}, win.state.components);
      components['/_polyline1'].movePolyline({ 3: A });
      expect(components['/_polyline1'].stateValues.vertices[0].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[1].tree).eqls(['vector', ...B]);
      expect(components['/_polyline1'].stateValues.vertices[2].tree).eqls(['vector', ...C]);
      expect(components['/_polyline1'].stateValues.vertices[3].tree).eqls(['vector', ...A]);
    })

  })

  it('first vertex depends on internal ref of fourth vertex', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <polyline>
  <vertices>
  <ref prop="vertex4" includeUndefinedArrayEntries>_polyline1</ref>
  <point>(3,4)</point>
  <point>(-5,6)</point>
  <point>(1,2)</point>
  </vertices>
  </polyline>
  </graph>
  
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let A = [1, 2];
    let B = [3, 4];
    let C = [-5, 6];
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_polyline1'].stateValues.vertices[0].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[1].tree).eqls(['vector', ...B]);
      expect(components['/_polyline1'].stateValues.vertices[2].tree).eqls(['vector', ...C]);
      expect(components['/_polyline1'].stateValues.vertices[3].tree).eqls(['vector', ...A]);
    })

    cy.log('move first vertex')
    cy.window().then((win) => {
      A = [-4, -1];

      let components = Object.assign({}, win.state.components);
      components['/_polyline1'].movePolyline({ 0: A });
      expect(components['/_polyline1'].stateValues.vertices[0].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[1].tree).eqls(['vector', ...B]);
      expect(components['/_polyline1'].stateValues.vertices[2].tree).eqls(['vector', ...C]);
      expect(components['/_polyline1'].stateValues.vertices[3].tree).eqls(['vector', ...A]);
    })

    cy.log('move second vertex')
    cy.window().then((win) => {
      B = [8, 9];

      let components = Object.assign({}, win.state.components);
      components['/_polyline1'].movePolyline({ 1: B });
      expect(components['/_polyline1'].stateValues.vertices[0].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[1].tree).eqls(['vector', ...B]);
      expect(components['/_polyline1'].stateValues.vertices[2].tree).eqls(['vector', ...C]);
      expect(components['/_polyline1'].stateValues.vertices[3].tree).eqls(['vector', ...A]);
    })

    cy.log('move third vertex')
    cy.window().then((win) => {
      C = [-3, 7];

      let components = Object.assign({}, win.state.components);
      components['/_polyline1'].movePolyline({ 2: C });
      expect(components['/_polyline1'].stateValues.vertices[0].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[1].tree).eqls(['vector', ...B]);
      expect(components['/_polyline1'].stateValues.vertices[2].tree).eqls(['vector', ...C]);
      expect(components['/_polyline1'].stateValues.vertices[3].tree).eqls(['vector', ...A]);
    })

    cy.log('move fourth vertex')
    cy.window().then((win) => {
      A = [7, 0];
      let components = Object.assign({}, win.state.components);
      components['/_polyline1'].movePolyline({ 3: A });
      expect(components['/_polyline1'].stateValues.vertices[0].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[1].tree).eqls(['vector', ...B]);
      expect(components['/_polyline1'].stateValues.vertices[2].tree).eqls(['vector', ...C]);
      expect(components['/_polyline1'].stateValues.vertices[3].tree).eqls(['vector', ...A]);
    })

  })

  it('first vertex depends fourth, formula for fifth', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <polyline>
  <vertices>
  <ref prop="vertex4">_polyline1</ref>
  <point>(3,4)</point>
  <point>(-5,6)</point>
  <point>(1,2)</point>
  <point>
    <x><extract prop="x"><ref prop="vertex1">_polyline1</ref></extract>+1</x>
    <y>2</y>
  </point>
  </vertices>
  </polyline>
  </graph>
  
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let A = [1, 2];
    let B = [3, 4];
    let C = [-5, 6];
    let D = [A[0] + 1, 2];
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_polyline1'].stateValues.vertices[0].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[1].tree).eqls(['vector', ...B]);
      expect(components['/_polyline1'].stateValues.vertices[2].tree).eqls(['vector', ...C]);
      expect(components['/_polyline1'].stateValues.vertices[3].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[4].tree).eqls(['vector', ...D]);
    })

    cy.log('move first vertex')
    cy.window().then((win) => {
      A = [-4, -1];
      D[0] = A[0] + 1;

      let components = Object.assign({}, win.state.components);
      components['/_polyline1'].movePolyline({ 0: A });
      expect(components['/_polyline1'].stateValues.vertices[0].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[1].tree).eqls(['vector', ...B]);
      expect(components['/_polyline1'].stateValues.vertices[2].tree).eqls(['vector', ...C]);
      expect(components['/_polyline1'].stateValues.vertices[3].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[4].tree).eqls(['vector', ...D]);
    })

    cy.log('move second vertex')
    cy.window().then((win) => {
      B = [8, 9];

      let components = Object.assign({}, win.state.components);
      components['/_polyline1'].movePolyline({ 1: B });
      expect(components['/_polyline1'].stateValues.vertices[0].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[1].tree).eqls(['vector', ...B]);
      expect(components['/_polyline1'].stateValues.vertices[2].tree).eqls(['vector', ...C]);
      expect(components['/_polyline1'].stateValues.vertices[3].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[4].tree).eqls(['vector', ...D]);
    })

    cy.log('move third vertex')
    cy.window().then((win) => {
      C = [-3, 7];

      let components = Object.assign({}, win.state.components);
      components['/_polyline1'].movePolyline({ 2: C });
      expect(components['/_polyline1'].stateValues.vertices[0].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[1].tree).eqls(['vector', ...B]);
      expect(components['/_polyline1'].stateValues.vertices[2].tree).eqls(['vector', ...C]);
      expect(components['/_polyline1'].stateValues.vertices[3].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[4].tree).eqls(['vector', ...D]);
    })

    cy.log('move fourth vertex')
    cy.window().then((win) => {
      A = [7, 0];
      D[0] = A[0] + 1;
      let components = Object.assign({}, win.state.components);
      components['/_polyline1'].movePolyline({ 3: A });
      expect(components['/_polyline1'].stateValues.vertices[0].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[1].tree).eqls(['vector', ...B]);
      expect(components['/_polyline1'].stateValues.vertices[2].tree).eqls(['vector', ...C]);
      expect(components['/_polyline1'].stateValues.vertices[3].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[4].tree).eqls(['vector', ...D]);
    })


    cy.log('move fifth vertex')
    cy.window().then((win) => {
      D = [-5, 9];
      A[0] = D[0] - 1;
      let components = Object.assign({}, win.state.components);
      components['/_polyline1'].movePolyline({ 4: D });
      expect(components['/_polyline1'].stateValues.vertices[0].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[1].tree).eqls(['vector', ...B]);
      expect(components['/_polyline1'].stateValues.vertices[2].tree).eqls(['vector', ...C]);
      expect(components['/_polyline1'].stateValues.vertices[3].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[4].tree).eqls(['vector', ...D]);
    })

  })

  it('first, fourth, seventh vertex depends on fourth, seventh, tenth', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <polyline>
  <vertices>
    <ref prop="vertex4">_polyline1</ref>
    <point>(1,2)</point>
    <point>(3,4)</point>
    <ref prop="vertex7">_polyline1</ref>
    <point>(5,7)</point>
    <point>(-5,7)</point>
    <ref prop="vertex10" includeUndefinedArrayEntries>_polyline1</ref>
    <point>(3,1)</point>
    <point>(5,0)</point>
    <point>(-5,-1)</point>
  </vertices>
  </polyline>
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
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_polyline1'].stateValues.vertices[0].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[1].tree).eqls(['vector', ...B]);
      expect(components['/_polyline1'].stateValues.vertices[2].tree).eqls(['vector', ...C]);
      expect(components['/_polyline1'].stateValues.vertices[3].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[4].tree).eqls(['vector', ...D]);
      expect(components['/_polyline1'].stateValues.vertices[5].tree).eqls(['vector', ...E]);
      expect(components['/_polyline1'].stateValues.vertices[6].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[7].tree).eqls(['vector', ...F]);
      expect(components['/_polyline1'].stateValues.vertices[8].tree).eqls(['vector', ...G]);
      expect(components['/_polyline1'].stateValues.vertices[9].tree).eqls(['vector', ...A]);
    })

    cy.log('move first vertex')
    cy.window().then((win) => {
      A = [-4, -9];

      let components = Object.assign({}, win.state.components);
      components['/_polyline1'].movePolyline({ 0: A });
      expect(components['/_polyline1'].stateValues.vertices[0].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[1].tree).eqls(['vector', ...B]);
      expect(components['/_polyline1'].stateValues.vertices[2].tree).eqls(['vector', ...C]);
      expect(components['/_polyline1'].stateValues.vertices[3].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[4].tree).eqls(['vector', ...D]);
      expect(components['/_polyline1'].stateValues.vertices[5].tree).eqls(['vector', ...E]);
      expect(components['/_polyline1'].stateValues.vertices[6].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[7].tree).eqls(['vector', ...F]);
      expect(components['/_polyline1'].stateValues.vertices[8].tree).eqls(['vector', ...G]);
      expect(components['/_polyline1'].stateValues.vertices[9].tree).eqls(['vector', ...A]);
    })

    cy.log('move second vertex')
    cy.window().then((win) => {
      B = [8, 9];

      let components = Object.assign({}, win.state.components);
      components['/_polyline1'].movePolyline({ 1: B });
      expect(components['/_polyline1'].stateValues.vertices[0].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[1].tree).eqls(['vector', ...B]);
      expect(components['/_polyline1'].stateValues.vertices[2].tree).eqls(['vector', ...C]);
      expect(components['/_polyline1'].stateValues.vertices[3].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[4].tree).eqls(['vector', ...D]);
      expect(components['/_polyline1'].stateValues.vertices[5].tree).eqls(['vector', ...E]);
      expect(components['/_polyline1'].stateValues.vertices[6].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[7].tree).eqls(['vector', ...F]);
      expect(components['/_polyline1'].stateValues.vertices[8].tree).eqls(['vector', ...G]);
      expect(components['/_polyline1'].stateValues.vertices[9].tree).eqls(['vector', ...A]);
    })

    cy.log('move third vertex')
    cy.window().then((win) => {
      C = [-3, 7];

      let components = Object.assign({}, win.state.components);
      components['/_polyline1'].movePolyline({ 2: C });
      expect(components['/_polyline1'].stateValues.vertices[0].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[1].tree).eqls(['vector', ...B]);
      expect(components['/_polyline1'].stateValues.vertices[2].tree).eqls(['vector', ...C]);
      expect(components['/_polyline1'].stateValues.vertices[3].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[4].tree).eqls(['vector', ...D]);
      expect(components['/_polyline1'].stateValues.vertices[5].tree).eqls(['vector', ...E]);
      expect(components['/_polyline1'].stateValues.vertices[6].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[7].tree).eqls(['vector', ...F]);
      expect(components['/_polyline1'].stateValues.vertices[8].tree).eqls(['vector', ...G]);
      expect(components['/_polyline1'].stateValues.vertices[9].tree).eqls(['vector', ...A]);
    })

    cy.log('move fourth vertex')
    cy.window().then((win) => {
      A = [7, 0];
      let components = Object.assign({}, win.state.components);
      components['/_polyline1'].movePolyline({ 3: A });
      expect(components['/_polyline1'].stateValues.vertices[0].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[1].tree).eqls(['vector', ...B]);
      expect(components['/_polyline1'].stateValues.vertices[2].tree).eqls(['vector', ...C]);
      expect(components['/_polyline1'].stateValues.vertices[3].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[4].tree).eqls(['vector', ...D]);
      expect(components['/_polyline1'].stateValues.vertices[5].tree).eqls(['vector', ...E]);
      expect(components['/_polyline1'].stateValues.vertices[6].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[7].tree).eqls(['vector', ...F]);
      expect(components['/_polyline1'].stateValues.vertices[8].tree).eqls(['vector', ...G]);
      expect(components['/_polyline1'].stateValues.vertices[9].tree).eqls(['vector', ...A]);
    })

    cy.log('move fifth vertex')
    cy.window().then((win) => {
      D = [-9, 1];
      let components = Object.assign({}, win.state.components);
      components['/_polyline1'].movePolyline({ 4: D });
      expect(components['/_polyline1'].stateValues.vertices[0].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[1].tree).eqls(['vector', ...B]);
      expect(components['/_polyline1'].stateValues.vertices[2].tree).eqls(['vector', ...C]);
      expect(components['/_polyline1'].stateValues.vertices[3].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[4].tree).eqls(['vector', ...D]);
      expect(components['/_polyline1'].stateValues.vertices[5].tree).eqls(['vector', ...E]);
      expect(components['/_polyline1'].stateValues.vertices[6].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[7].tree).eqls(['vector', ...F]);
      expect(components['/_polyline1'].stateValues.vertices[8].tree).eqls(['vector', ...G]);
      expect(components['/_polyline1'].stateValues.vertices[9].tree).eqls(['vector', ...A]);
    })

    cy.log('move sixth vertex')
    cy.window().then((win) => {
      E = [-3, 6];
      let components = Object.assign({}, win.state.components);
      components['/_polyline1'].movePolyline({ 5: E });
      expect(components['/_polyline1'].stateValues.vertices[0].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[1].tree).eqls(['vector', ...B]);
      expect(components['/_polyline1'].stateValues.vertices[2].tree).eqls(['vector', ...C]);
      expect(components['/_polyline1'].stateValues.vertices[3].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[4].tree).eqls(['vector', ...D]);
      expect(components['/_polyline1'].stateValues.vertices[5].tree).eqls(['vector', ...E]);
      expect(components['/_polyline1'].stateValues.vertices[6].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[7].tree).eqls(['vector', ...F]);
      expect(components['/_polyline1'].stateValues.vertices[8].tree).eqls(['vector', ...G]);
      expect(components['/_polyline1'].stateValues.vertices[9].tree).eqls(['vector', ...A]);
    })

    cy.log('move seventh vertex')
    cy.window().then((win) => {
      A = [2, -4];
      let components = Object.assign({}, win.state.components);
      components['/_polyline1'].movePolyline({ 6: A });
      expect(components['/_polyline1'].stateValues.vertices[0].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[1].tree).eqls(['vector', ...B]);
      expect(components['/_polyline1'].stateValues.vertices[2].tree).eqls(['vector', ...C]);
      expect(components['/_polyline1'].stateValues.vertices[3].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[4].tree).eqls(['vector', ...D]);
      expect(components['/_polyline1'].stateValues.vertices[5].tree).eqls(['vector', ...E]);
      expect(components['/_polyline1'].stateValues.vertices[6].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[7].tree).eqls(['vector', ...F]);
      expect(components['/_polyline1'].stateValues.vertices[8].tree).eqls(['vector', ...G]);
      expect(components['/_polyline1'].stateValues.vertices[9].tree).eqls(['vector', ...A]);
    })

    cy.log('move eighth vertex')
    cy.window().then((win) => {
      F = [6, 7];
      let components = Object.assign({}, win.state.components);
      components['/_polyline1'].movePolyline({ 7: F });
      expect(components['/_polyline1'].stateValues.vertices[0].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[1].tree).eqls(['vector', ...B]);
      expect(components['/_polyline1'].stateValues.vertices[2].tree).eqls(['vector', ...C]);
      expect(components['/_polyline1'].stateValues.vertices[3].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[4].tree).eqls(['vector', ...D]);
      expect(components['/_polyline1'].stateValues.vertices[5].tree).eqls(['vector', ...E]);
      expect(components['/_polyline1'].stateValues.vertices[6].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[7].tree).eqls(['vector', ...F]);
      expect(components['/_polyline1'].stateValues.vertices[8].tree).eqls(['vector', ...G]);
      expect(components['/_polyline1'].stateValues.vertices[9].tree).eqls(['vector', ...A]);
    })

    cy.log('move nineth vertex')
    cy.window().then((win) => {
      G = [1, -8];
      let components = Object.assign({}, win.state.components);
      components['/_polyline1'].movePolyline({ 8: G });
      expect(components['/_polyline1'].stateValues.vertices[0].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[1].tree).eqls(['vector', ...B]);
      expect(components['/_polyline1'].stateValues.vertices[2].tree).eqls(['vector', ...C]);
      expect(components['/_polyline1'].stateValues.vertices[3].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[4].tree).eqls(['vector', ...D]);
      expect(components['/_polyline1'].stateValues.vertices[5].tree).eqls(['vector', ...E]);
      expect(components['/_polyline1'].stateValues.vertices[6].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[7].tree).eqls(['vector', ...F]);
      expect(components['/_polyline1'].stateValues.vertices[8].tree).eqls(['vector', ...G]);
      expect(components['/_polyline1'].stateValues.vertices[9].tree).eqls(['vector', ...A]);
    })

    cy.log('move tenth vertex')
    cy.window().then((win) => {
      A = [-6, 10];
      let components = Object.assign({}, win.state.components);
      components['/_polyline1'].movePolyline({ 9: A });
      expect(components['/_polyline1'].stateValues.vertices[0].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[1].tree).eqls(['vector', ...B]);
      expect(components['/_polyline1'].stateValues.vertices[2].tree).eqls(['vector', ...C]);
      expect(components['/_polyline1'].stateValues.vertices[3].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[4].tree).eqls(['vector', ...D]);
      expect(components['/_polyline1'].stateValues.vertices[5].tree).eqls(['vector', ...E]);
      expect(components['/_polyline1'].stateValues.vertices[6].tree).eqls(['vector', ...A]);
      expect(components['/_polyline1'].stateValues.vertices[7].tree).eqls(['vector', ...F]);
      expect(components['/_polyline1'].stateValues.vertices[8].tree).eqls(['vector', ...G]);
      expect(components['/_polyline1'].stateValues.vertices[9].tree).eqls(['vector', ...A]);
    })

  })

  it('first, fourth, seventh vertex depends on shifted fourth, seventh, tenth', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <polyline>
  <vertices>
    <point>
      <x><extract prop="x"><ref prop="vertex4">_polyline1</ref></extract>+1</x>
      <y><extract prop="y"><ref prop="vertex4">_polyline1</ref></extract>+1</y>
    </point>
    <point>(1,2)</point>
    <point>(3,4)</point>
    <point>
      <x><extract prop="x"><ref prop="vertex7">_polyline1</ref></extract>+1</x>
      <y><extract prop="y"><ref prop="vertex7">_polyline1</ref></extract>+1</y>
    </point>
    <point>(5,7)</point>
    <point>(-5,7)</point>
    <point>
      <x><extract prop="x"><ref prop="vertex10">_polyline1</ref></extract>+1</x>
      <y><extract prop="y"><ref prop="vertex10">_polyline1</ref></extract>+1</y>
    </point>
    <point>(3,1)</point>
    <point>(5,0)</point>
    <point>(-5,-1)</point>
  </vertices>
  </polyline>
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
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_polyline1'].stateValues.vertices[0].tree).eqls(['vector', ...A3]);
      expect(components['/_polyline1'].stateValues.vertices[1].tree).eqls(['vector', ...B]);
      expect(components['/_polyline1'].stateValues.vertices[2].tree).eqls(['vector', ...C]);
      expect(components['/_polyline1'].stateValues.vertices[3].tree).eqls(['vector', ...A2]);
      expect(components['/_polyline1'].stateValues.vertices[4].tree).eqls(['vector', ...D]);
      expect(components['/_polyline1'].stateValues.vertices[5].tree).eqls(['vector', ...E]);
      expect(components['/_polyline1'].stateValues.vertices[6].tree).eqls(['vector', ...A1]);
      expect(components['/_polyline1'].stateValues.vertices[7].tree).eqls(['vector', ...F]);
      expect(components['/_polyline1'].stateValues.vertices[8].tree).eqls(['vector', ...G]);
      expect(components['/_polyline1'].stateValues.vertices[9].tree).eqls(['vector', ...A]);
    })

    cy.log('move first vertex')
    cy.window().then((win) => {
      A = [-4, -9];
      A1 = [A[0] + 1, A[1] + 1];
      A2 = [A[0] + 2, A[1] + 2];
      A3 = [A[0] + 3, A[1] + 3];

      let components = Object.assign({}, win.state.components);
      components['/_polyline1'].movePolyline({ 0: A3 });
      expect(components['/_polyline1'].stateValues.vertices[0].tree).eqls(['vector', ...A3]);
      expect(components['/_polyline1'].stateValues.vertices[1].tree).eqls(['vector', ...B]);
      expect(components['/_polyline1'].stateValues.vertices[2].tree).eqls(['vector', ...C]);
      expect(components['/_polyline1'].stateValues.vertices[3].tree).eqls(['vector', ...A2]);
      expect(components['/_polyline1'].stateValues.vertices[4].tree).eqls(['vector', ...D]);
      expect(components['/_polyline1'].stateValues.vertices[5].tree).eqls(['vector', ...E]);
      expect(components['/_polyline1'].stateValues.vertices[6].tree).eqls(['vector', ...A1]);
      expect(components['/_polyline1'].stateValues.vertices[7].tree).eqls(['vector', ...F]);
      expect(components['/_polyline1'].stateValues.vertices[8].tree).eqls(['vector', ...G]);
      expect(components['/_polyline1'].stateValues.vertices[9].tree).eqls(['vector', ...A]);
    })

    cy.log('move second vertex')
    cy.window().then((win) => {
      B = [8, 9];

      let components = Object.assign({}, win.state.components);
      components['/_polyline1'].movePolyline({ 1: B });
      expect(components['/_polyline1'].stateValues.vertices[0].tree).eqls(['vector', ...A3]);
      expect(components['/_polyline1'].stateValues.vertices[1].tree).eqls(['vector', ...B]);
      expect(components['/_polyline1'].stateValues.vertices[2].tree).eqls(['vector', ...C]);
      expect(components['/_polyline1'].stateValues.vertices[3].tree).eqls(['vector', ...A2]);
      expect(components['/_polyline1'].stateValues.vertices[4].tree).eqls(['vector', ...D]);
      expect(components['/_polyline1'].stateValues.vertices[5].tree).eqls(['vector', ...E]);
      expect(components['/_polyline1'].stateValues.vertices[6].tree).eqls(['vector', ...A1]);
      expect(components['/_polyline1'].stateValues.vertices[7].tree).eqls(['vector', ...F]);
      expect(components['/_polyline1'].stateValues.vertices[8].tree).eqls(['vector', ...G]);
      expect(components['/_polyline1'].stateValues.vertices[9].tree).eqls(['vector', ...A]);
    })

    cy.log('move third vertex')
    cy.window().then((win) => {
      C = [-3, 7];

      let components = Object.assign({}, win.state.components);
      components['/_polyline1'].movePolyline({ 2: C });
      expect(components['/_polyline1'].stateValues.vertices[0].tree).eqls(['vector', ...A3]);
      expect(components['/_polyline1'].stateValues.vertices[1].tree).eqls(['vector', ...B]);
      expect(components['/_polyline1'].stateValues.vertices[2].tree).eqls(['vector', ...C]);
      expect(components['/_polyline1'].stateValues.vertices[3].tree).eqls(['vector', ...A2]);
      expect(components['/_polyline1'].stateValues.vertices[4].tree).eqls(['vector', ...D]);
      expect(components['/_polyline1'].stateValues.vertices[5].tree).eqls(['vector', ...E]);
      expect(components['/_polyline1'].stateValues.vertices[6].tree).eqls(['vector', ...A1]);
      expect(components['/_polyline1'].stateValues.vertices[7].tree).eqls(['vector', ...F]);
      expect(components['/_polyline1'].stateValues.vertices[8].tree).eqls(['vector', ...G]);
      expect(components['/_polyline1'].stateValues.vertices[9].tree).eqls(['vector', ...A]);
    })

    cy.log('move fourth vertex')
    cy.window().then((win) => {
      A = [7, 0];
      A1 = [A[0] + 1, A[1] + 1];
      A2 = [A[0] + 2, A[1] + 2];
      A3 = [A[0] + 3, A[1] + 3];

      let components = Object.assign({}, win.state.components);
      components['/_polyline1'].movePolyline({ 3: A2 });
      expect(components['/_polyline1'].stateValues.vertices[0].tree).eqls(['vector', ...A3]);
      expect(components['/_polyline1'].stateValues.vertices[1].tree).eqls(['vector', ...B]);
      expect(components['/_polyline1'].stateValues.vertices[2].tree).eqls(['vector', ...C]);
      expect(components['/_polyline1'].stateValues.vertices[3].tree).eqls(['vector', ...A2]);
      expect(components['/_polyline1'].stateValues.vertices[4].tree).eqls(['vector', ...D]);
      expect(components['/_polyline1'].stateValues.vertices[5].tree).eqls(['vector', ...E]);
      expect(components['/_polyline1'].stateValues.vertices[6].tree).eqls(['vector', ...A1]);
      expect(components['/_polyline1'].stateValues.vertices[7].tree).eqls(['vector', ...F]);
      expect(components['/_polyline1'].stateValues.vertices[8].tree).eqls(['vector', ...G]);
      expect(components['/_polyline1'].stateValues.vertices[9].tree).eqls(['vector', ...A]);
    })

    cy.log('move fifth vertex')
    cy.window().then((win) => {
      D = [-9, 1];
      let components = Object.assign({}, win.state.components);
      components['/_polyline1'].movePolyline({ 4: D });
      expect(components['/_polyline1'].stateValues.vertices[0].tree).eqls(['vector', ...A3]);
      expect(components['/_polyline1'].stateValues.vertices[1].tree).eqls(['vector', ...B]);
      expect(components['/_polyline1'].stateValues.vertices[2].tree).eqls(['vector', ...C]);
      expect(components['/_polyline1'].stateValues.vertices[3].tree).eqls(['vector', ...A2]);
      expect(components['/_polyline1'].stateValues.vertices[4].tree).eqls(['vector', ...D]);
      expect(components['/_polyline1'].stateValues.vertices[5].tree).eqls(['vector', ...E]);
      expect(components['/_polyline1'].stateValues.vertices[6].tree).eqls(['vector', ...A1]);
      expect(components['/_polyline1'].stateValues.vertices[7].tree).eqls(['vector', ...F]);
      expect(components['/_polyline1'].stateValues.vertices[8].tree).eqls(['vector', ...G]);
      expect(components['/_polyline1'].stateValues.vertices[9].tree).eqls(['vector', ...A]);
    })

    cy.log('move sixth vertex')
    cy.window().then((win) => {
      E = [-3, 6];
      let components = Object.assign({}, win.state.components);
      components['/_polyline1'].movePolyline({ 5: E });
      expect(components['/_polyline1'].stateValues.vertices[0].tree).eqls(['vector', ...A3]);
      expect(components['/_polyline1'].stateValues.vertices[1].tree).eqls(['vector', ...B]);
      expect(components['/_polyline1'].stateValues.vertices[2].tree).eqls(['vector', ...C]);
      expect(components['/_polyline1'].stateValues.vertices[3].tree).eqls(['vector', ...A2]);
      expect(components['/_polyline1'].stateValues.vertices[4].tree).eqls(['vector', ...D]);
      expect(components['/_polyline1'].stateValues.vertices[5].tree).eqls(['vector', ...E]);
      expect(components['/_polyline1'].stateValues.vertices[6].tree).eqls(['vector', ...A1]);
      expect(components['/_polyline1'].stateValues.vertices[7].tree).eqls(['vector', ...F]);
      expect(components['/_polyline1'].stateValues.vertices[8].tree).eqls(['vector', ...G]);
      expect(components['/_polyline1'].stateValues.vertices[9].tree).eqls(['vector', ...A]);
    })

    cy.log('move seventh vertex')
    cy.window().then((win) => {
      A = [2, -4];
      A1 = [A[0] + 1, A[1] + 1];
      A2 = [A[0] + 2, A[1] + 2];
      A3 = [A[0] + 3, A[1] + 3];

      let components = Object.assign({}, win.state.components);
      components['/_polyline1'].movePolyline({ 6: A1 });
      expect(components['/_polyline1'].stateValues.vertices[0].tree).eqls(['vector', ...A3]);
      expect(components['/_polyline1'].stateValues.vertices[1].tree).eqls(['vector', ...B]);
      expect(components['/_polyline1'].stateValues.vertices[2].tree).eqls(['vector', ...C]);
      expect(components['/_polyline1'].stateValues.vertices[3].tree).eqls(['vector', ...A2]);
      expect(components['/_polyline1'].stateValues.vertices[4].tree).eqls(['vector', ...D]);
      expect(components['/_polyline1'].stateValues.vertices[5].tree).eqls(['vector', ...E]);
      expect(components['/_polyline1'].stateValues.vertices[6].tree).eqls(['vector', ...A1]);
      expect(components['/_polyline1'].stateValues.vertices[7].tree).eqls(['vector', ...F]);
      expect(components['/_polyline1'].stateValues.vertices[8].tree).eqls(['vector', ...G]);
      expect(components['/_polyline1'].stateValues.vertices[9].tree).eqls(['vector', ...A]);
    })

    cy.log('move eighth vertex')
    cy.window().then((win) => {
      F = [6, 7];
      let components = Object.assign({}, win.state.components);
      components['/_polyline1'].movePolyline({ 7: F });
      expect(components['/_polyline1'].stateValues.vertices[0].tree).eqls(['vector', ...A3]);
      expect(components['/_polyline1'].stateValues.vertices[1].tree).eqls(['vector', ...B]);
      expect(components['/_polyline1'].stateValues.vertices[2].tree).eqls(['vector', ...C]);
      expect(components['/_polyline1'].stateValues.vertices[3].tree).eqls(['vector', ...A2]);
      expect(components['/_polyline1'].stateValues.vertices[4].tree).eqls(['vector', ...D]);
      expect(components['/_polyline1'].stateValues.vertices[5].tree).eqls(['vector', ...E]);
      expect(components['/_polyline1'].stateValues.vertices[6].tree).eqls(['vector', ...A1]);
      expect(components['/_polyline1'].stateValues.vertices[7].tree).eqls(['vector', ...F]);
      expect(components['/_polyline1'].stateValues.vertices[8].tree).eqls(['vector', ...G]);
      expect(components['/_polyline1'].stateValues.vertices[9].tree).eqls(['vector', ...A]);
    })

    cy.log('move nineth vertex')
    cy.window().then((win) => {
      G = [1, -8];
      let components = Object.assign({}, win.state.components);
      components['/_polyline1'].movePolyline({ 8: G });
      expect(components['/_polyline1'].stateValues.vertices[0].tree).eqls(['vector', ...A3]);
      expect(components['/_polyline1'].stateValues.vertices[1].tree).eqls(['vector', ...B]);
      expect(components['/_polyline1'].stateValues.vertices[2].tree).eqls(['vector', ...C]);
      expect(components['/_polyline1'].stateValues.vertices[3].tree).eqls(['vector', ...A2]);
      expect(components['/_polyline1'].stateValues.vertices[4].tree).eqls(['vector', ...D]);
      expect(components['/_polyline1'].stateValues.vertices[5].tree).eqls(['vector', ...E]);
      expect(components['/_polyline1'].stateValues.vertices[6].tree).eqls(['vector', ...A1]);
      expect(components['/_polyline1'].stateValues.vertices[7].tree).eqls(['vector', ...F]);
      expect(components['/_polyline1'].stateValues.vertices[8].tree).eqls(['vector', ...G]);
      expect(components['/_polyline1'].stateValues.vertices[9].tree).eqls(['vector', ...A]);
    })

    cy.log('move tenth vertex')
    cy.window().then((win) => {
      A = [-6, 7];
      A1 = [A[0] + 1, A[1] + 1];
      A2 = [A[0] + 2, A[1] + 2];
      A3 = [A[0] + 3, A[1] + 3];

      let components = Object.assign({}, win.state.components);
      components['/_polyline1'].movePolyline({ 9: A });
      expect(components['/_polyline1'].stateValues.vertices[0].tree).eqls(['vector', ...A3]);
      expect(components['/_polyline1'].stateValues.vertices[1].tree).eqls(['vector', ...B]);
      expect(components['/_polyline1'].stateValues.vertices[2].tree).eqls(['vector', ...C]);
      expect(components['/_polyline1'].stateValues.vertices[3].tree).eqls(['vector', ...A2]);
      expect(components['/_polyline1'].stateValues.vertices[4].tree).eqls(['vector', ...D]);
      expect(components['/_polyline1'].stateValues.vertices[5].tree).eqls(['vector', ...E]);
      expect(components['/_polyline1'].stateValues.vertices[6].tree).eqls(['vector', ...A1]);
      expect(components['/_polyline1'].stateValues.vertices[7].tree).eqls(['vector', ...F]);
      expect(components['/_polyline1'].stateValues.vertices[8].tree).eqls(['vector', ...G]);
      expect(components['/_polyline1'].stateValues.vertices[9].tree).eqls(['vector', ...A]);
    })

  })

  it('attract to polyline', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <polyline>
      (3,5), (-4,-1),(5,2)
    </polyline>
    <point>
      <attractTo><ref>_polyline1</ref></attractTo>
      (7,8)
    </point>
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


    let x1 = 3, x2 = -4, x3 = 5;
    let y1 = 5, y2 = -1, y3 = 2;

    cy.log('point originally not attracted')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_point1'].stateValues.coords.tree).eqls(['vector', 7, 8]);
    })

    cy.log('move point near segment 1')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let x = 1;
      let mseg1 = (y2 - y1) / (x2 - x1);
      let y = mseg1 * (x - x1) + y1 + 0.3;
      components['/_point1'].movePoint({ x, y });
      let px = components['/_point1'].stateValues.xs[0].tree;
      let py = components['/_point1'].stateValues.xs[1].tree;

      expect(py).closeTo(mseg1 * (px - x1) + y1, 1E-6)

    })


    cy.log('move point near segment 2')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let x = 3;
      let mseg2 = (y2 - y3) / (x2 - x3);
      let y = mseg2 * (x - x2) + y2 + 0.4;
      components['/_point1'].movePoint({ x, y });
      let px = components['/_point1'].stateValues.xs[0].tree;
      let py = components['/_point1'].stateValues.xs[1].tree;

      expect(py).closeTo(mseg2 * (px - x2) + y2, 1E-6)

    })

    cy.log('move point near segment between first and last vertices')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let x = 4;
      let mseg3 = (y1 - y3) / (x1 - x3);
      let y = mseg3 * (x - x3) + y3 + 0.2;
      components['/_point1'].movePoint({ x, y });
      let px = components['/_point1'].stateValues.xs[0].tree;
      let py = components['/_point1'].stateValues.xs[1].tree;

      expect(px).closeTo(x, 1E-6);
      expect(py).closeTo(y, 1E-6);

    })

    cy.log('move point just past first vertex')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let x = x1 + 0.2;
      let y = y1 + 0.3;
      components['/_point1'].movePoint({ x, y });
      let px = components['/_point1'].stateValues.xs[0].tree;
      let py = components['/_point1'].stateValues.xs[1].tree;

      expect(px).closeTo(x1, 1E-6);
      expect(py).closeTo(y1, 1E-6);

    })

    cy.log('point not attracted along extension of first segment')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let x = 4;
      let mseg1 = (y2 - y1) / (x2 - x1);
      let y = mseg1 * (x - x1) + y1 + 0.3;
      components['/_point1'].movePoint({ x, y });
      let px = components['/_point1'].stateValues.xs[0].tree;
      let py = components['/_point1'].stateValues.xs[1].tree;

      expect(px).closeTo(x, 1E-6);
      expect(py).closeTo(y, 1E-6);


      x = -5;
      y = mseg1 * (x - x1) + y1 - 0.3;
      components['/_point1'].movePoint({ x, y });
      px = components['/_point1'].stateValues.xs[0].tree;
      py = components['/_point1'].stateValues.xs[1].tree;

      expect(px).closeTo(x, 1E-6);
      expect(py).closeTo(y, 1E-6);

    })


    cy.log('move point just past second vertex')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let x = x2 - 0.2;
      let y = y2 - 0.3;
      components['/_point1'].movePoint({ x, y });
      let px = components['/_point1'].stateValues.xs[0].tree;
      let py = components['/_point1'].stateValues.xs[1].tree;

      expect(px).closeTo(x2, 1E-6);
      expect(py).closeTo(y2, 1E-6);

    })


    cy.log('point not attracted along extension of second segment')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let x = 6;
      let mseg2 = (y2 - y3) / (x2 - x3);
      let y = mseg2 * (x - x2) + y2 + 0.3;
      components['/_point1'].movePoint({ x, y });
      let px = components['/_point1'].stateValues.xs[0].tree;
      let py = components['/_point1'].stateValues.xs[1].tree;

      expect(px).closeTo(x, 1E-6);
      expect(py).closeTo(y, 1E-6);


      x = -5;
      y = mseg2 * (x - x2) + y2 - 0.3;
      components['/_point1'].movePoint({ x, y });
      px = components['/_point1'].stateValues.xs[0].tree;
      py = components['/_point1'].stateValues.xs[1].tree;

      expect(px).closeTo(x, 1E-6);
      expect(py).closeTo(y, 1E-6);

    })



    cy.log('move polyline so point attracts to first segment')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let vertices = [];
      for (let i = 0; i < components['/_polyline1'].stateValues.nVertices; i++) {
        vertices.push([
          components['/_polyline1'].stateValues.vertices[i].get_component(0),
          components['/_polyline1'].stateValues.vertices[i].get_component(1)
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

      components['/_polyline1'].movePolyline(vertices);

      let px = components['/_point1'].stateValues.xs[0].tree;
      let py = components['/_point1'].stateValues.xs[1].tree;

      let mseg1 = (y2 - y1) / (x2 - x1);

      expect(py).closeTo(mseg1 * (px - x1) + y1, 1E-6)

    })


    cy.log('move second vertex so point attracts to second segment')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let vertices = [];
      for (let i = 0; i < components['/_polyline1'].stateValues.nVertices; i++) {
        vertices.push([
          components['/_polyline1'].stateValues.vertices[i].get_component(0),
          components['/_polyline1'].stateValues.vertices[i].get_component(1)
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

      components['/_polyline1'].movePolyline({ 1: [x2, y2] });

      let px = components['/_point1'].stateValues.xs[0].tree;
      let py = components['/_point1'].stateValues.xs[1].tree;

      let mseg2 = (y2 - y3) / (x2 - x3);

      expect(py).closeTo(mseg2 * (px - x2) + y2, 1E-6)

    })
  })

  it('constrain to polyline', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <polyline>
      (3,5), (-4,-1),(5,2)
    </polyline>
    <point>
      <constrainTo><ref>_polyline1</ref></constrainTo>
      (7,8)
    </point>
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


    let x1 = 3, x2 = -4, x3 = 5;
    let y1 = 5, y2 = -1, y3 = 2;

    cy.log('point originally constrained')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_point1'].stateValues.coords.tree).eqls(['vector', x1, y1]);
    })

    cy.log('move point near segment 1')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let x = 1;
      let mseg1 = (y2 - y1) / (x2 - x1);
      let y = mseg1 * (x - x1) + y1 + 0.3;
      components['/_point1'].movePoint({ x, y });
      let px = components['/_point1'].stateValues.xs[0].tree;
      let py = components['/_point1'].stateValues.xs[1].tree;

      expect(py).closeTo(mseg1 * (px - x1) + y1, 1E-6)

    })


    cy.log('move point near segment 2')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let x = 3;
      let mseg2 = (y2 - y3) / (x2 - x3);
      let y = mseg2 * (x - x2) + y2 + 0.4;
      components['/_point1'].movePoint({ x, y });
      let px = components['/_point1'].stateValues.xs[0].tree;
      let py = components['/_point1'].stateValues.xs[1].tree;

      expect(py).closeTo(mseg2 * (px - x2) + y2, 1E-6)

    })

    cy.log('move point near segment between first and last vertices')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let x = 4;
      let mseg3 = (y1 - y3) / (x1 - x3);
      let y = mseg3 * (x - x3) + y3 + 0.2;
      components['/_point1'].movePoint({ x, y });
      let px = components['/_point1'].stateValues.xs[0].tree;
      let py = components['/_point1'].stateValues.xs[1].tree;
      let mseg1 = (y2 - y1) / (x2 - x1);
      expect(py).closeTo(mseg1 * (px - x1) + y1, 1E-6)

    })

    cy.log('move point just past first vertex')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let x = x1 + 0.2;
      let y = y1 + 0.3;
      components['/_point1'].movePoint({ x, y });
      let px = components['/_point1'].stateValues.xs[0].tree;
      let py = components['/_point1'].stateValues.xs[1].tree;

      expect(px).closeTo(x1, 1E-6);
      expect(py).closeTo(y1, 1E-6);

    })

    cy.log('point along extension of first segment constrained to endpoint')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let x = 4;
      let mseg1 = (y2 - y1) / (x2 - x1);
      let y = mseg1 * (x - x1) + y1 + 0.3;
      components['/_point1'].movePoint({ x, y });
      let px = components['/_point1'].stateValues.xs[0].tree;
      let py = components['/_point1'].stateValues.xs[1].tree;

      expect(px).closeTo(x1, 1E-6);
      expect(py).closeTo(y1, 1E-6);


      x = -5;
      y = mseg1 * (x - x1) + y1 - 0.3;
      components['/_point1'].movePoint({ x, y });
      px = components['/_point1'].stateValues.xs[0].tree;
      py = components['/_point1'].stateValues.xs[1].tree;

      expect(px).closeTo(x2, 1E-6);
      expect(py).closeTo(y2, 1E-6);

    })


    cy.log('move point just past second vertex')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let x = x2 - 0.2;
      let y = y2 - 0.3;
      components['/_point1'].movePoint({ x, y });
      let px = components['/_point1'].stateValues.xs[0].tree;
      let py = components['/_point1'].stateValues.xs[1].tree;

      expect(px).closeTo(x2, 1E-6);
      expect(py).closeTo(y2, 1E-6);

    })


    cy.log('point along extension of second segment constrained to endpoint')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let x = 6;
      let mseg2 = (y2 - y3) / (x2 - x3);
      let y = mseg2 * (x - x2) + y2 + 0.3;
      components['/_point1'].movePoint({ x, y });
      let px = components['/_point1'].stateValues.xs[0].tree;
      let py = components['/_point1'].stateValues.xs[1].tree;

      expect(px).closeTo(x3, 1E-6);
      expect(py).closeTo(y3, 1E-6);


      x = -5;
      y = mseg2 * (x - x2) + y2 - 0.3;
      components['/_point1'].movePoint({ x, y });
      px = components['/_point1'].stateValues.xs[0].tree;
      py = components['/_point1'].stateValues.xs[1].tree;

      expect(px).closeTo(x2, 1E-6);
      expect(py).closeTo(y2, 1E-6);

    })



    cy.log('move polyline so point constrained to first segment')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let vertices = [];
      for (let i = 0; i < components['/_polyline1'].stateValues.nVertices; i++) {
        vertices.push([
          components['/_polyline1'].stateValues.vertices[i].get_component(0),
          components['/_polyline1'].stateValues.vertices[i].get_component(1)
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

      components['/_polyline1'].movePolyline(vertices);

      let px = components['/_point1'].stateValues.xs[0].tree;
      let py = components['/_point1'].stateValues.xs[1].tree;

      let mseg1 = (y2 - y1) / (x2 - x1);

      expect(py).closeTo(mseg1 * (px - x1) + y1, 1E-6)

    })


    cy.log('move second vertex so point constrained to second segment')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let vertices = [];
      for (let i = 0; i < components['/_polyline1'].stateValues.nVertices; i++) {
        vertices.push([
          components['/_polyline1'].stateValues.vertices[i].get_component(0),
          components['/_polyline1'].stateValues.vertices[i].get_component(1)
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

      components['/_polyline1'].movePolyline({ 1: [x2, y2] });

      let px = components['/_point1'].stateValues.xs[0].tree;
      let py = components['/_point1'].stateValues.xs[1].tree;

      let mseg2 = (y2 - y3) / (x2 - x3);

      expect(py).closeTo(mseg2 * (px - x2) + y2, 1E-6)

    })
  })

});