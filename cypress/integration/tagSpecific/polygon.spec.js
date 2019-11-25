describe('Polygon Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')

  })

  it('Polygon with sugared reffed points', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
    <text>a</text>
    <graph>
      <point>(3,5)</point>
      <point>(-4,-1)</point>
      <point>(5,2)</point>
      <point>(-3,4)</point>
      <polygon>
        <ref>_point1</ref>
        <ref>_point2</ref>
        <ref>_point3</ref>
        <ref>_point4</ref>
      </polygon>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_polygon1'].state.vertices[0].tree).eqls(['tuple', 3, 5]);
      expect(components['/_polygon1'].state.vertices[1].tree).eqls(['tuple', -4, -1]);
      expect(components['/_polygon1'].state.vertices[2].tree).eqls(['tuple', 5, 2]);
      expect(components['/_polygon1'].state.vertices[3].tree).eqls(['tuple', -3, 4]);
    })

    cy.log('move individual vertex')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      components['/_polygon1'].movePolygon({ 1: [4, 7] });
      expect(components['/_polygon1'].state.vertices[0].tree).eqls(['tuple', 3, 5]);
      expect(components['/_polygon1'].state.vertices[1].tree).eqls(['tuple', 4, 7]);
      expect(components['/_polygon1'].state.vertices[2].tree).eqls(['tuple', 5, 2]);
      expect(components['/_polygon1'].state.vertices[3].tree).eqls(['tuple', -3, 4]);

    })

    cy.log('move polygon up and to the right')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let vertices = [];
      for (let i = 0; i < components['/_polygon1'].state.nPoints; i++) {
        vertices.push([
          components['/_polygon1'].state.vertices[i].get_component(0),
          components['/_polygon1'].state.vertices[i].get_component(1)
        ])
      }

      let moveX = 3;
      let moveY = 2;

      for (let i = 0; i < vertices.length; i++) {
        vertices[i][0] = vertices[i][0].add(moveX).simplify().tree;
        vertices[i][1] = vertices[i][1].add(moveY).simplify().tree;
      }

      components['/_polygon1'].movePolygon(vertices);

      let pxs = [];
      let pys = [];
      for (let i = 0; i < vertices.length; i++) {
        pxs.push(vertices[i][0]);
        pys.push(vertices[i][1]);
      }

      for (let i = 0; i < vertices.length; i++) {
        expect(components['/_polygon1'].state.vertices[i].tree).eqls(['tuple', pxs[i], pys[i]]);
      }

    })
  })

  it('Polygon vertices and reffed points', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
    <text>a</text>
    <graph>
      <point>(3,5)</point>
      <point>(-4,-1)</point>
      <point>(5,2)</point>
      <point>(-3,4)</point>
      <polygon><vertices>
        <ref>_point1</ref>
        <ref>_point2</ref>
        <ref>_point3</ref>
        <ref>_point4</ref>
      </vertices></polygon>
    </graph>
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_polygon1'].state.vertices[0].tree).eqls(['tuple', 3, 5]);
      expect(components['/_polygon1'].state.vertices[1].tree).eqls(['tuple', -4, -1]);
      expect(components['/_polygon1'].state.vertices[2].tree).eqls(['tuple', 5, 2]);
      expect(components['/_polygon1'].state.vertices[3].tree).eqls(['tuple', -3, 4]);
    })

    cy.log('move individual vertex')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      components['/_polygon1'].movePolygon({ 1: [4, 7] });
      expect(components['/_polygon1'].state.vertices[0].tree).eqls(['tuple', 3, 5]);
      expect(components['/_polygon1'].state.vertices[1].tree).eqls(['tuple', 4, 7]);
      expect(components['/_polygon1'].state.vertices[2].tree).eqls(['tuple', 5, 2]);
      expect(components['/_polygon1'].state.vertices[3].tree).eqls(['tuple', -3, 4]);

    })

    cy.log('move polygon up and to the right')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let vertices = [];
      for (let i = 0; i < components['/_polygon1'].state.nPoints; i++) {
        vertices.push([
          components['/_polygon1'].state.vertices[i].get_component(0),
          components['/_polygon1'].state.vertices[i].get_component(1)
        ])
      }

      let moveX = 3;
      let moveY = 2;

      for (let i = 0; i < vertices.length; i++) {
        vertices[i][0] = vertices[i][0].add(moveX).simplify().tree;
        vertices[i][1] = vertices[i][1].add(moveY).simplify().tree;
      }

      components['/_polygon1'].movePolygon(vertices);

      let pxs = [];
      let pys = [];
      for (let i = 0; i < vertices.length; i++) {
        pxs.push(vertices[i][0]);
        pys.push(vertices[i][1]);
      }

      for (let i = 0; i < vertices.length; i++) {
        expect(components['/_polygon1'].state.vertices[i].tree).eqls(['tuple', pxs[i], pys[i]]);
      }

    })
  })

  it('Polygon string points', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
    <text>a</text>
    <math>-1</math>
    <graph>
      <polygon>
        (3,5), (-4,<ref>_math1</ref>),(5,2),(-3,4)
      </polygon>
    </graph>
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_polygon1'].state.vertices[0].tree).eqls(['tuple', 3, 5]);
      expect(components['/_polygon1'].state.vertices[1].tree).eqls(['tuple', -4, -1]);
      expect(components['/_polygon1'].state.vertices[2].tree).eqls(['tuple', 5, 2]);
      expect(components['/_polygon1'].state.vertices[3].tree).eqls(['tuple', -3, 4]);
    })

    cy.log('move individual vertex')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      components['/_polygon1'].movePolygon({ 1: [4, 7] });
      expect(components['/_polygon1'].state.vertices[0].tree).eqls(['tuple', 3, 5]);
      expect(components['/_polygon1'].state.vertices[1].tree).eqls(['tuple', 4, 7]);
      expect(components['/_polygon1'].state.vertices[2].tree).eqls(['tuple', 5, 2]);
      expect(components['/_polygon1'].state.vertices[3].tree).eqls(['tuple', -3, 4]);

    })

    cy.log('move polygon up and to the right')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let vertices = [];
      for (let i = 0; i < components['/_polygon1'].state.nPoints; i++) {
        vertices.push([
          components['/_polygon1'].state.vertices[i].get_component(0),
          components['/_polygon1'].state.vertices[i].get_component(1)
        ])
      }

      let moveX = 3;
      let moveY = 2;

      for (let i = 0; i < vertices.length; i++) {
        vertices[i][0] = vertices[i][0].add(moveX).simplify().tree;
        vertices[i][1] = vertices[i][1].add(moveY).simplify().tree;
      }

      components['/_polygon1'].movePolygon(vertices);

      let pxs = [];
      let pys = [];
      for (let i = 0; i < vertices.length; i++) {
        pxs.push(vertices[i][0]);
        pys.push(vertices[i][1]);
      }

      for (let i = 0; i < vertices.length; i++) {
        expect(components['/_polygon1'].state.vertices[i].tree).eqls(['tuple', pxs[i], pys[i]]);
      }

    })
  })

  it('Polygon string points in vertices', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
    <text>a</text>
    <math>-1</math>
    <graph>
      <polygon><vertices>
        (3,5), (-4,<ref>_math1</ref>),(5,2),(-3,4)
      </vertices></polygon>
    </graph>
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_polygon1'].state.vertices[0].tree).eqls(['tuple', 3, 5]);
      expect(components['/_polygon1'].state.vertices[1].tree).eqls(['tuple', -4, -1]);
      expect(components['/_polygon1'].state.vertices[2].tree).eqls(['tuple', 5, 2]);
      expect(components['/_polygon1'].state.vertices[3].tree).eqls(['tuple', -3, 4]);
    })

    cy.log('move individual vertex')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      components['/_polygon1'].movePolygon({ 1: [4, 7] });
      expect(components['/_polygon1'].state.vertices[0].tree).eqls(['tuple', 3, 5]);
      expect(components['/_polygon1'].state.vertices[1].tree).eqls(['tuple', 4, 7]);
      expect(components['/_polygon1'].state.vertices[2].tree).eqls(['tuple', 5, 2]);
      expect(components['/_polygon1'].state.vertices[3].tree).eqls(['tuple', -3, 4]);

    })

    cy.log('move polygon up and to the right')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let vertices = [];
      for (let i = 0; i < components['/_polygon1'].state.nPoints; i++) {
        vertices.push([
          components['/_polygon1'].state.vertices[i].get_component(0),
          components['/_polygon1'].state.vertices[i].get_component(1)
        ])
      }

      let moveX = 3;
      let moveY = 2;

      for (let i = 0; i < vertices.length; i++) {
        vertices[i][0] = vertices[i][0].add(moveX).simplify().tree;
        vertices[i][1] = vertices[i][1].add(moveY).simplify().tree;
      }

      components['/_polygon1'].movePolygon(vertices);

      let pxs = [];
      let pys = [];
      for (let i = 0; i < vertices.length; i++) {
        pxs.push(vertices[i][0]);
        pys.push(vertices[i][1]);
      }

      for (let i = 0; i < vertices.length; i++) {
        expect(components['/_polygon1'].state.vertices[i].tree).eqls(['tuple', pxs[i], pys[i]]);
      }

    })
  })

  it('dynamic polygon, initially zero, reffed', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
    <text>a</text>
  
    <mathinput name="count" prefill="0" />
    <graph>
    <polygon><vertices>
      <map>
        <template><point>(<subsref/>, 5sin(<subsref/>))</point></template>
        <substitutions><sequence from="0">
          <count><ref prop="value">count</ref></count>
        </sequence></substitutions>
      </map>
      </vertices></polygon>
    </graph>
    
    <graph>
    <ref>_polygon1</ref>
    </graph>
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_polygon1'].state.nPoints).eq(0);
      expect(components.__polygon1.state.nPoints).eq(0);
    })

    cy.get('#\\/count_input').clear().type("1{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let nPoints = 1;
      expect(components['/_polygon1'].state.nPoints).eq(nPoints);
      expect(components.__polygon1.state.nPoints).eq(nPoints);
      for (let i = 0; i < nPoints; i++) {
        expect(components['/_polygon1'].state.vertices[i].get_component(0).tree).eq(i);
        expect(components['/_polygon1'].state.vertices[i].get_component(1).tree).closeTo(5 * Math.sin(i), 1E-12);
        expect(components.__polygon1.state.vertices[i].get_component(0).tree).eq(i);
        expect(components.__polygon1.state.vertices[i].get_component(1).tree).closeTo(5 * Math.sin(i), 1E-12);
      }

    })

    cy.get('#\\/count_input').clear().type("2{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let nPoints = 2;
      expect(components['/_polygon1'].state.nPoints).eq(nPoints);
      expect(components.__polygon1.state.nPoints).eq(nPoints);
      for (let i = 0; i < nPoints; i++) {
        expect(components['/_polygon1'].state.vertices[i].get_component(0).tree).eq(i);
        expect(components['/_polygon1'].state.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        expect(components.__polygon1.state.vertices[i].get_component(0).tree).eq(i);
        expect(components.__polygon1.state.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
      }

    })

    cy.get('#\\/count_input').clear().type("3{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let nPoints = 3;
      expect(components['/_polygon1'].state.nPoints).eq(nPoints);
      expect(components.__polygon1.state.nPoints).eq(nPoints);
      for (let i = 0; i < nPoints; i++) {
        expect(components['/_polygon1'].state.vertices[i].get_component(0).tree).eq(i);
        expect(components['/_polygon1'].state.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        expect(components.__polygon1.state.vertices[i].get_component(0).tree).eq(i);
        expect(components.__polygon1.state.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
      }

    })

    cy.get('#\\/count_input').clear().type("2{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let nPoints = 2;
      expect(components['/_polygon1'].state.nPoints).eq(nPoints);
      expect(components.__polygon1.state.nPoints).eq(nPoints);
      for (let i = 0; i < nPoints; i++) {
        expect(components['/_polygon1'].state.vertices[i].get_component(0).tree).eq(i);
        expect(components['/_polygon1'].state.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        expect(components.__polygon1.state.vertices[i].get_component(0).tree).eq(i);
        expect(components.__polygon1.state.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
      }

    })


    cy.get('#\\/count_input').clear().type("0{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let nPoints = 0;
      expect(components['/_polygon1'].state.nPoints).eq(nPoints);
      expect(components.__polygon1.state.nPoints).eq(nPoints);
      for (let i = 0; i < nPoints; i++) {
        expect(components['/_polygon1'].state.vertices[i].get_component(0).tree).eq(i);
        expect(components['/_polygon1'].state.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        expect(components.__polygon1.state.vertices[i].get_component(0).tree).eq(i);
        expect(components.__polygon1.state.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
      }

    })

    cy.get('#\\/count_input').clear().type("5{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let nPoints = 5;
      expect(components['/_polygon1'].state.nPoints).eq(nPoints);
      expect(components.__polygon1.state.nPoints).eq(nPoints);
      for (let i = 0; i < nPoints; i++) {
        expect(components['/_polygon1'].state.vertices[i].get_component(0).tree).eq(i);
        expect(components['/_polygon1'].state.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        expect(components.__polygon1.state.vertices[i].get_component(0).tree).eq(i);
        expect(components.__polygon1.state.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
      }

    })


    cy.log("start over and begin with big increment")

    cy.visit('/test')

    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
    <text>b</text>
  
    <mathinput name="count" prefill="0" />
    <graph>
    <polygon><vertices>
      <map>
        <template><point>(<subsref/>, 5sin(<subsref/>))</point></template>
        <substitutions><sequence from="0">
          <count><ref prop="value">count</ref></count>
        </sequence></substitutions>
      </map>
      </vertices></polygon>
    </graph>
    
    <graph>
    <ref>_polygon1</ref>
    </graph>
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'b') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_polygon1'].state.nPoints).eq(0);
      expect(components.__polygon1.state.nPoints).eq(0);
    })


    cy.get('#\\/count_input').clear().type("10{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let nPoints = 10;
      expect(components['/_polygon1'].state.nPoints).eq(nPoints);
      expect(components.__polygon1.state.nPoints).eq(nPoints);
      for (let i = 0; i < nPoints; i++) {
        expect(components['/_polygon1'].state.vertices[i].get_component(0).tree).eq(i);
        expect(components['/_polygon1'].state.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        expect(components.__polygon1.state.vertices[i].get_component(0).tree).eq(i);
        expect(components.__polygon1.state.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
      }

    })

    cy.get('#\\/count_input').clear().type("1{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let nPoints = 1;
      expect(components['/_polygon1'].state.nPoints).eq(nPoints);
      expect(components.__polygon1.state.nPoints).eq(nPoints);
      for (let i = 0; i < nPoints; i++) {
        expect(components['/_polygon1'].state.vertices[i].get_component(0).tree).eq(i);
        expect(components['/_polygon1'].state.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        expect(components.__polygon1.state.vertices[i].get_component(0).tree).eq(i);
        expect(components.__polygon1.state.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
      }

    })


  })

  it('dynamic polygon with sugared vertices, initially zero, reffed', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
    <text>a</text>
  
    <mathinput name="count" prefill="0" />
    <graph>
    <polygon>
      <map>
        <template><point>(<subsref/>, 5sin(<subsref/>))</point></template>
        <substitutions><sequence from="0">
          <count><ref prop="value">count</ref></count>
        </sequence></substitutions>
      </map>
      </polygon>
    </graph>
    
    <graph>
    <ref>_polygon1</ref>
    </graph>
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_polygon1'].state.nPoints).eq(0);
      expect(components.__polygon1.state.nPoints).eq(0);
    })

    cy.get('#\\/count_input').clear().type("1{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let nPoints = 1;
      expect(components['/_polygon1'].state.nPoints).eq(nPoints);
      expect(components.__polygon1.state.nPoints).eq(nPoints);
      for (let i = 0; i < nPoints; i++) {
        expect(components['/_polygon1'].state.vertices[i].get_component(0).tree).eq(i);
        expect(components['/_polygon1'].state.vertices[i].get_component(1).tree).closeTo(5 * Math.sin(i), 1E-12);
        expect(components.__polygon1.state.vertices[i].get_component(0).tree).eq(i);
        expect(components.__polygon1.state.vertices[i].get_component(1).tree).closeTo(5 * Math.sin(i), 1E-12);
      }

    })

    cy.get('#\\/count_input').clear().type("2{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let nPoints = 2;
      expect(components['/_polygon1'].state.nPoints).eq(nPoints);
      expect(components.__polygon1.state.nPoints).eq(nPoints);
      for (let i = 0; i < nPoints; i++) {
        expect(components['/_polygon1'].state.vertices[i].get_component(0).tree).eq(i);
        expect(components['/_polygon1'].state.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        expect(components.__polygon1.state.vertices[i].get_component(0).tree).eq(i);
        expect(components.__polygon1.state.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
      }

    })

    cy.get('#\\/count_input').clear().type("3{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let nPoints = 3;
      expect(components['/_polygon1'].state.nPoints).eq(nPoints);
      expect(components.__polygon1.state.nPoints).eq(nPoints);
      for (let i = 0; i < nPoints; i++) {
        expect(components['/_polygon1'].state.vertices[i].get_component(0).tree).eq(i);
        expect(components['/_polygon1'].state.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        expect(components.__polygon1.state.vertices[i].get_component(0).tree).eq(i);
        expect(components.__polygon1.state.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
      }

    })

    cy.get('#\\/count_input').clear().type("2{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let nPoints = 2;
      expect(components['/_polygon1'].state.nPoints).eq(nPoints);
      expect(components.__polygon1.state.nPoints).eq(nPoints);
      for (let i = 0; i < nPoints; i++) {
        expect(components['/_polygon1'].state.vertices[i].get_component(0).tree).eq(i);
        expect(components['/_polygon1'].state.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        expect(components.__polygon1.state.vertices[i].get_component(0).tree).eq(i);
        expect(components.__polygon1.state.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
      }

    })


    cy.get('#\\/count_input').clear().type("0{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let nPoints = 0;
      expect(components['/_polygon1'].state.nPoints).eq(nPoints);
      expect(components.__polygon1.state.nPoints).eq(nPoints);
      for (let i = 0; i < nPoints; i++) {
        expect(components['/_polygon1'].state.vertices[i].get_component(0).tree).eq(i);
        expect(components['/_polygon1'].state.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        expect(components.__polygon1.state.vertices[i].get_component(0).tree).eq(i);
        expect(components.__polygon1.state.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
      }

    })

    cy.get('#\\/count_input').clear().type("5{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let nPoints = 5;
      expect(components['/_polygon1'].state.nPoints).eq(nPoints);
      expect(components.__polygon1.state.nPoints).eq(nPoints);
      for (let i = 0; i < nPoints; i++) {
        expect(components['/_polygon1'].state.vertices[i].get_component(0).tree).eq(i);
        expect(components['/_polygon1'].state.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        expect(components.__polygon1.state.vertices[i].get_component(0).tree).eq(i);
        expect(components.__polygon1.state.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
      }

    })


    cy.log("start over and begin with big increment")
    cy.visit('/test')


    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
    <text>b</text>
  
    <mathinput name="count" prefill="0" />
    <graph>
    <polygon>
      <map>
        <template><point>(<subsref/>, 5sin(<subsref/>))</point></template>
        <substitutions><sequence from="0">
          <count><ref prop="value">count</ref></count>
        </sequence></substitutions>
      </map>
      </polygon>
    </graph>
    
    <graph>
    <ref>_polygon1</ref>
    </graph>
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'b') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_polygon1'].state.nPoints).eq(0);
      expect(components.__polygon1.state.nPoints).eq(0);
    })


    cy.get('#\\/count_input').clear().type("10{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let nPoints = 10;
      expect(components['/_polygon1'].state.nPoints).eq(nPoints);
      expect(components.__polygon1.state.nPoints).eq(nPoints);
      for (let i = 0; i < nPoints; i++) {
        expect(components['/_polygon1'].state.vertices[i].get_component(0).tree).eq(i);
        expect(components['/_polygon1'].state.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        expect(components.__polygon1.state.vertices[i].get_component(0).tree).eq(i);
        expect(components.__polygon1.state.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
      }

    })

    cy.get('#\\/count_input').clear().type("1{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let nPoints = 1;
      expect(components['/_polygon1'].state.nPoints).eq(nPoints);
      expect(components.__polygon1.state.nPoints).eq(nPoints);
      for (let i = 0; i < nPoints; i++) {
        expect(components['/_polygon1'].state.vertices[i].get_component(0).tree).eq(i);
        expect(components['/_polygon1'].state.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        expect(components.__polygon1.state.vertices[i].get_component(0).tree).eq(i);
        expect(components.__polygon1.state.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
      }

    })

  })

  it('dynamic polygon with sugared vertices from reffed map, initially zero, reffed', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
    <text>a</text>
  
    <mathinput name="count" prefill="0" />
    <graph>
    <map>
      <template><point>(<subsref/>, 5sin(<subsref/>))</point></template>
      <substitutions><sequence from="0">
        <count><ref prop="value">count</ref></count>
      </sequence></substitutions>
    </map>
    <polygon>
      <ref>_map1</ref>
    </polygon>
    </graph>
    
    <graph>
    <ref>_polygon1</ref>
    </graph>
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_polygon1'].state.nPoints).eq(0);
      expect(components.__polygon1.state.nPoints).eq(0);
    })

    cy.get('#\\/count_input').clear().type("1{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let nPoints = 1;
      expect(components['/_polygon1'].state.nPoints).eq(nPoints);
      expect(components.__polygon1.state.nPoints).eq(nPoints);
      for (let i = 0; i < nPoints; i++) {
        expect(components['/_polygon1'].state.vertices[i].get_component(0).tree).eq(i);
        expect(components['/_polygon1'].state.vertices[i].get_component(1).tree).closeTo(5 * Math.sin(i), 1E-12);
        expect(components.__polygon1.state.vertices[i].get_component(0).tree).eq(i);
        expect(components.__polygon1.state.vertices[i].get_component(1).tree).closeTo(5 * Math.sin(i), 1E-12);
      }

    })

    cy.get('#\\/count_input').clear().type("2{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let nPoints = 2;
      expect(components['/_polygon1'].state.nPoints).eq(nPoints);
      expect(components.__polygon1.state.nPoints).eq(nPoints);
      for (let i = 0; i < nPoints; i++) {
        expect(components['/_polygon1'].state.vertices[i].get_component(0).tree).eq(i);
        expect(components['/_polygon1'].state.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        expect(components.__polygon1.state.vertices[i].get_component(0).tree).eq(i);
        expect(components.__polygon1.state.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
      }

    })

    cy.get('#\\/count_input').clear().type("3{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let nPoints = 3;
      expect(components['/_polygon1'].state.nPoints).eq(nPoints);
      expect(components.__polygon1.state.nPoints).eq(nPoints);
      for (let i = 0; i < nPoints; i++) {
        expect(components['/_polygon1'].state.vertices[i].get_component(0).tree).eq(i);
        expect(components['/_polygon1'].state.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        expect(components.__polygon1.state.vertices[i].get_component(0).tree).eq(i);
        expect(components.__polygon1.state.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
      }

    })

    cy.get('#\\/count_input').clear().type("2{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let nPoints = 2;
      expect(components['/_polygon1'].state.nPoints).eq(nPoints);
      expect(components.__polygon1.state.nPoints).eq(nPoints);
      for (let i = 0; i < nPoints; i++) {
        expect(components['/_polygon1'].state.vertices[i].get_component(0).tree).eq(i);
        expect(components['/_polygon1'].state.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        expect(components.__polygon1.state.vertices[i].get_component(0).tree).eq(i);
        expect(components.__polygon1.state.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
      }

    })


    cy.get('#\\/count_input').clear().type("0{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let nPoints = 0;
      expect(components['/_polygon1'].state.nPoints).eq(nPoints);
      expect(components.__polygon1.state.nPoints).eq(nPoints);
      for (let i = 0; i < nPoints; i++) {
        expect(components['/_polygon1'].state.vertices[i].get_component(0).tree).eq(i);
        expect(components['/_polygon1'].state.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        expect(components.__polygon1.state.vertices[i].get_component(0).tree).eq(i);
        expect(components.__polygon1.state.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
      }

    })

    cy.get('#\\/count_input').clear().type("5{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let nPoints = 5;
      expect(components['/_polygon1'].state.nPoints).eq(nPoints);
      expect(components.__polygon1.state.nPoints).eq(nPoints);
      for (let i = 0; i < nPoints; i++) {
        expect(components['/_polygon1'].state.vertices[i].get_component(0).tree).eq(i);
        expect(components['/_polygon1'].state.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        expect(components.__polygon1.state.vertices[i].get_component(0).tree).eq(i);
        expect(components.__polygon1.state.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
      }

    })


    cy.log("start over and begin with big increment")
    cy.visit('/test')

    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
    <text>b</text>
  
    <mathinput name="count" prefill="0" />
    <graph>
    <map>
      <template><point>(<subsref/>, 5sin(<subsref/>))</point></template>
      <substitutions><sequence from="0">
        <count><ref prop="value">count</ref></count>
      </sequence></substitutions>
    </map>
    <polygon>
      <ref>_map1</ref>
    </polygon>
    </graph>
    
    <graph>
    <ref>_polygon1</ref>
    </graph>
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'b') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_polygon1'].state.nPoints).eq(0);
      expect(components.__polygon1.state.nPoints).eq(0);
    })


    cy.get('#\\/count_input').clear().type("10{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let nPoints = 10;
      expect(components['/_polygon1'].state.nPoints).eq(nPoints);
      expect(components.__polygon1.state.nPoints).eq(nPoints);
      for (let i = 0; i < nPoints; i++) {
        expect(components['/_polygon1'].state.vertices[i].get_component(0).tree).eq(i);
        expect(components['/_polygon1'].state.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        expect(components.__polygon1.state.vertices[i].get_component(0).tree).eq(i);
        expect(components.__polygon1.state.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
      }

    })

    cy.get('#\\/count_input').clear().type("1{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let nPoints = 1;
      expect(components['/_polygon1'].state.nPoints).eq(nPoints);
      expect(components.__polygon1.state.nPoints).eq(nPoints);
      for (let i = 0; i < nPoints; i++) {
        expect(components['/_polygon1'].state.vertices[i].get_component(0).tree).eq(i);
        expect(components['/_polygon1'].state.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        expect(components.__polygon1.state.vertices[i].get_component(0).tree).eq(i);
        expect(components.__polygon1.state.vertices[i].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
      }

    })

  })

  it('polygon with initially undefined point', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
    <text>a</text>
    <mathinput/>
    <graph>
    <polygon>
      <point>(1,2)</point>
      <point>(-1,5)</point>
      <point>(<ref prop="value">_mathinput1</ref>,7)</point>
      <point>(3,-5)</point>
      <point>(-4,-3)</point>
    </polygon>
    </graph>
    
    <graph>
    <ref>_polygon1</ref>
    </graph>  
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let prefixes = ['/', '_']
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      for (let prefix of prefixes) {
        expect(components[prefix + "_polygon1"].state.nPoints).eq(5);
        expect(components[prefix + "_polygon1"].state.vertices[0].get_component(0).tree).eq(1);
        expect(components[prefix + "_polygon1"].state.vertices[0].get_component(1).tree).eq(2);
        expect(components[prefix + "_polygon1"].state.vertices[1].get_component(0).tree).eq(-1);
        expect(components[prefix + "_polygon1"].state.vertices[1].get_component(1).tree).eq(5);
        expect(components[prefix + "_polygon1"].state.vertices[2].get_component(0).tree).eq('\uFF3F');
        expect(components[prefix + "_polygon1"].state.vertices[2].get_component(1).tree).eq(7);
        expect(components[prefix + "_polygon1"].state.vertices[3].get_component(0).tree).eq(3);
        expect(components[prefix + "_polygon1"].state.vertices[3].get_component(1).tree).eq(-5);
        expect(components[prefix + "_polygon1"].state.vertices[4].get_component(0).tree).eq(-4);
        expect(components[prefix + "_polygon1"].state.vertices[4].get_component(1).tree).eq(-3);
      }
    })

    cy.get('#\\/_mathinput1_input').clear().type("-2{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      for (let prefix of prefixes) {
        expect(components[prefix + "_polygon1"].state.nPoints).eq(5);
        expect(components[prefix + "_polygon1"].state.vertices[0].get_component(0).tree).eq(1);
        expect(components[prefix + "_polygon1"].state.vertices[0].get_component(1).tree).eq(2);
        expect(components[prefix + "_polygon1"].state.vertices[1].get_component(0).tree).eq(-1);
        expect(components[prefix + "_polygon1"].state.vertices[1].get_component(1).tree).eq(5);
        expect(components[prefix + "_polygon1"].state.vertices[2].get_component(0).tree).eq(-2);
        expect(components[prefix + "_polygon1"].state.vertices[2].get_component(1).tree).eq(7);
        expect(components[prefix + "_polygon1"].state.vertices[3].get_component(0).tree).eq(3);
        expect(components[prefix + "_polygon1"].state.vertices[3].get_component(1).tree).eq(-5);
        expect(components[prefix + "_polygon1"].state.vertices[4].get_component(0).tree).eq(-4);
        expect(components[prefix + "_polygon1"].state.vertices[4].get_component(1).tree).eq(-3);
      }
    })
  })

  // We've changed the design.  We now allow this to move
  // TODO: write test for new design
  it.skip(`can't move polygon based on map`, () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
    <text>a</text>
  
    <graph>
    <polygon><vertices hide="false">
      <map>
        <template><point>(<subsref/>, 5sin(<subsref/>))</point></template>
        <substitutions><sequence from="-5" to="5"/></substitutions>
      </map>
      </vertices></polygon>
    </graph>
    
    <graph>
    <ref>_polygon1</ref>
    </graph>
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_polygon1'].state.nPoints).eq(11);
      expect(components.__polygon1.state.nPoints).eq(11);
      for (let i = -5; i <= 5; i++) {
        expect(components['/_polygon1'].state.vertices[i + 5].get_component(0).tree).eq(i);
        expect(components['/_polygon1'].state.vertices[i + 5].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        expect(components.__polygon1.state.vertices[i + 5].get_component(0).tree).eq(i);
        expect(components.__polygon1.state.vertices[i + 5].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        expect(components[`/__map1_${i + 5}_point1`].state.xs[0].tree).eq(i);
        expect(components[`/__map1_${i + 5}_point1`].state.xs[1].evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
      }
    })

    cy.log("can't move points")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components[`/__map1_0_point1`].movePoint({ x: 9, y: -8 });
      components[`/__map1_8_point1`].movePoint({ x: -8, y: 4 });
      expect(components['/_polygon1'].state.nPoints).eq(11);
      expect(components.__polygon1.state.nPoints).eq(11);
      for (let i = -5; i <= 5; i++) {
        expect(components['/_polygon1'].state.vertices[i + 5].get_component(0).tree).eq(i);
        expect(components['/_polygon1'].state.vertices[i + 5].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        expect(components.__polygon1.state.vertices[i + 5].get_component(0).tree).eq(i);
        expect(components.__polygon1.state.vertices[i + 5].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        expect(components[`/__map1_${i + 5}_point1`].state.xs[0].tree).eq(i);
        expect(components[`/__map1_${i + 5}_point1`].state.xs[1].evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
      }
    })


    cy.log("can't move polygon1")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let vertices = [];
      for (let i = 0; i < components['/_polygon1'].state.nPoints; i++) {
        vertices.push([
          components['/_polygon1'].state.vertices[i].get_component(0),
          components['/_polygon1'].state.vertices[i].get_component(1)
        ])
      }

      let moveX = 3;
      let moveY = 2;

      for (let i = 0; i < vertices.length; i++) {
        vertices[i][0] = vertices[i][0].add(moveX);
        vertices[i][1] = vertices[i][1].add(moveY);
      }

      components['/_polygon1'].movePolygon(vertices);

      expect(components['/_polygon1'].state.nPoints).eq(11);
      expect(components.__polygon1.state.nPoints).eq(11);
      for (let i = -5; i <= 5; i++) {
        expect(components['/_polygon1'].state.vertices[i + 5].get_component(0).tree).eq(i);
        expect(components['/_polygon1'].state.vertices[i + 5].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        expect(components.__polygon1.state.vertices[i + 5].get_component(0).tree).eq(i);
        expect(components.__polygon1.state.vertices[i + 5].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        expect(components[`/__map1_${i + 5}_point1`].state.xs[0].tree).eq(i);
        expect(components[`/__map1_${i + 5}_point1`].state.xs[1].evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
      }
    })

    cy.log("can't move polygon2")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let vertices = [];
      for (let i = 0; i < components['/_polygon1'].state.nPoints; i++) {
        vertices.push([
          components['/_polygon1'].state.vertices[i].get_component(0),
          components['/_polygon1'].state.vertices[i].get_component(1)
        ])
      }

      let moveX = -5;
      let moveY = 6;

      for (let i = 0; i < vertices.length; i++) {
        vertices[i][0] = vertices[i][0].add(moveX);
        vertices[i][1] = vertices[i][1].add(moveY);
      }

      components.__polygon1.movePolygon(vertices);

      expect(components['/_polygon1'].state.nPoints).eq(11);
      expect(components.__polygon1.state.nPoints).eq(11);
      for (let i = -5; i <= 5; i++) {
        expect(components['/_polygon1'].state.vertices[i + 5].get_component(0).tree).eq(i);
        expect(components['/_polygon1'].state.vertices[i + 5].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        expect(components.__polygon1.state.vertices[i + 5].get_component(0).tree).eq(i);
        expect(components.__polygon1.state.vertices[i + 5].get_component(1).evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        expect(components[`/__map1_${i + 5}_point1`].state.xs[0].tree).eq(i);
        expect(components[`/__map1_${i + 5}_point1`].state.xs[1].evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
      }
    })

  })

  it('ref vertices of polygon', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
    <text>a</text>
    <graph>
    <polygon>(-3,-1),(1,2),(3,4),(6,-2)</polygon>
    </graph>
    <graph>
    <ref prop="vertex1">_polygon1</ref>
    <ref prop="vertex2">_polygon1</ref>
    <ref prop="vertex3">_polygon1</ref>
    <ref prop="vertex4">_polygon1</ref>
    </graph>
    <graph>
    <ref prop="vertices">_polygon1</ref>
    </graph>
    `}, "*");
    });

    let pointnames = [
      ['__point1', '__point5', '__point9'],
      ['__point2', '__point6', '__point10'],
      ['__point3', '__point7', '__point11'],
      ['__point4', '__point8', '__point12']
    ];
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let ps = [[-3, -1], [1, 2], [3, 4], [6, -2]];

      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 3; j++) {
          expect(components[pointnames[i][j]].state.xs[0].tree).eq(ps[i][0]);
          expect(components[pointnames[i][j]].state.xs[1].tree).eq(ps[i][1]);
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
          expect(components[pointnames[i][j]].state.xs[0].tree).eq(ps[i][0]);
          expect(components[pointnames[i][j]].state.xs[1].tree).eq(ps[i][1]);
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
          expect(components[pointnames[i][j]].state.xs[0].tree).eq(ps[i][0]);
          expect(components[pointnames[i][j]].state.xs[1].tree).eq(ps[i][1]);
        }
      }

    })

  })

  it('new polygon from reffed vertices of polygon', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
    <text>a</text>
    <graph>
    <polygon>(-9,6),(-3,7),(4,0),(8,5)</polygon>
    </graph>
    <graph>
    <polygon>
      <ref prop="vertices">_polygon1</ref>
    </polygon>
    </graph>
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let pointnames = [
      ['__point1', '__point5'],
      ['__point2', '__point6'],
      ['__point3', '__point7'],
      ['__point4', '__point8']
    ];

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let ps = [[-9, 6], [-3, 7], [4, 0], [8, 5]];

      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 2; j++) {
          expect(components[pointnames[i][j]].state.xs[0].tree).eq(ps[i][0]);
          expect(components[pointnames[i][j]].state.xs[1].tree).eq(ps[i][1]);
          expect(components['/_polygon1'].state.vertices[i].tree).eqls(["tuple", ps[i][0], ps[i][1]]);
          expect(components['/_polygon2'].state.vertices[i].tree).eqls(["tuple", ps[i][0], ps[i][1]]);
        }
      }
    })

    cy.log('move first polygon up and to the right')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let ps = [[-9, 6], [-3, 7], [4, 0], [8, 5]];

      let vertices = [];
      for (let i = 0; i < components['/_polygon1'].state.nPoints; i++) {
        vertices.push([
          components['/_polygon1'].state.vertices[i].get_component(0),
          components['/_polygon1'].state.vertices[i].get_component(1)
        ])
      }

      let moveX = 4;
      let moveY = 2;

      for (let i = 0; i < vertices.length; i++) {
        vertices[i][0] = vertices[i][0].add(moveX);
        vertices[i][1] = vertices[i][1].add(moveY);
      }

      components['/_polygon1'].movePolygon(vertices);

      for (let i = 0; i < vertices.length; i++) {
        ps[i][0] += moveX;
        ps[i][1] += moveY;
      }

      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 2; j++) {
          expect(components[pointnames[i][j]].state.xs[0].tree).eq(ps[i][0]);
          expect(components[pointnames[i][j]].state.xs[1].tree).eq(ps[i][1]);
          expect(components['/_polygon1'].state.vertices[i].tree).eqls(["tuple", ps[i][0], ps[i][1]]);
          expect(components['/_polygon2'].state.vertices[i].tree).eqls(["tuple", ps[i][0], ps[i][1]]);
        }
      }

    })


    cy.log('move second line segment up and to the left')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let vertices = [];
      for (let i = 0; i < components['/_polygon2'].state.nPoints; i++) {
        vertices.push([
          components['/_polygon2'].state.vertices[i].get_component(0),
          components['/_polygon2'].state.vertices[i].get_component(1)
        ])
      }

      let moveX = -7;
      let moveY = 3;

      for (let i = 0; i < vertices.length; i++) {
        vertices[i][0] = vertices[i][0].add(moveX);
        vertices[i][1] = vertices[i][1].add(moveY);
      }

      components['/_polygon2'].movePolygon(vertices);

      let ps = [[-9, 6], [-3, 7], [4, 0], [8, 5]];

      for (let i = 0; i < vertices.length; i++) {
        ps[i][0] += 4 + moveX;
        ps[i][1] += 2 + moveY;
      }

      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 2; j++) {
          expect(components[pointnames[i][j]].state.xs[0].tree).eq(ps[i][0]);
          expect(components[pointnames[i][j]].state.xs[1].tree).eq(ps[i][1]);
          expect(components['/_polygon1'].state.vertices[i].tree).eqls(["tuple", ps[i][0], ps[i][1]]);
          expect(components['/_polygon2'].state.vertices[i].tree).eqls(["tuple", ps[i][0], ps[i][1]]);
        }
      }

    })

  })

  it('new polygon as translated version of polygon', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
    <text>a</text>
    <mathinput prefill="5" name="transx" />
    <mathinput prefill="7" name="transy" />
    <graph>
    <polygon>
      (0,0),(3,-4),(1,-6),(-5,-6)
    </polygon>
    <polygon>
      <map>
        <template>
          <point>(<subsref prop="x"/>+
            <ref prop="value" modifybyreference="false">transx</ref>,
           <subsref prop="y"/>+
           <ref prop="value" modifybyreference="false">transy</ref>)
          </point>
        </template>
        <substitutions>
          <ref prop="vertices">_polygon1</ref>
        </substitutions>
      </map>
    </polygon>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


    let pointnames = [
      ['__point1', '__point5'],
      ['__point2', '__point6'],
      ['__point3', '__point7'],
      ['__point4', '__point8']
    ];
    let pointnamestrans = ["/__map1_0_point1", "/__map1_1_point1", "/__map1_2_point1", "/__map1_3_point1"];

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let ps = [[0, 0], [3, -4], [1, -6], [-5, -6]];
      let transX = 5;
      let transY = 7;
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 2; j++) {
          expect(components[pointnames[i][j]].state.xs[0].tree).eq(ps[i][0]);
          expect(components[pointnames[i][j]].state.xs[1].tree).eq(ps[i][1]);
          expect(components['/_polygon1'].state.vertices[i].tree).eqls(["tuple", ps[i][0], ps[i][1]]);
        }
      }
      for (let i = 0; i < 4; i++) {
        expect(components[pointnamestrans[i]].state.xs[0].tree).eq(ps[i][0] + transX);
        expect(components[pointnamestrans[i]].state.xs[1].tree).eq(ps[i][1] + transY);
        expect(components['/_polygon2'].state.vertices[i].tree).eqls(["tuple", ps[i][0] + transX, ps[i][1] + transY]);
      }
    })

    cy.log("move points on first polygon")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let ps = [[1, -1], [-3, 2], [-1, 7], [6, 3]];
      for (let i = 0; i < 4; i++) {
        components[pointnames[i][0]].movePoint({ x: ps[i][0], y: ps[i][1] });
      }

      let transX = 5;
      let transY = 7;
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 2; j++) {
          expect(components[pointnames[i][j]].state.xs[0].tree).eq(ps[i][0]);
          expect(components[pointnames[i][j]].state.xs[1].tree).eq(ps[i][1]);
          expect(components['/_polygon1'].state.vertices[i].tree).eqls(["tuple", ps[i][0], ps[i][1]]);
        }
      }
      for (let i = 0; i < 4; i++) {
        expect(components[pointnamestrans[i]].state.xs[0].tree).eq(ps[i][0] + transX);
        expect(components[pointnamestrans[i]].state.xs[1].tree).eq(ps[i][1] + transY);
        expect(components['/_polygon2'].state.vertices[i].tree).eqls(["tuple", ps[i][0] + transX, ps[i][1] + transY]);
      }
    })

    cy.log("move points on second polygon")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let ps = [[-3, 4], [1, 0], [9, 6], [2, -1]];
      for (let i = 0; i < 4; i++) {
        components[pointnamestrans[i]].movePoint({ x: ps[i][0], y: ps[i][1] });
      }

      let transX = 5;
      let transY = 7;
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 2; j++) {
          expect(components[pointnames[i][j]].state.xs[0].tree).eq(ps[i][0] - transX);
          expect(components[pointnames[i][j]].state.xs[1].tree).eq(ps[i][1] - transY);
          expect(components['/_polygon1'].state.vertices[i].tree).eqls(["tuple", ps[i][0] - transX, ps[i][1] - transY]);
        }
      }
      for (let i = 0; i < 4; i++) {
        expect(components[pointnamestrans[i]].state.xs[0].tree).eq(ps[i][0]);
        expect(components[pointnamestrans[i]].state.xs[1].tree).eq(ps[i][1]);
        expect(components['/_polygon2'].state.vertices[i].tree).eqls(["tuple", ps[i][0], ps[i][1]]);
      }
    })


    cy.log("change translation")
    cy.get("#\\/transx_input").clear().type("2{enter}");
    cy.get("#\\/transy_input").clear().type("10{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let ps = [[-3 - 5, 4 - 7], [1 - 5, 0 - 7], [9 - 5, 6 - 7], [2 - 5, -1 - 7]];

      let transX = 2;
      let transY = 10;

      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 2; j++) {
          expect(components[pointnames[i][j]].state.xs[0].tree).eq(ps[i][0]);
          expect(components[pointnames[i][j]].state.xs[1].tree).eq(ps[i][1]);
          expect(components['/_polygon1'].state.vertices[i].tree).eqls(["tuple", ps[i][0], ps[i][1]]);
        }
      }
      for (let i = 0; i < 4; i++) {
        expect(components[pointnamestrans[i]].state.xs[0].tree).eq(ps[i][0] + transX);
        expect(components[pointnamestrans[i]].state.xs[1].tree).eq(ps[i][1] + transY);
        expect(components['/_polygon2'].state.vertices[i].tree).eqls(["tuple", ps[i][0] + transX, ps[i][1] + transY]);
      }
    })

  })

  it('parallelogram based on three points', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
    <text>a</text>
    <graph>
    <polygon name="parallelogram">
      <point name="A">(1,2)</point>
      <point name="B">(3,4)</point>
      <point name="C">(-5,6)</point>
      <point name="D">
        <x><ref fixed prop="x">A</ref>+<ref fixed prop="x">C</ref>-<ref prop="x">B</ref></x>
        <y><ref fixed prop="y">A</ref>+<ref fixed prop="y">C</ref>-<ref prop="y">B</ref></y>
      </point>
    </polygon>
    </graph>
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let A = [1, 2];
    let B = [3, 4];
    let C = [-5, 6];
    let D = [A[0] + C[0] - B[0], A[1] + C[1] - B[1]];
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/parallelogram'].state.vertices[0].tree).eqls(['tuple', ...A]);
      expect(components['/parallelogram'].state.vertices[1].tree).eqls(['tuple', ...B]);
      expect(components['/parallelogram'].state.vertices[2].tree).eqls(['tuple', ...C]);
      expect(components['/parallelogram'].state.vertices[3].tree).eqls(['tuple', ...D]);
    })

    cy.log('move first vertex')
    cy.window().then((win) => {
      A = [-4, -1];
      D = [A[0] + C[0] - B[0], A[1] + C[1] - B[1]];

      let components = Object.assign({}, win.state.components);
      components['/parallelogram'].movePolygon({ 0: A });
      expect(components['/parallelogram'].state.vertices[0].tree).eqls(['tuple', ...A]);
      expect(components['/parallelogram'].state.vertices[1].tree).eqls(['tuple', ...B]);
      expect(components['/parallelogram'].state.vertices[2].tree).eqls(['tuple', ...C]);
      expect(components['/parallelogram'].state.vertices[3].tree).eqls(['tuple', ...D]);
    })

    cy.log('move second vertex')
    cy.window().then((win) => {
      B = [8, 9];
      D = [A[0] + C[0] - B[0], A[1] + C[1] - B[1]];

      let components = Object.assign({}, win.state.components);
      components['/parallelogram'].movePolygon({ 1: B });
      expect(components['/parallelogram'].state.vertices[0].tree).eqls(['tuple', ...A]);
      expect(components['/parallelogram'].state.vertices[1].tree).eqls(['tuple', ...B]);
      expect(components['/parallelogram'].state.vertices[2].tree).eqls(['tuple', ...C]);
      expect(components['/parallelogram'].state.vertices[3].tree).eqls(['tuple', ...D]);
    })

    cy.log('move third vertex')
    cy.window().then((win) => {
      C = [-3, 7];
      D = [A[0] + C[0] - B[0], A[1] + C[1] - B[1]];

      let components = Object.assign({}, win.state.components);
      components['/parallelogram'].movePolygon({ 2: C });
      expect(components['/parallelogram'].state.vertices[0].tree).eqls(['tuple', ...A]);
      expect(components['/parallelogram'].state.vertices[1].tree).eqls(['tuple', ...B]);
      expect(components['/parallelogram'].state.vertices[2].tree).eqls(['tuple', ...C]);
      expect(components['/parallelogram'].state.vertices[3].tree).eqls(['tuple', ...D]);
    })

    cy.log('move fourth vertex')
    cy.window().then((win) => {
      D = [7, 0];
      B = [A[0] + C[0] - D[0], A[1] + C[1] - D[1]];

      let components = Object.assign({}, win.state.components);
      components['/parallelogram'].movePolygon({ 3: D });
      expect(components['/parallelogram'].state.vertices[0].tree).eqls(['tuple', ...A]);
      expect(components['/parallelogram'].state.vertices[1].tree).eqls(['tuple', ...B]);
      expect(components['/parallelogram'].state.vertices[2].tree).eqls(['tuple', ...C]);
      expect(components['/parallelogram'].state.vertices[3].tree).eqls(['tuple', ...D]);
    })

  })


  it('new polygon from reffed vertices, some flipped', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <text>a</text>
  <graph>
  <polygon>(-9,6),(-3,7),(4,0),(8,5)</polygon>
  </graph>
  <graph>
  <polygon>
    <ref prop="vertex1">_polygon1</ref>
    <point>
      (<extract prop="y"><ref prop="vertex2">_polygon1</ref></extract>,
      <extract prop="x"><ref prop="vertex2">_polygon1</ref></extract>)
    </point>
    <ref prop="vertex3">_polygon1</ref>
    <point>
      <x><extract prop="y"><ref prop="vertex4">_polygon1</ref></extract></x>
      <y><extract prop="x"><ref prop="vertex4">_polygon1</ref></extract></y>
    </point>
  </polygon>
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let ps = [[-9, 6], [-3, 7], [4, 0], [8, 5]];
      let psflipped = [[-9, 6], [7, -3], [4, 0], [5, 8]];
      let components = Object.assign({}, win.state.components);
      expect(components['/_polygon1'].state.vertices[0].tree).eqls(['tuple', ...ps[0]]);
      expect(components['/_polygon1'].state.vertices[1].tree).eqls(['tuple', ...ps[1]]);
      expect(components['/_polygon1'].state.vertices[2].tree).eqls(['tuple', ...ps[2]]);
      expect(components['/_polygon1'].state.vertices[3].tree).eqls(['tuple', ...ps[3]]);
      expect(components['/_polygon2'].state.vertices[0].tree).eqls(['tuple', ...psflipped[0]]);
      expect(components['/_polygon2'].state.vertices[1].tree).eqls(['tuple', ...psflipped[1]]);
      expect(components['/_polygon2'].state.vertices[2].tree).eqls(['tuple', ...psflipped[2]]);
      expect(components['/_polygon2'].state.vertices[3].tree).eqls(['tuple', ...psflipped[3]]);
    })

    cy.log('move first polygon verticies')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let ps = [[7, 2], [1, -3], [2, 9], [-4, -3]];
      let psflipped = [[7, 2], [-3, 1], [2, 9], [-3, -4]];

      components['/_polygon1'].movePolygon(ps);

      expect(components['/_polygon1'].state.vertices[0].tree).eqls(['tuple', ...ps[0]]);
      expect(components['/_polygon1'].state.vertices[1].tree).eqls(['tuple', ...ps[1]]);
      expect(components['/_polygon1'].state.vertices[2].tree).eqls(['tuple', ...ps[2]]);
      expect(components['/_polygon1'].state.vertices[3].tree).eqls(['tuple', ...ps[3]]);
      expect(components['/_polygon2'].state.vertices[0].tree).eqls(['tuple', ...psflipped[0]]);
      expect(components['/_polygon2'].state.vertices[1].tree).eqls(['tuple', ...psflipped[1]]);
      expect(components['/_polygon2'].state.vertices[2].tree).eqls(['tuple', ...psflipped[2]]);
      expect(components['/_polygon2'].state.vertices[3].tree).eqls(['tuple', ...psflipped[3]]);

    })

    cy.log('move second polygon verticies')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let ps = [[-1, 9], [7, 5], [-8, 1], [6, -7]];
      let psflipped = [[-1, 9], [5, 7], [-8, 1], [-7, 6]];

      components['/_polygon2'].movePolygon(psflipped);

      expect(components['/_polygon1'].state.vertices[0].tree).eqls(['tuple', ...ps[0]]);
      expect(components['/_polygon1'].state.vertices[1].tree).eqls(['tuple', ...ps[1]]);
      expect(components['/_polygon1'].state.vertices[2].tree).eqls(['tuple', ...ps[2]]);
      expect(components['/_polygon1'].state.vertices[3].tree).eqls(['tuple', ...ps[3]]);
      expect(components['/_polygon2'].state.vertices[0].tree).eqls(['tuple', ...psflipped[0]]);
      expect(components['/_polygon2'].state.vertices[1].tree).eqls(['tuple', ...psflipped[1]]);
      expect(components['/_polygon2'].state.vertices[2].tree).eqls(['tuple', ...psflipped[2]]);
      expect(components['/_polygon2'].state.vertices[3].tree).eqls(['tuple', ...psflipped[3]]);

    })


  })

  it('four vertex polygon based on three points', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <text>a</text>
  <graph>
  <polygon>
    <point name="A">(1,2)</point>
    <point name="B">(3,4)</point>
    <point name="C">(-5,6)</point>
    <point name="D">
      <x><ref fixed prop="x">C</ref>+<ref fixed prop="x">B</ref>-<ref prop="x">A</ref></x>
      <y><ref fixed prop="y">C</ref>+<ref fixed prop="y">B</ref>-<ref prop="y">A</ref></y>
    </point>
  </polygon>
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
      expect(components['/_polygon1'].state.vertices[0].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[1].tree).eqls(['tuple', ...B]);
      expect(components['/_polygon1'].state.vertices[2].tree).eqls(['tuple', ...C]);
      expect(components['/_polygon1'].state.vertices[3].tree).eqls(['tuple', ...D]);
    })

    cy.log('move first vertex')
    cy.window().then((win) => {
      A = [-4, -1];
      D = [C[0] + B[0] - A[0], C[1] + B[1] - A[1]];

      let components = Object.assign({}, win.state.components);
      components['/_polygon1'].movePolygon({ 0: A });
      expect(components['/_polygon1'].state.vertices[0].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[1].tree).eqls(['tuple', ...B]);
      expect(components['/_polygon1'].state.vertices[2].tree).eqls(['tuple', ...C]);
      expect(components['/_polygon1'].state.vertices[3].tree).eqls(['tuple', ...D]);
    })

    cy.log('move second vertex')
    cy.window().then((win) => {
      B = [8, 9];
      D = [C[0] + B[0] - A[0], C[1] + B[1] - A[1]];

      let components = Object.assign({}, win.state.components);
      components['/_polygon1'].movePolygon({ 1: B });
      expect(components['/_polygon1'].state.vertices[0].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[1].tree).eqls(['tuple', ...B]);
      expect(components['/_polygon1'].state.vertices[2].tree).eqls(['tuple', ...C]);
      expect(components['/_polygon1'].state.vertices[3].tree).eqls(['tuple', ...D]);
    })

    cy.log('move third vertex')
    cy.window().then((win) => {
      C = [-3, 7];
      D = [C[0] + B[0] - A[0], C[1] + B[1] - A[1]];

      let components = Object.assign({}, win.state.components);
      components['/_polygon1'].movePolygon({ 2: C });
      expect(components['/_polygon1'].state.vertices[0].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[1].tree).eqls(['tuple', ...B]);
      expect(components['/_polygon1'].state.vertices[2].tree).eqls(['tuple', ...C]);
      expect(components['/_polygon1'].state.vertices[3].tree).eqls(['tuple', ...D]);
    })

    cy.log('move fourth vertex')
    cy.window().then((win) => {
      D = [7, 0];
      A = [C[0] + B[0] - D[0], C[1] + B[1] - D[1]];
      let components = Object.assign({}, win.state.components);
      components['/_polygon1'].movePolygon({ 3: D });
      expect(components['/_polygon1'].state.vertices[0].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[1].tree).eqls(['tuple', ...B]);
      expect(components['/_polygon1'].state.vertices[2].tree).eqls(['tuple', ...C]);
      expect(components['/_polygon1'].state.vertices[3].tree).eqls(['tuple', ...D]);
    })

  })

  it('fourth vertex depends on internal ref of first vertex', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <text>a</text>
  <graph>
  <polygon>
  <vertices>
  <point>(1,2)</point>
  <point>(3,4)</point>
  <point>(-5,6)</point>
  <ref prop="vertex1">_polygon1</ref>
  </vertices>
  </polygon>
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let A = [1, 2];
    let B = [3, 4];
    let C = [-5, 6];
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_polygon1'].state.vertices[0].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[1].tree).eqls(['tuple', ...B]);
      expect(components['/_polygon1'].state.vertices[2].tree).eqls(['tuple', ...C]);
      expect(components['/_polygon1'].state.vertices[3].tree).eqls(['tuple', ...A]);
    })

    cy.log('move first vertex')
    cy.window().then((win) => {
      A = [-4, -1];

      let components = Object.assign({}, win.state.components);
      components['/_polygon1'].movePolygon({ 0: A });
      expect(components['/_polygon1'].state.vertices[0].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[1].tree).eqls(['tuple', ...B]);
      expect(components['/_polygon1'].state.vertices[2].tree).eqls(['tuple', ...C]);
      expect(components['/_polygon1'].state.vertices[3].tree).eqls(['tuple', ...A]);
    })

    cy.log('move second vertex')
    cy.window().then((win) => {
      B = [8, 9];

      let components = Object.assign({}, win.state.components);
      components['/_polygon1'].movePolygon({ 1: B });
      expect(components['/_polygon1'].state.vertices[0].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[1].tree).eqls(['tuple', ...B]);
      expect(components['/_polygon1'].state.vertices[2].tree).eqls(['tuple', ...C]);
      expect(components['/_polygon1'].state.vertices[3].tree).eqls(['tuple', ...A]);
    })

    cy.log('move third vertex')
    cy.window().then((win) => {
      C = [-3, 7];

      let components = Object.assign({}, win.state.components);
      components['/_polygon1'].movePolygon({ 2: C });
      expect(components['/_polygon1'].state.vertices[0].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[1].tree).eqls(['tuple', ...B]);
      expect(components['/_polygon1'].state.vertices[2].tree).eqls(['tuple', ...C]);
      expect(components['/_polygon1'].state.vertices[3].tree).eqls(['tuple', ...A]);
    })

    cy.log('move fourth vertex')
    cy.window().then((win) => {
      A = [7, 0];
      let components = Object.assign({}, win.state.components);
      components['/_polygon1'].movePolygon({ 3: A });
      expect(components['/_polygon1'].state.vertices[0].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[1].tree).eqls(['tuple', ...B]);
      expect(components['/_polygon1'].state.vertices[2].tree).eqls(['tuple', ...C]);
      expect(components['/_polygon1'].state.vertices[3].tree).eqls(['tuple', ...A]);
    })

  })

  it('first vertex depends on internal ref of fourth vertex', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <text>a</text>
  <graph>
  <polygon>
  <vertices>
  <ref prop="vertex4">_polygon1</ref>
  <point>(3,4)</point>
  <point>(-5,6)</point>
  <point>(1,2)</point>
  </vertices>
  </polygon>
  </graph>
  
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let A = [1, 2];
    let B = [3, 4];
    let C = [-5, 6];
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_polygon1'].state.vertices[0].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[1].tree).eqls(['tuple', ...B]);
      expect(components['/_polygon1'].state.vertices[2].tree).eqls(['tuple', ...C]);
      expect(components['/_polygon1'].state.vertices[3].tree).eqls(['tuple', ...A]);
    })

    cy.log('move first vertex')
    cy.window().then((win) => {
      A = [-4, -1];

      let components = Object.assign({}, win.state.components);
      components['/_polygon1'].movePolygon({ 0: A });
      expect(components['/_polygon1'].state.vertices[0].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[1].tree).eqls(['tuple', ...B]);
      expect(components['/_polygon1'].state.vertices[2].tree).eqls(['tuple', ...C]);
      expect(components['/_polygon1'].state.vertices[3].tree).eqls(['tuple', ...A]);
    })

    cy.log('move second vertex')
    cy.window().then((win) => {
      B = [8, 9];

      let components = Object.assign({}, win.state.components);
      components['/_polygon1'].movePolygon({ 1: B });
      expect(components['/_polygon1'].state.vertices[0].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[1].tree).eqls(['tuple', ...B]);
      expect(components['/_polygon1'].state.vertices[2].tree).eqls(['tuple', ...C]);
      expect(components['/_polygon1'].state.vertices[3].tree).eqls(['tuple', ...A]);
    })

    cy.log('move third vertex')
    cy.window().then((win) => {
      C = [-3, 7];

      let components = Object.assign({}, win.state.components);
      components['/_polygon1'].movePolygon({ 2: C });
      expect(components['/_polygon1'].state.vertices[0].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[1].tree).eqls(['tuple', ...B]);
      expect(components['/_polygon1'].state.vertices[2].tree).eqls(['tuple', ...C]);
      expect(components['/_polygon1'].state.vertices[3].tree).eqls(['tuple', ...A]);
    })

    cy.log('move fourth vertex')
    cy.window().then((win) => {
      A = [7, 0];
      let components = Object.assign({}, win.state.components);
      components['/_polygon1'].movePolygon({ 3: A });
      expect(components['/_polygon1'].state.vertices[0].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[1].tree).eqls(['tuple', ...B]);
      expect(components['/_polygon1'].state.vertices[2].tree).eqls(['tuple', ...C]);
      expect(components['/_polygon1'].state.vertices[3].tree).eqls(['tuple', ...A]);
    })

  })

  it('first vertex depends fourth, formula for fifth', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <text>a</text>
  <graph>
  <polygon>
  <vertices>
  <ref prop="vertex4">_polygon1</ref>
  <point>(3,4)</point>
  <point>(-5,6)</point>
  <point>(1,2)</point>
  <point>
    <x><extract prop="x"><ref prop="vertex1">_polygon1</ref></extract>+1</x>
    <y>2</y>
  </point>
  </vertices>
  </polygon>
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
      expect(components['/_polygon1'].state.vertices[0].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[1].tree).eqls(['tuple', ...B]);
      expect(components['/_polygon1'].state.vertices[2].tree).eqls(['tuple', ...C]);
      expect(components['/_polygon1'].state.vertices[3].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[4].tree).eqls(['tuple', ...D]);
    })

    cy.log('move first vertex')
    cy.window().then((win) => {
      A = [-4, -1];
      D[0] = A[0] + 1;

      let components = Object.assign({}, win.state.components);
      components['/_polygon1'].movePolygon({ 0: A });
      expect(components['/_polygon1'].state.vertices[0].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[1].tree).eqls(['tuple', ...B]);
      expect(components['/_polygon1'].state.vertices[2].tree).eqls(['tuple', ...C]);
      expect(components['/_polygon1'].state.vertices[3].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[4].tree).eqls(['tuple', ...D]);
    })

    cy.log('move second vertex')
    cy.window().then((win) => {
      B = [8, 9];

      let components = Object.assign({}, win.state.components);
      components['/_polygon1'].movePolygon({ 1: B });
      expect(components['/_polygon1'].state.vertices[0].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[1].tree).eqls(['tuple', ...B]);
      expect(components['/_polygon1'].state.vertices[2].tree).eqls(['tuple', ...C]);
      expect(components['/_polygon1'].state.vertices[3].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[4].tree).eqls(['tuple', ...D]);
    })

    cy.log('move third vertex')
    cy.window().then((win) => {
      C = [-3, 7];

      let components = Object.assign({}, win.state.components);
      components['/_polygon1'].movePolygon({ 2: C });
      expect(components['/_polygon1'].state.vertices[0].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[1].tree).eqls(['tuple', ...B]);
      expect(components['/_polygon1'].state.vertices[2].tree).eqls(['tuple', ...C]);
      expect(components['/_polygon1'].state.vertices[3].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[4].tree).eqls(['tuple', ...D]);
    })

    cy.log('move fourth vertex')
    cy.window().then((win) => {
      A = [7, 0];
      D[0] = A[0] + 1;
      let components = Object.assign({}, win.state.components);
      components['/_polygon1'].movePolygon({ 3: A });
      expect(components['/_polygon1'].state.vertices[0].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[1].tree).eqls(['tuple', ...B]);
      expect(components['/_polygon1'].state.vertices[2].tree).eqls(['tuple', ...C]);
      expect(components['/_polygon1'].state.vertices[3].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[4].tree).eqls(['tuple', ...D]);
    })


    cy.log('move fifth vertex')
    cy.window().then((win) => {
      D = [-5, 9];
      A[0] = D[0] - 1;
      let components = Object.assign({}, win.state.components);
      components['/_polygon1'].movePolygon({ 4: D });
      expect(components['/_polygon1'].state.vertices[0].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[1].tree).eqls(['tuple', ...B]);
      expect(components['/_polygon1'].state.vertices[2].tree).eqls(['tuple', ...C]);
      expect(components['/_polygon1'].state.vertices[3].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[4].tree).eqls(['tuple', ...D]);
    })

  })

  it('first, fourth, seventh vertex depends on fourth, seventh, tenth', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <text>a</text>
  <graph>
  <polygon>
  <vertices>
    <ref prop="vertex4">_polygon1</ref>
    <point>(1,2)</point>
    <point>(3,4)</point>
    <ref prop="vertex7">_polygon1</ref>
    <point>(5,7)</point>
    <point>(-5,7)</point>
    <ref prop="vertex10">_polygon1</ref>
    <point>(3,1)</point>
    <point>(5,0)</point>
    <point>(-5,-1)</point>
  </vertices>
  </polygon>
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
      expect(components['/_polygon1'].state.vertices[0].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[1].tree).eqls(['tuple', ...B]);
      expect(components['/_polygon1'].state.vertices[2].tree).eqls(['tuple', ...C]);
      expect(components['/_polygon1'].state.vertices[3].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[4].tree).eqls(['tuple', ...D]);
      expect(components['/_polygon1'].state.vertices[5].tree).eqls(['tuple', ...E]);
      expect(components['/_polygon1'].state.vertices[6].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[7].tree).eqls(['tuple', ...F]);
      expect(components['/_polygon1'].state.vertices[8].tree).eqls(['tuple', ...G]);
      expect(components['/_polygon1'].state.vertices[9].tree).eqls(['tuple', ...A]);
    })

    cy.log('move first vertex')
    cy.window().then((win) => {
      A = [-4, -9];

      let components = Object.assign({}, win.state.components);
      components['/_polygon1'].movePolygon({ 0: A });
      expect(components['/_polygon1'].state.vertices[0].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[1].tree).eqls(['tuple', ...B]);
      expect(components['/_polygon1'].state.vertices[2].tree).eqls(['tuple', ...C]);
      expect(components['/_polygon1'].state.vertices[3].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[4].tree).eqls(['tuple', ...D]);
      expect(components['/_polygon1'].state.vertices[5].tree).eqls(['tuple', ...E]);
      expect(components['/_polygon1'].state.vertices[6].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[7].tree).eqls(['tuple', ...F]);
      expect(components['/_polygon1'].state.vertices[8].tree).eqls(['tuple', ...G]);
      expect(components['/_polygon1'].state.vertices[9].tree).eqls(['tuple', ...A]);
    })

    cy.log('move second vertex')
    cy.window().then((win) => {
      B = [8, 9];

      let components = Object.assign({}, win.state.components);
      components['/_polygon1'].movePolygon({ 1: B });
      expect(components['/_polygon1'].state.vertices[0].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[1].tree).eqls(['tuple', ...B]);
      expect(components['/_polygon1'].state.vertices[2].tree).eqls(['tuple', ...C]);
      expect(components['/_polygon1'].state.vertices[3].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[4].tree).eqls(['tuple', ...D]);
      expect(components['/_polygon1'].state.vertices[5].tree).eqls(['tuple', ...E]);
      expect(components['/_polygon1'].state.vertices[6].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[7].tree).eqls(['tuple', ...F]);
      expect(components['/_polygon1'].state.vertices[8].tree).eqls(['tuple', ...G]);
      expect(components['/_polygon1'].state.vertices[9].tree).eqls(['tuple', ...A]);
    })

    cy.log('move third vertex')
    cy.window().then((win) => {
      C = [-3, 7];

      let components = Object.assign({}, win.state.components);
      components['/_polygon1'].movePolygon({ 2: C });
      expect(components['/_polygon1'].state.vertices[0].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[1].tree).eqls(['tuple', ...B]);
      expect(components['/_polygon1'].state.vertices[2].tree).eqls(['tuple', ...C]);
      expect(components['/_polygon1'].state.vertices[3].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[4].tree).eqls(['tuple', ...D]);
      expect(components['/_polygon1'].state.vertices[5].tree).eqls(['tuple', ...E]);
      expect(components['/_polygon1'].state.vertices[6].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[7].tree).eqls(['tuple', ...F]);
      expect(components['/_polygon1'].state.vertices[8].tree).eqls(['tuple', ...G]);
      expect(components['/_polygon1'].state.vertices[9].tree).eqls(['tuple', ...A]);
    })

    cy.log('move fourth vertex')
    cy.window().then((win) => {
      A = [7, 0];
      let components = Object.assign({}, win.state.components);
      components['/_polygon1'].movePolygon({ 3: A });
      expect(components['/_polygon1'].state.vertices[0].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[1].tree).eqls(['tuple', ...B]);
      expect(components['/_polygon1'].state.vertices[2].tree).eqls(['tuple', ...C]);
      expect(components['/_polygon1'].state.vertices[3].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[4].tree).eqls(['tuple', ...D]);
      expect(components['/_polygon1'].state.vertices[5].tree).eqls(['tuple', ...E]);
      expect(components['/_polygon1'].state.vertices[6].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[7].tree).eqls(['tuple', ...F]);
      expect(components['/_polygon1'].state.vertices[8].tree).eqls(['tuple', ...G]);
      expect(components['/_polygon1'].state.vertices[9].tree).eqls(['tuple', ...A]);
    })

    cy.log('move fifth vertex')
    cy.window().then((win) => {
      D = [-9, 1];
      let components = Object.assign({}, win.state.components);
      components['/_polygon1'].movePolygon({ 4: D });
      expect(components['/_polygon1'].state.vertices[0].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[1].tree).eqls(['tuple', ...B]);
      expect(components['/_polygon1'].state.vertices[2].tree).eqls(['tuple', ...C]);
      expect(components['/_polygon1'].state.vertices[3].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[4].tree).eqls(['tuple', ...D]);
      expect(components['/_polygon1'].state.vertices[5].tree).eqls(['tuple', ...E]);
      expect(components['/_polygon1'].state.vertices[6].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[7].tree).eqls(['tuple', ...F]);
      expect(components['/_polygon1'].state.vertices[8].tree).eqls(['tuple', ...G]);
      expect(components['/_polygon1'].state.vertices[9].tree).eqls(['tuple', ...A]);
    })

    cy.log('move sixth vertex')
    cy.window().then((win) => {
      E = [-3, 6];
      let components = Object.assign({}, win.state.components);
      components['/_polygon1'].movePolygon({ 5: E });
      expect(components['/_polygon1'].state.vertices[0].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[1].tree).eqls(['tuple', ...B]);
      expect(components['/_polygon1'].state.vertices[2].tree).eqls(['tuple', ...C]);
      expect(components['/_polygon1'].state.vertices[3].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[4].tree).eqls(['tuple', ...D]);
      expect(components['/_polygon1'].state.vertices[5].tree).eqls(['tuple', ...E]);
      expect(components['/_polygon1'].state.vertices[6].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[7].tree).eqls(['tuple', ...F]);
      expect(components['/_polygon1'].state.vertices[8].tree).eqls(['tuple', ...G]);
      expect(components['/_polygon1'].state.vertices[9].tree).eqls(['tuple', ...A]);
    })

    cy.log('move seventh vertex')
    cy.window().then((win) => {
      A = [2, -4];
      let components = Object.assign({}, win.state.components);
      components['/_polygon1'].movePolygon({ 6: A });
      expect(components['/_polygon1'].state.vertices[0].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[1].tree).eqls(['tuple', ...B]);
      expect(components['/_polygon1'].state.vertices[2].tree).eqls(['tuple', ...C]);
      expect(components['/_polygon1'].state.vertices[3].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[4].tree).eqls(['tuple', ...D]);
      expect(components['/_polygon1'].state.vertices[5].tree).eqls(['tuple', ...E]);
      expect(components['/_polygon1'].state.vertices[6].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[7].tree).eqls(['tuple', ...F]);
      expect(components['/_polygon1'].state.vertices[8].tree).eqls(['tuple', ...G]);
      expect(components['/_polygon1'].state.vertices[9].tree).eqls(['tuple', ...A]);
    })

    cy.log('move eighth vertex')
    cy.window().then((win) => {
      F = [6, 7];
      let components = Object.assign({}, win.state.components);
      components['/_polygon1'].movePolygon({ 7: F });
      expect(components['/_polygon1'].state.vertices[0].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[1].tree).eqls(['tuple', ...B]);
      expect(components['/_polygon1'].state.vertices[2].tree).eqls(['tuple', ...C]);
      expect(components['/_polygon1'].state.vertices[3].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[4].tree).eqls(['tuple', ...D]);
      expect(components['/_polygon1'].state.vertices[5].tree).eqls(['tuple', ...E]);
      expect(components['/_polygon1'].state.vertices[6].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[7].tree).eqls(['tuple', ...F]);
      expect(components['/_polygon1'].state.vertices[8].tree).eqls(['tuple', ...G]);
      expect(components['/_polygon1'].state.vertices[9].tree).eqls(['tuple', ...A]);
    })

    cy.log('move nineth vertex')
    cy.window().then((win) => {
      G = [1, -8];
      let components = Object.assign({}, win.state.components);
      components['/_polygon1'].movePolygon({ 8: G });
      expect(components['/_polygon1'].state.vertices[0].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[1].tree).eqls(['tuple', ...B]);
      expect(components['/_polygon1'].state.vertices[2].tree).eqls(['tuple', ...C]);
      expect(components['/_polygon1'].state.vertices[3].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[4].tree).eqls(['tuple', ...D]);
      expect(components['/_polygon1'].state.vertices[5].tree).eqls(['tuple', ...E]);
      expect(components['/_polygon1'].state.vertices[6].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[7].tree).eqls(['tuple', ...F]);
      expect(components['/_polygon1'].state.vertices[8].tree).eqls(['tuple', ...G]);
      expect(components['/_polygon1'].state.vertices[9].tree).eqls(['tuple', ...A]);
    })

    cy.log('move tenth vertex')
    cy.window().then((win) => {
      A = [-6, 10];
      let components = Object.assign({}, win.state.components);
      components['/_polygon1'].movePolygon({ 9: A });
      expect(components['/_polygon1'].state.vertices[0].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[1].tree).eqls(['tuple', ...B]);
      expect(components['/_polygon1'].state.vertices[2].tree).eqls(['tuple', ...C]);
      expect(components['/_polygon1'].state.vertices[3].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[4].tree).eqls(['tuple', ...D]);
      expect(components['/_polygon1'].state.vertices[5].tree).eqls(['tuple', ...E]);
      expect(components['/_polygon1'].state.vertices[6].tree).eqls(['tuple', ...A]);
      expect(components['/_polygon1'].state.vertices[7].tree).eqls(['tuple', ...F]);
      expect(components['/_polygon1'].state.vertices[8].tree).eqls(['tuple', ...G]);
      expect(components['/_polygon1'].state.vertices[9].tree).eqls(['tuple', ...A]);
    })

  })

  it('first, fourth, seventh vertex depends on shifted fourth, seventh, tenth', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <text>a</text>
  <graph>
  <polygon>
  <vertices>
    <point>
      <x><extract prop="x"><ref prop="vertex4">_polygon1</ref></extract>+1</x>
      <y><extract prop="y"><ref prop="vertex4">_polygon1</ref></extract>+1</y>
    </point>
    <point>(1,2)</point>
    <point>(3,4)</point>
    <point>
      <x><extract prop="x"><ref prop="vertex7">_polygon1</ref></extract>+1</x>
      <y><extract prop="y"><ref prop="vertex7">_polygon1</ref></extract>+1</y>
    </point>
    <point>(5,7)</point>
    <point>(-5,7)</point>
    <point>
      <x><extract prop="x"><ref prop="vertex10">_polygon1</ref></extract>+1</x>
      <y><extract prop="y"><ref prop="vertex10">_polygon1</ref></extract>+1</y>
    </point>
    <point>(3,1)</point>
    <point>(5,0)</point>
    <point>(-5,-1)</point>
  </vertices>
  </polygon>
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
      expect(components['/_polygon1'].state.vertices[0].tree).eqls(['tuple', ...A3]);
      expect(components['/_polygon1'].state.vertices[1].tree).eqls(['tuple', ...B]);
      expect(components['/_polygon1'].state.vertices[2].tree).eqls(['tuple', ...C]);
      expect(components['/_polygon1'].state.vertices[3].tree).eqls(['tuple', ...A2]);
      expect(components['/_polygon1'].state.vertices[4].tree).eqls(['tuple', ...D]);
      expect(components['/_polygon1'].state.vertices[5].tree).eqls(['tuple', ...E]);
      expect(components['/_polygon1'].state.vertices[6].tree).eqls(['tuple', ...A1]);
      expect(components['/_polygon1'].state.vertices[7].tree).eqls(['tuple', ...F]);
      expect(components['/_polygon1'].state.vertices[8].tree).eqls(['tuple', ...G]);
      expect(components['/_polygon1'].state.vertices[9].tree).eqls(['tuple', ...A]);
    })

    cy.log('move first vertex')
    cy.window().then((win) => {
      A = [-4, -9];
      A1 = [A[0] + 1, A[1] + 1];
      A2 = [A[0] + 2, A[1] + 2];
      A3 = [A[0] + 3, A[1] + 3];

      let components = Object.assign({}, win.state.components);
      components['/_polygon1'].movePolygon({ 0: A3 });
      expect(components['/_polygon1'].state.vertices[0].tree).eqls(['tuple', ...A3]);
      expect(components['/_polygon1'].state.vertices[1].tree).eqls(['tuple', ...B]);
      expect(components['/_polygon1'].state.vertices[2].tree).eqls(['tuple', ...C]);
      expect(components['/_polygon1'].state.vertices[3].tree).eqls(['tuple', ...A2]);
      expect(components['/_polygon1'].state.vertices[4].tree).eqls(['tuple', ...D]);
      expect(components['/_polygon1'].state.vertices[5].tree).eqls(['tuple', ...E]);
      expect(components['/_polygon1'].state.vertices[6].tree).eqls(['tuple', ...A1]);
      expect(components['/_polygon1'].state.vertices[7].tree).eqls(['tuple', ...F]);
      expect(components['/_polygon1'].state.vertices[8].tree).eqls(['tuple', ...G]);
      expect(components['/_polygon1'].state.vertices[9].tree).eqls(['tuple', ...A]);
    })

    cy.log('move second vertex')
    cy.window().then((win) => {
      B = [8, 9];

      let components = Object.assign({}, win.state.components);
      components['/_polygon1'].movePolygon({ 1: B });
      expect(components['/_polygon1'].state.vertices[0].tree).eqls(['tuple', ...A3]);
      expect(components['/_polygon1'].state.vertices[1].tree).eqls(['tuple', ...B]);
      expect(components['/_polygon1'].state.vertices[2].tree).eqls(['tuple', ...C]);
      expect(components['/_polygon1'].state.vertices[3].tree).eqls(['tuple', ...A2]);
      expect(components['/_polygon1'].state.vertices[4].tree).eqls(['tuple', ...D]);
      expect(components['/_polygon1'].state.vertices[5].tree).eqls(['tuple', ...E]);
      expect(components['/_polygon1'].state.vertices[6].tree).eqls(['tuple', ...A1]);
      expect(components['/_polygon1'].state.vertices[7].tree).eqls(['tuple', ...F]);
      expect(components['/_polygon1'].state.vertices[8].tree).eqls(['tuple', ...G]);
      expect(components['/_polygon1'].state.vertices[9].tree).eqls(['tuple', ...A]);
    })

    cy.log('move third vertex')
    cy.window().then((win) => {
      C = [-3, 7];

      let components = Object.assign({}, win.state.components);
      components['/_polygon1'].movePolygon({ 2: C });
      expect(components['/_polygon1'].state.vertices[0].tree).eqls(['tuple', ...A3]);
      expect(components['/_polygon1'].state.vertices[1].tree).eqls(['tuple', ...B]);
      expect(components['/_polygon1'].state.vertices[2].tree).eqls(['tuple', ...C]);
      expect(components['/_polygon1'].state.vertices[3].tree).eqls(['tuple', ...A2]);
      expect(components['/_polygon1'].state.vertices[4].tree).eqls(['tuple', ...D]);
      expect(components['/_polygon1'].state.vertices[5].tree).eqls(['tuple', ...E]);
      expect(components['/_polygon1'].state.vertices[6].tree).eqls(['tuple', ...A1]);
      expect(components['/_polygon1'].state.vertices[7].tree).eqls(['tuple', ...F]);
      expect(components['/_polygon1'].state.vertices[8].tree).eqls(['tuple', ...G]);
      expect(components['/_polygon1'].state.vertices[9].tree).eqls(['tuple', ...A]);
    })

    cy.log('move fourth vertex')
    cy.window().then((win) => {
      A = [7, 0];
      A1 = [A[0] + 1, A[1] + 1];
      A2 = [A[0] + 2, A[1] + 2];
      A3 = [A[0] + 3, A[1] + 3];

      let components = Object.assign({}, win.state.components);
      components['/_polygon1'].movePolygon({ 3: A2 });
      expect(components['/_polygon1'].state.vertices[0].tree).eqls(['tuple', ...A3]);
      expect(components['/_polygon1'].state.vertices[1].tree).eqls(['tuple', ...B]);
      expect(components['/_polygon1'].state.vertices[2].tree).eqls(['tuple', ...C]);
      expect(components['/_polygon1'].state.vertices[3].tree).eqls(['tuple', ...A2]);
      expect(components['/_polygon1'].state.vertices[4].tree).eqls(['tuple', ...D]);
      expect(components['/_polygon1'].state.vertices[5].tree).eqls(['tuple', ...E]);
      expect(components['/_polygon1'].state.vertices[6].tree).eqls(['tuple', ...A1]);
      expect(components['/_polygon1'].state.vertices[7].tree).eqls(['tuple', ...F]);
      expect(components['/_polygon1'].state.vertices[8].tree).eqls(['tuple', ...G]);
      expect(components['/_polygon1'].state.vertices[9].tree).eqls(['tuple', ...A]);
    })

    cy.log('move fifth vertex')
    cy.window().then((win) => {
      D = [-9, 1];
      let components = Object.assign({}, win.state.components);
      components['/_polygon1'].movePolygon({ 4: D });
      expect(components['/_polygon1'].state.vertices[0].tree).eqls(['tuple', ...A3]);
      expect(components['/_polygon1'].state.vertices[1].tree).eqls(['tuple', ...B]);
      expect(components['/_polygon1'].state.vertices[2].tree).eqls(['tuple', ...C]);
      expect(components['/_polygon1'].state.vertices[3].tree).eqls(['tuple', ...A2]);
      expect(components['/_polygon1'].state.vertices[4].tree).eqls(['tuple', ...D]);
      expect(components['/_polygon1'].state.vertices[5].tree).eqls(['tuple', ...E]);
      expect(components['/_polygon1'].state.vertices[6].tree).eqls(['tuple', ...A1]);
      expect(components['/_polygon1'].state.vertices[7].tree).eqls(['tuple', ...F]);
      expect(components['/_polygon1'].state.vertices[8].tree).eqls(['tuple', ...G]);
      expect(components['/_polygon1'].state.vertices[9].tree).eqls(['tuple', ...A]);
    })

    cy.log('move sixth vertex')
    cy.window().then((win) => {
      E = [-3, 6];
      let components = Object.assign({}, win.state.components);
      components['/_polygon1'].movePolygon({ 5: E });
      expect(components['/_polygon1'].state.vertices[0].tree).eqls(['tuple', ...A3]);
      expect(components['/_polygon1'].state.vertices[1].tree).eqls(['tuple', ...B]);
      expect(components['/_polygon1'].state.vertices[2].tree).eqls(['tuple', ...C]);
      expect(components['/_polygon1'].state.vertices[3].tree).eqls(['tuple', ...A2]);
      expect(components['/_polygon1'].state.vertices[4].tree).eqls(['tuple', ...D]);
      expect(components['/_polygon1'].state.vertices[5].tree).eqls(['tuple', ...E]);
      expect(components['/_polygon1'].state.vertices[6].tree).eqls(['tuple', ...A1]);
      expect(components['/_polygon1'].state.vertices[7].tree).eqls(['tuple', ...F]);
      expect(components['/_polygon1'].state.vertices[8].tree).eqls(['tuple', ...G]);
      expect(components['/_polygon1'].state.vertices[9].tree).eqls(['tuple', ...A]);
    })

    cy.log('move seventh vertex')
    cy.window().then((win) => {
      A = [2, -4];
      A1 = [A[0] + 1, A[1] + 1];
      A2 = [A[0] + 2, A[1] + 2];
      A3 = [A[0] + 3, A[1] + 3];

      let components = Object.assign({}, win.state.components);
      components['/_polygon1'].movePolygon({ 6: A1 });
      expect(components['/_polygon1'].state.vertices[0].tree).eqls(['tuple', ...A3]);
      expect(components['/_polygon1'].state.vertices[1].tree).eqls(['tuple', ...B]);
      expect(components['/_polygon1'].state.vertices[2].tree).eqls(['tuple', ...C]);
      expect(components['/_polygon1'].state.vertices[3].tree).eqls(['tuple', ...A2]);
      expect(components['/_polygon1'].state.vertices[4].tree).eqls(['tuple', ...D]);
      expect(components['/_polygon1'].state.vertices[5].tree).eqls(['tuple', ...E]);
      expect(components['/_polygon1'].state.vertices[6].tree).eqls(['tuple', ...A1]);
      expect(components['/_polygon1'].state.vertices[7].tree).eqls(['tuple', ...F]);
      expect(components['/_polygon1'].state.vertices[8].tree).eqls(['tuple', ...G]);
      expect(components['/_polygon1'].state.vertices[9].tree).eqls(['tuple', ...A]);
    })

    cy.log('move eighth vertex')
    cy.window().then((win) => {
      F = [6, 7];
      let components = Object.assign({}, win.state.components);
      components['/_polygon1'].movePolygon({ 7: F });
      expect(components['/_polygon1'].state.vertices[0].tree).eqls(['tuple', ...A3]);
      expect(components['/_polygon1'].state.vertices[1].tree).eqls(['tuple', ...B]);
      expect(components['/_polygon1'].state.vertices[2].tree).eqls(['tuple', ...C]);
      expect(components['/_polygon1'].state.vertices[3].tree).eqls(['tuple', ...A2]);
      expect(components['/_polygon1'].state.vertices[4].tree).eqls(['tuple', ...D]);
      expect(components['/_polygon1'].state.vertices[5].tree).eqls(['tuple', ...E]);
      expect(components['/_polygon1'].state.vertices[6].tree).eqls(['tuple', ...A1]);
      expect(components['/_polygon1'].state.vertices[7].tree).eqls(['tuple', ...F]);
      expect(components['/_polygon1'].state.vertices[8].tree).eqls(['tuple', ...G]);
      expect(components['/_polygon1'].state.vertices[9].tree).eqls(['tuple', ...A]);
    })

    cy.log('move nineth vertex')
    cy.window().then((win) => {
      G = [1, -8];
      let components = Object.assign({}, win.state.components);
      components['/_polygon1'].movePolygon({ 8: G });
      expect(components['/_polygon1'].state.vertices[0].tree).eqls(['tuple', ...A3]);
      expect(components['/_polygon1'].state.vertices[1].tree).eqls(['tuple', ...B]);
      expect(components['/_polygon1'].state.vertices[2].tree).eqls(['tuple', ...C]);
      expect(components['/_polygon1'].state.vertices[3].tree).eqls(['tuple', ...A2]);
      expect(components['/_polygon1'].state.vertices[4].tree).eqls(['tuple', ...D]);
      expect(components['/_polygon1'].state.vertices[5].tree).eqls(['tuple', ...E]);
      expect(components['/_polygon1'].state.vertices[6].tree).eqls(['tuple', ...A1]);
      expect(components['/_polygon1'].state.vertices[7].tree).eqls(['tuple', ...F]);
      expect(components['/_polygon1'].state.vertices[8].tree).eqls(['tuple', ...G]);
      expect(components['/_polygon1'].state.vertices[9].tree).eqls(['tuple', ...A]);
    })

    cy.log('move tenth vertex')
    cy.window().then((win) => {
      A = [-6, 7];
      A1 = [A[0] + 1, A[1] + 1];
      A2 = [A[0] + 2, A[1] + 2];
      A3 = [A[0] + 3, A[1] + 3];

      let components = Object.assign({}, win.state.components);
      components['/_polygon1'].movePolygon({ 9: A });
      expect(components['/_polygon1'].state.vertices[0].tree).eqls(['tuple', ...A3]);
      expect(components['/_polygon1'].state.vertices[1].tree).eqls(['tuple', ...B]);
      expect(components['/_polygon1'].state.vertices[2].tree).eqls(['tuple', ...C]);
      expect(components['/_polygon1'].state.vertices[3].tree).eqls(['tuple', ...A2]);
      expect(components['/_polygon1'].state.vertices[4].tree).eqls(['tuple', ...D]);
      expect(components['/_polygon1'].state.vertices[5].tree).eqls(['tuple', ...E]);
      expect(components['/_polygon1'].state.vertices[6].tree).eqls(['tuple', ...A1]);
      expect(components['/_polygon1'].state.vertices[7].tree).eqls(['tuple', ...F]);
      expect(components['/_polygon1'].state.vertices[8].tree).eqls(['tuple', ...G]);
      expect(components['/_polygon1'].state.vertices[9].tree).eqls(['tuple', ...A]);
    })

  })

});