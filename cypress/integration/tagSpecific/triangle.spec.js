describe('Triangle Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')

  })

  it('triangle with string points', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <text>a</text>
  <graph>
    <triangle>
      (3,5),(5,2),(-3,4)
    </triangle>
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_triangle1'].state.vertices[0].tree).eqls(['tuple', 3, 5]);
      expect(components['/_triangle1'].state.vertices[1].tree).eqls(['tuple', 5, 2]);
      expect(components['/_triangle1'].state.vertices[2].tree).eqls(['tuple', -3, 4]);
    })

    cy.log('move triangle up and to the right')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let vertices = [];
      for (let i = 0; i < components['/_triangle1'].state.nPoints; i++) {
        vertices.push([
          components['/_triangle1'].state.vertices[i].get_component(0),
          components['/_triangle1'].state.vertices[i].get_component(1)
        ])
      }

      let moveX = 3;
      let moveY = 2;

      for (let i = 0; i < vertices.length; i++) {
        vertices[i][0] = vertices[i][0].add(moveX);
        vertices[i][1] = vertices[i][1].add(moveY);
      }

      components['/_triangle1'].movePolygon(vertices);

      let pxs = [];
      let pys = [];
      for (let i = 0; i < vertices.length; i++) {
        pxs.push(vertices[i][0].simplify().tree);
        pys.push(vertices[i][1].simplify().tree);
      }

      for (let i = 0; i < vertices.length; i++) {
        expect(components['/_triangle1'].state.vertices[i].tree).eqls(['tuple', pxs[i], pys[i]]);
      }

    })


  })

  it('constrain to triangle', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
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
      expect(components['/_triangle1'].state.vertices[0].tree).eqls(['tuple', 0, 0]);
      expect(components['/_triangle1'].state.vertices[1].tree).eqls(['tuple', 6, 0]);
      expect(components['/_triangle1'].state.vertices[2].tree).eqls(['tuple', 0, 6]);
      expect(components['/_point1'].state.xs[0].tree).eq(3);
      expect(components['/_point1'].state.xs[1].tree).eq(3);


    })

    cy.log("move point upper left")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: -3, y: 8 });
      expect(components['/_point1'].state.xs[0].tree).eq(0);
      expect(components['/_point1'].state.xs[1].tree).eq(6);
    })

    cy.log("move point to left")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: -5, y: 4 });
      expect(components['/_point1'].state.xs[0].tree).eq(0);
      expect(components['/_point1'].state.xs[1].tree).eq(4);
    })

    cy.log("move point to lower left")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: -7, y: -3 });
      expect(components['/_point1'].state.xs[0].tree).eq(0);
      expect(components['/_point1'].state.xs[1].tree).eq(0);
    })

    cy.log("move point to lower right")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: 8, y: -8 });
      expect(components['/_point1'].state.xs[0].tree).eq(6);
      expect(components['/_point1'].state.xs[1].tree).eq(0);
    })

    cy.log("move point to right")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: 8, y: 4 });
      expect(components['/_point1'].state.xs[0].tree).eq(5);
      expect(components['/_point1'].state.xs[1].tree).eq(1);
    })

    cy.log("move point to middle")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: 1.5, y: 3.5 });
      expect(components['/_point1'].state.xs[0].tree).eq(2);
      expect(components['/_point1'].state.xs[1].tree).eq(4);
    })

    cy.log("move point a little left")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: 1, y: 3 });
      expect(components['/_point1'].state.xs[0].tree).eq(0);
      expect(components['/_point1'].state.xs[1].tree).eq(3);
    })


  })

  it('reflect triangle via individual vertices', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
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
      expect(components['/_triangle1'].state.vertices[0].tree).eqls(['tuple', 1, 2]);
      expect(components['/_triangle1'].state.vertices[1].tree).eqls(['tuple', 3, 4]);
      expect(components['/_triangle1'].state.vertices[2].tree).eqls(['tuple', -5, 6]);
      expect(components['/_triangle2'].state.vertices[0].tree).eqls(['tuple', 2, 1]);
      expect(components['/_triangle2'].state.vertices[1].tree).eqls(['tuple', 4, 3]);
      expect(components['/_triangle2'].state.vertices[2].tree).eqls(['tuple', 6, -5]);
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

      expect(components['/_triangle1'].state.vertices[0].tree).eqls(['tuple', x1, y1]);
      expect(components['/_triangle1'].state.vertices[1].tree).eqls(['tuple', x2, y2]);
      expect(components['/_triangle1'].state.vertices[2].tree).eqls(['tuple', x3, y3]);
      expect(components['/_triangle2'].state.vertices[0].tree).eqls(['tuple', y1, x1]);
      expect(components['/_triangle2'].state.vertices[1].tree).eqls(['tuple', y2, x2]);
      expect(components['/_triangle2'].state.vertices[2].tree).eqls(['tuple', y3, x3]);

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

      expect(components['/_triangle1'].state.vertices[0].tree).eqls(['tuple', x1, y1]);
      expect(components['/_triangle1'].state.vertices[1].tree).eqls(['tuple', x2, y2]);
      expect(components['/_triangle1'].state.vertices[2].tree).eqls(['tuple', x3, y3]);
      expect(components['/_triangle2'].state.vertices[0].tree).eqls(['tuple', y1, x1]);
      expect(components['/_triangle2'].state.vertices[1].tree).eqls(['tuple', y2, x2]);
      expect(components['/_triangle2'].state.vertices[2].tree).eqls(['tuple', y3, x3]);

    })

  })

  it('triangle with one vertex refection of other', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
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
      expect(components['/_triangle1'].state.vertices[0].tree).eqls(['tuple', 5, 3]);
      expect(components['/_triangle1'].state.vertices[1].tree).eqls(['tuple', 3, 5]);
      expect(components['/_triangle1'].state.vertices[2].tree).eqls(['tuple', -5, 2]);
    })

    cy.log('move first vertex')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_triangle1'].movePolygon({ 0: [-1, 4] });
      expect(components['/_triangle1'].state.vertices[0].tree).eqls(['tuple', -1, 4]);
      expect(components['/_triangle1'].state.vertices[1].tree).eqls(['tuple', 4, -1]);
      expect(components['/_triangle1'].state.vertices[2].tree).eqls(['tuple', -5, 2]);
    })

    cy.log('move second vertex')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_triangle1'].movePolygon({ 1: [7, -8] });
      expect(components['/_triangle1'].state.vertices[0].tree).eqls(['tuple', -8, 7]);
      expect(components['/_triangle1'].state.vertices[1].tree).eqls(['tuple', 7, -8]);
      expect(components['/_triangle1'].state.vertices[2].tree).eqls(['tuple', -5, 2]);
    })

    cy.log('move third vertex')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_triangle1'].movePolygon({ 2: [0, 6] });
      expect(components['/_triangle1'].state.vertices[0].tree).eqls(['tuple', -8, 7]);
      expect(components['/_triangle1'].state.vertices[1].tree).eqls(['tuple', 7, -8]);
      expect(components['/_triangle1'].state.vertices[2].tree).eqls(['tuple', 0, 6]);
    })

  })


});