describe('LineSegment Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')
  })

  it('lineSegment with sugared reffed points', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <ref prop="y">_point1</ref>
  <graph>
  <point label='P'>(3,5)</point>
  <point label='Q'>(-4,-1)</point>
    <lineSegment>
      <ref>_point1</ref>
      <ref>_point2</ref>
    </lineSegment>
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#__math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('5')
    })

    cy.log('move point P to (5,-5)')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: 5, y: -5 });
      expect(components['/_point1'].state.xs[0].tree).eq(5)
      expect(components['/_point1'].state.xs[1].tree).eq(-5)
      expect(components['/_point1'].state.coords.tree).eqls(['tuple', 5, -5])
      expect(components['/_point2'].state.xs[0].tree).eq(-4)
      expect(components['/_point2'].state.xs[1].tree).eq(-1)
      expect(components['/_point2'].state.coords.tree).eqls(['tuple', -4, -1])
      expect(components['/_linesegment1'].state.endpoints[0].tree).eqls(['tuple', 5, -5]);
      expect(components['/_linesegment1'].state.endpoints[1].tree).eqls(['tuple', -4, -1]);
    })

    cy.log('move line segment up and to the right')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let point1coords = [
        components['/_linesegment1'].state.endpoints[0].get_component(0),
        components['/_linesegment1'].state.endpoints[0].get_component(1),
      ];
      let point2coords = [
        components['/_linesegment1'].state.endpoints[1].get_component(0),
        components['/_linesegment1'].state.endpoints[1].get_component(1),
      ];

      let moveX = 3;
      let moveY = 2;

      point1coords[0] = point1coords[0].add(moveX);
      point1coords[1] = point1coords[1].add(moveY);
      point2coords[0] = point2coords[0].add(moveX);
      point2coords[1] = point2coords[1].add(moveY);

      components['/_linesegment1'].moveLineSegment({
        point1coords: point1coords,
        point2coords: point2coords
      });

      let p1x = point1coords[0].simplify().tree;
      let p1y = point1coords[1].simplify().tree;
      let p2x = point2coords[0].simplify().tree;
      let p2y = point2coords[1].simplify().tree;

      expect(components['/_point1'].state.xs[0].tree).eq(p1x)
      expect(components['/_point1'].state.xs[1].tree).eq(p1y)
      expect(components['/_point1'].state.coords.tree).eqls(['tuple', p1x, p1y])
      expect(components['/_point2'].state.xs[0].tree).eq(p2x)
      expect(components['/_point2'].state.xs[1].tree).eq(p2y)
      expect(components['/_point2'].state.coords.tree).eqls(['tuple', p2x, p2y])
      expect(components['/_linesegment1'].state.endpoints[0].tree).eqls(["tuple", p1x, p1y]);
      expect(components['/_linesegment1'].state.endpoints[1].tree).eqls(["tuple", p2x, p2y]);

    })
  })

  it('lineSegment with sugared string', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <extract prop="y"><ref prop="endpoint1">_linesegment1</ref></extract>
  <graph>
    <lineSegment>(3,5),(-4,9)</lineSegment>
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#__math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('5')
    })

    cy.log('Test location')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components.__point1.state.xs[0].tree).eq(3)
      expect(components.__point1.state.xs[1].tree).eq(5)
      expect(components.__point2.state.xs[0].tree).eq(-4)
      expect(components.__point2.state.xs[1].tree).eq(9)
      expect(components['/_linesegment1'].state.endpoints[0].tree).eqls(['tuple', 3, 5]);
      expect(components['/_linesegment1'].state.endpoints[1].tree).eqls(['tuple', -4, 9]);

    })

    cy.log('move line segment up and to the left')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let point1coords = [
        components['/_linesegment1'].state.endpoints[0].get_component(0),
        components['/_linesegment1'].state.endpoints[0].get_component(1),
      ];
      let point2coords = [
        components['/_linesegment1'].state.endpoints[1].get_component(0),
        components['/_linesegment1'].state.endpoints[1].get_component(1),
      ];

      let moveX = -3;
      let moveY = 2;

      point1coords[0] = point1coords[0].add(moveX);
      point1coords[1] = point1coords[1].add(moveY);
      point2coords[0] = point2coords[0].add(moveX);
      point2coords[1] = point2coords[1].add(moveY);

      components['/_linesegment1'].moveLineSegment({
        point1coords: point1coords,
        point2coords: point2coords
      });

      let p1x = point1coords[0].simplify().tree;
      let p1y = point1coords[1].simplify().tree;
      let p2x = point2coords[0].simplify().tree;
      let p2y = point2coords[1].simplify().tree;

      expect(components.__point1.state.xs[0].tree).eq(p1x)
      expect(components.__point1.state.xs[1].tree).eq(p1y)
      expect(components.__point1.state.coords.tree).eqls(['tuple', p1x, p1y])
      expect(components.__point2.state.xs[0].tree).eq(p2x)
      expect(components.__point2.state.xs[1].tree).eq(p2y)
      expect(components.__point2.state.coords.tree).eqls(['tuple', p2x, p2y])
      expect(components['/_linesegment1'].state.endpoints[0].tree).eqls(["tuple", p1x, p1y]);
      expect(components['/_linesegment1'].state.endpoints[1].tree).eqls(["tuple", p2x, p2y]);

    })
  })

  it('lineSegment with sugared strings and refs', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <number>3</number>
  <graph>
  <point>(-2,1)</point>
  <linesegment>
  (<ref>_number1</ref>, <ref prop="x">_point1</ref>),
  (<ref prop="y">_point1</ref>, 5)
  </linesegment>
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_number1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    })

    cy.log('Test location')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_linesegment1'].state.endpoints[0].tree).eqls(['tuple', 3, -2]);
      expect(components['/_linesegment1'].state.endpoints[1].tree).eqls(['tuple', 1, 5]);
      expect(components['/_point1'].state.xs[0].tree).eq(-2);
      expect(components['/_point1'].state.xs[1].tree).eq(1);
      expect(components['/_number1'].state.number).eq(3);

    })

    cy.log('move line segment up and to the left')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let point1coords = [
        components['/_linesegment1'].state.endpoints[0].get_component(0),
        components['/_linesegment1'].state.endpoints[0].get_component(1),
      ];
      let point2coords = [
        components['/_linesegment1'].state.endpoints[1].get_component(0),
        components['/_linesegment1'].state.endpoints[1].get_component(1),
      ];

      let moveX = -3;
      let moveY = 2;

      point1coords[0] = point1coords[0].add(moveX);
      point1coords[1] = point1coords[1].add(moveY);
      point2coords[0] = point2coords[0].add(moveX);
      point2coords[1] = point2coords[1].add(moveY);

      components['/_linesegment1'].moveLineSegment({
        point1coords: point1coords,
        point2coords: point2coords
      });

      let p1x = point1coords[0].simplify().tree;
      let p1y = point1coords[1].simplify().tree;
      let p2x = point2coords[0].simplify().tree;
      let p2y = point2coords[1].simplify().tree;

      expect(components['/_point1'].state.xs[0].tree).eq(p1y)
      expect(components['/_point1'].state.xs[1].tree).eq(p2x)
      expect(components['/_number1'].state.number).eq(p1x)
      expect(components['/_linesegment1'].state.endpoints[0].tree).eqls(["tuple", p1x, p1y]);
      expect(components['/_linesegment1'].state.endpoints[1].tree).eqls(["tuple", p2x, p2y]);

    })
  })

  it('lineSegment with endpoints containing sugared strings and refs', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <number>3</number>
  <graph>
  <point>(-2,1)</point>
  <linesegment><endpoints>
  (<ref>_number1</ref>, <ref prop="x">_point1</ref>),
  (<ref prop="y">_point1</ref>, 5)
  </endpoints></linesegment>
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_number1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    })

    cy.log('Test location')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_linesegment1'].state.endpoints[0].tree).eqls(['tuple', 3, -2]);
      expect(components['/_linesegment1'].state.endpoints[1].tree).eqls(['tuple', 1, 5]);
      expect(components['/_point1'].state.xs[0].tree).eq(-2);
      expect(components['/_point1'].state.xs[1].tree).eq(1);
      expect(components['/_number1'].state.number).eq(3);

    })

    cy.log('move both ends of line segement')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let point1coords = [
        components['/_linesegment1'].state.endpoints[0].get_component(0),
        components['/_linesegment1'].state.endpoints[0].get_component(1),
      ];
      let point2coords = [
        components['/_linesegment1'].state.endpoints[1].get_component(0),
        components['/_linesegment1'].state.endpoints[1].get_component(1),
      ];

      let moveX = 3;
      let moveY = -2;

      point1coords[0] = point1coords[0].add(moveX);
      point1coords[1] = point1coords[1].add(moveY);

      moveX = -5;
      moveY = 1;
      point2coords[0] = point2coords[0].add(moveX);
      point2coords[1] = point2coords[1].add(moveY);

      components['/_linesegment1'].moveLineSegment({
        point1coords: point1coords,
        point2coords: point2coords
      });

      let p1x = point1coords[0].simplify().tree;
      let p1y = point1coords[1].simplify().tree;
      let p2x = point2coords[0].simplify().tree;
      let p2y = point2coords[1].simplify().tree;

      expect(components['/_linesegment1'].state.endpoints[0].tree).eqls(["tuple", p1x, p1y]);
      expect(components['/_linesegment1'].state.endpoints[1].tree).eqls(["tuple", p2x, p2y]);
      expect(components['/_point1'].state.xs[0].tree).eq(p1y);
      expect(components['/_point1'].state.xs[1].tree).eq(p2x);
      expect(components['/_number1'].state.number).eq(p1x);

    })
  })

  it('lineSegment with sugared points containing sugared strings and refs', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <number>3</number>
  <graph>
  <point>(-2,1)</point>
  <linesegment>
  <point>(<ref>_number1</ref>, <ref prop="x">_point1</ref>)</point>
  <point>(<ref prop="y">_point1</ref>, 5)</point>
  </linesegment>
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_number1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    })

    cy.log('Test location')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_linesegment1'].state.endpoints[0].tree).eqls(['tuple', 3, -2]);
      expect(components['/_linesegment1'].state.endpoints[1].tree).eqls(['tuple', 1, 5]);
      expect(components['/_point1'].state.xs[0].tree).eq(-2);
      expect(components['/_point1'].state.xs[1].tree).eq(1);
      expect(components['/_number1'].state.number).eq(3);
    })

    cy.log('move both ends of line segement')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let point1coords = [
        components['/_linesegment1'].state.endpoints[0].get_component(0),
        components['/_linesegment1'].state.endpoints[0].get_component(1),
      ];
      let point2coords = [
        components['/_linesegment1'].state.endpoints[1].get_component(0),
        components['/_linesegment1'].state.endpoints[1].get_component(1),
      ];

      let moveX = -1;
      let moveY = 4;

      point1coords[0] = point1coords[0].add(moveX);
      point1coords[1] = point1coords[1].add(moveY);

      moveX = 2;
      moveY = -6;
      point2coords[0] = point2coords[0].add(moveX);
      point2coords[1] = point2coords[1].add(moveY);

      components['/_linesegment1'].moveLineSegment({
        point1coords: point1coords,
        point2coords: point2coords
      });

      let p1x = point1coords[0].simplify().tree;
      let p1y = point1coords[1].simplify().tree;
      let p2x = point2coords[0].simplify().tree;
      let p2y = point2coords[1].simplify().tree;

      expect(components['/_linesegment1'].state.endpoints[0].tree).eqls(["tuple", p1x, p1y]);
      expect(components['/_linesegment1'].state.endpoints[1].tree).eqls(["tuple", p2x, p2y]);
      expect(components['/_point1'].state.xs[0].tree).eq(p1y);
      expect(components['/_point1'].state.xs[1].tree).eq(p2x);
      expect(components['/_number1'].state.number).eq(p1x);

    })
  })

  it('lineSegment with no sugar', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <extract prop="y"><ref prop="endpoint1">_linesegment1</ref></extract>
  <graph>
    <lineSegment><endpoints>
      <point>(-1,2)</point>
      <point>(-2,3)</point>
    </endpoints></lineSegment>
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#__math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    })

    cy.log('move point1 via segment to (-2,-3)')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_linesegment1'].moveLineSegment({
        point1coords: [-2, -3],
        point2coords: [-2, 3]
      });
      expect(components['/_point1'].state.xs[0].tree).eq(-2)
      expect(components['/_point1'].state.xs[1].tree).eq(-3)
      expect(components['/_point1'].state.coords.tree).eqls(['tuple', -2, -3])
      expect(components['/_point2'].state.xs[0].tree).eq(-2)
      expect(components['/_point2'].state.xs[1].tree).eq(3)
      expect(components['/_point2'].state.coords.tree).eqls(['tuple', -2, 3])
      expect(components['/_linesegment1'].state.endpoints[0].tree).eqls(['tuple', -2, -3]);
      expect(components['/_linesegment1'].state.endpoints[1].tree).eqls(['tuple', -2, 3]);

    })

    cy.log('move line segment up and to the right')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let point1coords = [
        components['/_linesegment1'].state.endpoints[0].get_component(0),
        components['/_linesegment1'].state.endpoints[0].get_component(1),
      ];
      let point2coords = [
        components['/_linesegment1'].state.endpoints[1].get_component(0),
        components['/_linesegment1'].state.endpoints[1].get_component(1),
      ];

      let moveX = 3;
      let moveY = 2;

      point1coords[0] = point1coords[0].add(moveX);
      point1coords[1] = point1coords[1].add(moveY);
      point2coords[0] = point2coords[0].add(moveX);
      point2coords[1] = point2coords[1].add(moveY);

      components['/_linesegment1'].moveLineSegment({
        point1coords: point1coords,
        point2coords: point2coords
      });

      let p1x = point1coords[0].simplify().tree;
      let p1y = point1coords[1].simplify().tree;
      let p2x = point2coords[0].simplify().tree;
      let p2y = point2coords[1].simplify().tree;

      expect(components['/_point1'].state.xs[0].tree).eq(p1x)
      expect(components['/_point1'].state.xs[1].tree).eq(p1y)
      expect(components['/_point1'].state.coords.tree).eqls(['tuple', p1x, p1y])
      expect(components['/_point2'].state.xs[0].tree).eq(p2x)
      expect(components['/_point2'].state.xs[1].tree).eq(p2y)
      expect(components['/_point2'].state.coords.tree).eqls(['tuple', p2x, p2y])
      expect(components['/_linesegment1'].state.endpoints[0].tree).eqls(["tuple", p1x, p1y]);
      expect(components['/_linesegment1'].state.endpoints[1].tree).eqls(["tuple", p2x, p2y]);

    })
  })

  it('lineSegment with multiple layers of reffed points in sugar', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <point>(2,1)</point>
  <point>(-2,-5)</point>
  <ref>_point1</ref>
  <ref>_point2</ref>
  <ref>_ref1</ref>
  <ref>_ref2</ref>
  <ref>_ref3</ref>
  <ref>_ref4</ref>
  
  <graph>
    <lineSegment>
      <ref>_ref5</ref>
      <ref>_ref6</ref>
    </lineSegment>
  </graph>
  <ref prop="y">_point1</ref>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#__math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.log('move point 10 to (0,-3)')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components.__point8.movePoint({ x: 0, y: -3 });
      expect(components.__point7.state.xs[0].tree).eq(2)
      expect(components.__point7.state.xs[1].tree).eq(1)
      expect(components.__point8.state.xs[0].tree).eq(0)
      expect(components.__point8.state.xs[1].tree).eq(-3)
      expect(components['/_linesegment1'].state.endpoints[0].tree).eqls(['tuple', 2, 1]);
      expect(components['/_linesegment1'].state.endpoints[1].tree).eqls(['tuple', 0, -3]);

    })

    cy.log('move line segment down and to the left')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let point1coords = [
        components['/_linesegment1'].state.endpoints[0].get_component(0),
        components['/_linesegment1'].state.endpoints[0].get_component(1),
      ];
      let point2coords = [
        components['/_linesegment1'].state.endpoints[1].get_component(0),
        components['/_linesegment1'].state.endpoints[1].get_component(1),
      ];

      let moveX = -3;
      let moveY = -2;

      point1coords[0] = point1coords[0].add(moveX);
      point1coords[1] = point1coords[1].add(moveY);
      point2coords[0] = point2coords[0].add(moveX);
      point2coords[1] = point2coords[1].add(moveY);

      components['/_linesegment1'].moveLineSegment({
        point1coords: point1coords,
        point2coords: point2coords
      });

      let p1x = point1coords[0].simplify().tree;
      let p1y = point1coords[1].simplify().tree;
      let p2x = point2coords[0].simplify().tree;
      let p2y = point2coords[1].simplify().tree;

      expect(components.__point7.state.xs[0].tree).eq(p1x)
      expect(components.__point7.state.xs[1].tree).eq(p1y)
      expect(components.__point8.state.xs[0].tree).eq(p2x)
      expect(components.__point8.state.xs[1].tree).eq(p2y)
      expect(components['/_linesegment1'].state.endpoints[0].tree).eqls(["tuple", p1x, p1y]);
      expect(components['/_linesegment1'].state.endpoints[1].tree).eqls(["tuple", p2x, p2y]);

    })
  })

  it('reffed line segments', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <extract prop="y"><ref prop="endpoint1">_linesegment1</ref></extract>
  <graph>
    <linesegment><endpoints>
      <point>(-1,2)</point>
      <point>(-2,3)</point>
    </endpoints></linesegment>
    <point>(-4,7)</point>
    <point>(3,5)</point>
    <linesegment>
      <ref>_point3</ref>
      <ref>_point4</ref>
    </linesegment>
    <linesegment>(-9,-1),(-3,6)</linesegment>
  </graph>

  <graph>
    <ref>_linesegment1</ref>
    <ref>_linesegment2</ref>
    <ref>_linesegment3</ref>
  </graph>

  <ref>_graph2</ref>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#__math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    })

    let linesegment1s = ['/_linesegment1', '__linesegment1', '__linesegment4'];
    let linesegment2s = ['/_linesegment2', '__linesegment2', '__linesegment5'];
    let linesegment3s = ['/_linesegment3', '__linesegment3', '__linesegment6'];
    cy.log("initial state")


    cy.window().then((win) => {
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
        expect(components[name].state.endpoints[0].tree).eqls(["tuple", v1tx, v1ty]);
        expect(components[name].state.endpoints[1].tree).eqls(["tuple", v1hx, v1hy]);
      }
      for (let name of linesegment2s) {
        expect(components[name].state.endpoints[0].tree).eqls(["tuple", v2tx, v2ty]);
        expect(components[name].state.endpoints[1].tree).eqls(["tuple", v2hx, v2hy]);
      }
      for (let name of linesegment3s) {
        expect(components[name].state.endpoints[0].tree).eqls(["tuple", v3tx, v3ty]);
        expect(components[name].state.endpoints[1].tree).eqls(["tuple", v3hx, v3hy]);
      }

    })

    cy.log('move linesegment1')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let v1tx = 5;
      let v1ty = -8;
      let v1hx = 4;
      let v1hy = -9;
      components['/_linesegment1'].moveLineSegment({
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
        expect(components[name].state.endpoints[0].tree).eqls(["tuple", v1tx, v1ty]);
        expect(components[name].state.endpoints[1].tree).eqls(["tuple", v1hx, v1hy]);
      }
      for (let name of linesegment2s) {
        expect(components[name].state.endpoints[0].tree).eqls(["tuple", v2tx, v2ty]);
        expect(components[name].state.endpoints[1].tree).eqls(["tuple", v2hx, v2hy]);
      }
      for (let name of linesegment3s) {
        expect(components[name].state.endpoints[0].tree).eqls(["tuple", v3tx, v3ty]);
        expect(components[name].state.endpoints[1].tree).eqls(["tuple", v3hx, v3hy]);
      }
    })

    cy.log('move linesegment1')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let v1tx = 2;
      let v1ty = 6;
      let v1hx = -2;
      let v1hy = -4;
      components.__linesegment4.moveLineSegment({
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
        expect(components[name].state.endpoints[0].tree).eqls(["tuple", v1tx, v1ty]);
        expect(components[name].state.endpoints[1].tree).eqls(["tuple", v1hx, v1hy]);
      }
      for (let name of linesegment2s) {
        expect(components[name].state.endpoints[0].tree).eqls(["tuple", v2tx, v2ty]);
        expect(components[name].state.endpoints[1].tree).eqls(["tuple", v2hx, v2hy]);
      }
      for (let name of linesegment3s) {
        expect(components[name].state.endpoints[0].tree).eqls(["tuple", v3tx, v3ty]);
        expect(components[name].state.endpoints[1].tree).eqls(["tuple", v3hx, v3hy]);
      }
    })

    cy.log('move linesegment7')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let v1tx = -3;
      let v1ty = 9;
      let v1hx = 6;
      let v1hy = -8;
      components.__linesegment4.moveLineSegment({
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
        expect(components[name].state.endpoints[0].tree).eqls(["tuple", v1tx, v1ty]);
        expect(components[name].state.endpoints[1].tree).eqls(["tuple", v1hx, v1hy]);
      }
      for (let name of linesegment2s) {
        expect(components[name].state.endpoints[0].tree).eqls(["tuple", v2tx, v2ty]);
        expect(components[name].state.endpoints[1].tree).eqls(["tuple", v2hx, v2hy]);
      }
      for (let name of linesegment3s) {
        expect(components[name].state.endpoints[0].tree).eqls(["tuple", v3tx, v3ty]);
        expect(components[name].state.endpoints[1].tree).eqls(["tuple", v3hx, v3hy]);
      }
    })

    cy.log('move linesegment2')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let v2tx = -4;
      let v2ty = 7;
      let v2hx = 3;
      let v2hy = 5;

      components['/_linesegment2'].moveLineSegment({
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
        expect(components[name].state.endpoints[0].tree).eqls(["tuple", v1tx, v1ty]);
        expect(components[name].state.endpoints[1].tree).eqls(["tuple", v1hx, v1hy]);
      }
      for (let name of linesegment2s) {
        expect(components[name].state.endpoints[0].tree).eqls(["tuple", v2tx, v2ty]);
        expect(components[name].state.endpoints[1].tree).eqls(["tuple", v2hx, v2hy]);
      }
      for (let name of linesegment3s) {
        expect(components[name].state.endpoints[0].tree).eqls(["tuple", v3tx, v3ty]);
        expect(components[name].state.endpoints[1].tree).eqls(["tuple", v3hx, v3hy]);
      }
    })

    cy.log('move linesegment5')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let v2tx = 6;
      let v2ty = -2;
      let v2hx = 1;
      let v2hy = -7;

      components.__linesegment2.moveLineSegment({
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
        expect(components[name].state.endpoints[0].tree).eqls(["tuple", v1tx, v1ty]);
        expect(components[name].state.endpoints[1].tree).eqls(["tuple", v1hx, v1hy]);
      }
      for (let name of linesegment2s) {
        expect(components[name].state.endpoints[0].tree).eqls(["tuple", v2tx, v2ty]);
        expect(components[name].state.endpoints[1].tree).eqls(["tuple", v2hx, v2hy]);
      }
      for (let name of linesegment3s) {
        expect(components[name].state.endpoints[0].tree).eqls(["tuple", v3tx, v3ty]);
        expect(components[name].state.endpoints[1].tree).eqls(["tuple", v3hx, v3hy]);
      }
    })

    cy.log('move linesegment8')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let v2tx = -3;
      let v2ty = -6;
      let v2hx = 5;
      let v2hy = -9;

      components.__linesegment5.moveLineSegment({
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
        expect(components[name].state.endpoints[0].tree).eqls(["tuple", v1tx, v1ty]);
        expect(components[name].state.endpoints[1].tree).eqls(["tuple", v1hx, v1hy]);
      }
      for (let name of linesegment2s) {
        expect(components[name].state.endpoints[0].tree).eqls(["tuple", v2tx, v2ty]);
        expect(components[name].state.endpoints[1].tree).eqls(["tuple", v2hx, v2hy]);
      }
      for (let name of linesegment3s) {
        expect(components[name].state.endpoints[0].tree).eqls(["tuple", v3tx, v3ty]);
        expect(components[name].state.endpoints[1].tree).eqls(["tuple", v3hx, v3hy]);
      }
    })

    cy.log('move linesegment3')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let v3tx = 6;
      let v3ty = -8;
      let v3hx = -1;
      let v3hy = 0;

      components['/_linesegment3'].moveLineSegment({
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
        expect(components[name].state.endpoints[0].tree).eqls(["tuple", v1tx, v1ty]);
        expect(components[name].state.endpoints[1].tree).eqls(["tuple", v1hx, v1hy]);
      }
      for (let name of linesegment2s) {
        expect(components[name].state.endpoints[0].tree).eqls(["tuple", v2tx, v2ty]);
        expect(components[name].state.endpoints[1].tree).eqls(["tuple", v2hx, v2hy]);
      }
      for (let name of linesegment3s) {
        expect(components[name].state.endpoints[0].tree).eqls(["tuple", v3tx, v3ty]);
        expect(components[name].state.endpoints[1].tree).eqls(["tuple", v3hx, v3hy]);
      }
    })

    cy.log('move linesegment6')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let v3tx = 3;
      let v3ty = 1;
      let v3hx = -7;
      let v3hy = -2;

      components.__linesegment3.moveLineSegment({
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
        expect(components[name].state.endpoints[0].tree).eqls(["tuple", v1tx, v1ty]);
        expect(components[name].state.endpoints[1].tree).eqls(["tuple", v1hx, v1hy]);
      }
      for (let name of linesegment2s) {
        expect(components[name].state.endpoints[0].tree).eqls(["tuple", v2tx, v2ty]);
        expect(components[name].state.endpoints[1].tree).eqls(["tuple", v2hx, v2hy]);
      }
      for (let name of linesegment3s) {
        expect(components[name].state.endpoints[0].tree).eqls(["tuple", v3tx, v3ty]);
        expect(components[name].state.endpoints[1].tree).eqls(["tuple", v3hx, v3hy]);
      }
    })

    cy.log('move linesegment9')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let v3tx = -2;
      let v3ty = 7;
      let v3hx = 5;
      let v3hy = -6;

      components.__linesegment6.moveLineSegment({
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
        expect(components[name].state.endpoints[0].tree).eqls(["tuple", v1tx, v1ty]);
        expect(components[name].state.endpoints[1].tree).eqls(["tuple", v1hx, v1hy]);
      }
      for (let name of linesegment2s) {
        expect(components[name].state.endpoints[0].tree).eqls(["tuple", v2tx, v2ty]);
        expect(components[name].state.endpoints[1].tree).eqls(["tuple", v2hx, v2hy]);
      }
      for (let name of linesegment3s) {
        expect(components[name].state.endpoints[0].tree).eqls(["tuple", v3tx, v3ty]);
        expect(components[name].state.endpoints[1].tree).eqls(["tuple", v3hx, v3hy]);
      }
    })


  })

  it('initially non-numeric point', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <extract prop="y"><ref prop="endpoint1">_linesegment1</ref></extract>
  <mathinput name="x" prefill="q"/>
  <graph>
    <lineSegment>
      <point>(<ref prop="value">x</ref>,2)</point>
      <point>(-2,3)</point>
    </lineSegment>
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#__math2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    })

    cy.log('check initial values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_linesegment1'].state.endpoints[0].tree).eqls(['tuple', "q", 2]);
      expect(components['/_linesegment1'].state.endpoints[1].tree).eqls(['tuple', -2, 3]);
    });

    cy.log('change point to be numeric');
    cy.get('#\\/x_input').clear().type("5{enter}");

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_linesegment1'].state.endpoints[0].tree).eqls(['tuple', 5, 2]);
      expect(components['/_linesegment1'].state.endpoints[1].tree).eqls(['tuple', -2, 3]);

    })
  })

  it('constrain to linesegment', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <extract prop="y"><ref prop="endpoint1">_linesegment1</ref></extract>
  <graph>
  <point>(1,2)</point>
  <point>(3,4)</point>
  <linesegment><ref>_point1</ref><ref>_point2</ref></linesegment>

  <point>(-5,2)
    <constrainTo><ref>_linesegment1</ref></constrainTo>
  </point>
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#__math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    })

    cy.log('check initial values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_linesegment1'].state.endpoints[0].tree).eqls(['tuple', 1, 2]);
      expect(components['/_linesegment1'].state.endpoints[1].tree).eqls(['tuple', 3, 4]);
      expect(components['/_point3'].state.xs[0].tree).eq(1);
      expect(components['/_point3'].state.xs[1].tree).eq(2);
    });

    cy.log('move line segment to 45 degrees')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_linesegment1'].moveLineSegment({
        point1coords: [-4, 4],
        point2coords: [4, -4],
      })
      expect(components['/_linesegment1'].state.endpoints[0].tree).eqls(['tuple', -4, 4]);
      expect(components['/_linesegment1'].state.endpoints[1].tree).eqls(['tuple', 4, -4]);

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

      expect(components['/_point3'].state.xs[0].tree).closeTo(p5x, 1E-12);
      expect(components['/_point3'].state.xs[1].tree).closeTo(p5y, 1E-12);
    });

    cy.log('move point')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let xorig = 10;
      let yorig = 1;

      components['/_point3'].movePoint({ x: xorig, y: yorig });

      let temp = (xorig - yorig) / 2;
      if (temp > 4) {
        temp = 4;
      } else if (temp < -4) {
        temp = -4;
      }
      let p5x = temp;
      let p5y = -temp;

      expect(components['/_point3'].state.xs[0].tree).closeTo(p5x, 1E-12);
      expect(components['/_point3'].state.xs[1].tree).closeTo(p5y, 1E-12);
    });

    cy.log('move point')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let xorig = 9;
      let yorig = 7;

      components['/_point3'].movePoint({ x: xorig, y: yorig });

      let temp = (xorig - yorig) / 2;
      if (temp > 4) {
        temp = 4;
      } else if (temp < -4) {
        temp = -4;
      }
      let p5x = temp;
      let p5y = -temp;

      expect(components['/_point3'].state.xs[0].tree).closeTo(p5x, 1E-12);
      expect(components['/_point3'].state.xs[1].tree).closeTo(p5y, 1E-12);
    });

    cy.log('move point')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let xorig = -9;
      let yorig = 7;

      components['/_point3'].movePoint({ x: xorig, y: yorig });

      let temp = (xorig - yorig) / 2;
      if (temp > 4) {
        temp = 4;
      } else if (temp < -4) {
        temp = -4;
      }
      let p5x = temp;
      let p5y = -temp;

      expect(components['/_point3'].state.xs[0].tree).closeTo(p5x, 1E-12);
      expect(components['/_point3'].state.xs[1].tree).closeTo(p5y, 1E-12);
    });


  })

  it('attract to linesegment', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <extract prop="y"><ref prop="endpoint1">_linesegment1</ref></extract>
  <graph>
  <point>(1,2)</point>
  <point>(3,4)</point>
  <linesegment><ref>_point1</ref><ref>_point2</ref></linesegment>

  <point>(-5,2)
    <attractTo><ref>_linesegment1</ref></attractTo>
  </point>
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#__math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    })

    cy.log('check initial values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_linesegment1'].state.endpoints[0].tree).eqls(['tuple', 1, 2]);
      expect(components['/_linesegment1'].state.endpoints[1].tree).eqls(['tuple', 3, 4]);
      expect(components['/_point3'].state.xs[0].tree).eq(-5);
      expect(components['/_point3'].state.xs[1].tree).eq(2);
    });

    cy.log('move line segment to 45 degrees')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_linesegment1'].moveLineSegment({
        point1coords: [-4, 4],
        point2coords: [4, -4],
      })
      expect(components['/_linesegment1'].state.endpoints[0].tree).eqls(['tuple', -4, 4]);
      expect(components['/_linesegment1'].state.endpoints[1].tree).eqls(['tuple', 4, -4]);
      expect(components['/_point3'].state.xs[0].tree).eq(-5)
      expect(components['/_point3'].state.xs[1].tree).eq(2)
    });

    cy.log('move point')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let xorig = 3.3;
      let yorig = -3.6;

      components['/_point3'].movePoint({ x: xorig, y: yorig });

      let temp = (xorig - yorig) / 2;
      if (temp > 4) {
        temp = 4;
      } else if (temp < -4) {
        temp = -4;
      }
      let p5x = temp;
      let p5y = -temp;

      expect(components['/_point3'].state.xs[0].tree).closeTo(p5x, 1E-12);
      expect(components['/_point3'].state.xs[1].tree).closeTo(p5y, 1E-12);
    });

    cy.log('move point')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let xorig = 4.3;
      let yorig = -4.6;

      components['/_point3'].movePoint({ x: xorig, y: yorig });

      expect(components['/_point3'].state.xs[0].tree).closeTo(4.3, 1E-12);
      expect(components['/_point3'].state.xs[1].tree).closeTo(-4.6, 1E-12);
    });

    cy.log('move point')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let xorig = -2.4;
      let yorig = 2.8;

      components['/_point3'].movePoint({ x: xorig, y: yorig });

      let temp = (xorig - yorig) / 2;
      if (temp > 4) {
        temp = 4;
      } else if (temp < -4) {
        temp = -4;
      }
      let p5x = temp;
      let p5y = -temp;

      expect(components['/_point3'].state.xs[0].tree).closeTo(p5x, 1E-12);
      expect(components['/_point3'].state.xs[1].tree).closeTo(p5y, 1E-12);
    });

    cy.log('move point')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let xorig = -4.2;
      let yorig = 4.3;

      components['/_point3'].movePoint({ x: xorig, y: yorig });

      let temp = (xorig - yorig) / 2;
      if (temp > 4) {
        temp = 4;
      } else if (temp < -4) {
        temp = -4;
      }
      let p5x = temp;
      let p5y = -temp;

      expect(components['/_point3'].state.xs[0].tree).closeTo(p5x, 1E-12);
      expect(components['/_point3'].state.xs[1].tree).closeTo(p5y, 1E-12);
    });


  })

  it('ref endpoints of line segment', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <extract prop="y"><ref prop="endpoint1">_linesegment1</ref></extract>
  <graph>
  <linesegment>(1,2),(3,4)</linesegment>
  </graph>
  <graph>
  <ref prop="endpoint1">_linesegment1</ref>
  <ref prop="endpoint2">_linesegment1</ref>
  </graph>
  <graph>
  <ref prop="endpoints">_linesegment1</ref>
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#__math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let p1x = 1;
      let p1y = 2;
      let p2x = 3;
      let p2y = 4;
      expect(components.__point1.state.xs[0].tree).eq(p1x)
      expect(components.__point1.state.xs[1].tree).eq(p1y)
      expect(components.__point2.state.xs[0].tree).eq(p2x)
      expect(components.__point2.state.xs[1].tree).eq(p2y)
      expect(components.__point3.state.xs[0].tree).eq(p1x)
      expect(components.__point3.state.xs[1].tree).eq(p1y)
      expect(components.__point4.state.xs[0].tree).eq(p2x)
      expect(components.__point4.state.xs[1].tree).eq(p2y)
      expect(components.__point5.state.xs[0].tree).eq(p1x)
      expect(components.__point5.state.xs[1].tree).eq(p1y)
      expect(components.__point6.state.xs[0].tree).eq(p2x)
      expect(components.__point6.state.xs[1].tree).eq(p2y)
    })

    cy.log('move first individually reffed endpoint');
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let p1x = -2;
      let p1y = -5;
      components.__point3.movePoint({ x: p1x, y: p1y });
      let p2x = 3;
      let p2y = 4;
      expect(components.__point1.state.xs[0].tree).eq(p1x)
      expect(components.__point1.state.xs[1].tree).eq(p1y)
      expect(components.__point2.state.xs[0].tree).eq(p2x)
      expect(components.__point2.state.xs[1].tree).eq(p2y)
      expect(components.__point3.state.xs[0].tree).eq(p1x)
      expect(components.__point3.state.xs[1].tree).eq(p1y)
      expect(components.__point4.state.xs[0].tree).eq(p2x)
      expect(components.__point4.state.xs[1].tree).eq(p2y)
      expect(components.__point5.state.xs[0].tree).eq(p1x)
      expect(components.__point5.state.xs[1].tree).eq(p1y)
      expect(components.__point6.state.xs[0].tree).eq(p2x)
      expect(components.__point6.state.xs[1].tree).eq(p2y)
    })

    cy.log('move second individually reffed endpoint');
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let p2x = 8;
      let p2y = -1;
      components.__point4.movePoint({ x: p2x, y: p2y });
      let p1x = -2;
      let p1y = -5;
      expect(components.__point1.state.xs[0].tree).eq(p1x)
      expect(components.__point1.state.xs[1].tree).eq(p1y)
      expect(components.__point2.state.xs[0].tree).eq(p2x)
      expect(components.__point2.state.xs[1].tree).eq(p2y)
      expect(components.__point3.state.xs[0].tree).eq(p1x)
      expect(components.__point3.state.xs[1].tree).eq(p1y)
      expect(components.__point4.state.xs[0].tree).eq(p2x)
      expect(components.__point4.state.xs[1].tree).eq(p2y)
      expect(components.__point5.state.xs[0].tree).eq(p1x)
      expect(components.__point5.state.xs[1].tree).eq(p1y)
      expect(components.__point6.state.xs[0].tree).eq(p2x)
      expect(components.__point6.state.xs[1].tree).eq(p2y)
    })

    cy.log('move second array-reffed endpoint');
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let p2x = -6;
      let p2y = 4;
      components.__point6.movePoint({ x: p2x, y: p2y });
      let p1x = -2;
      let p1y = -5;
      expect(components.__point1.state.xs[0].tree).eq(p1x)
      expect(components.__point1.state.xs[1].tree).eq(p1y)
      expect(components.__point2.state.xs[0].tree).eq(p2x)
      expect(components.__point2.state.xs[1].tree).eq(p2y)
      expect(components.__point3.state.xs[0].tree).eq(p1x)
      expect(components.__point3.state.xs[1].tree).eq(p1y)
      expect(components.__point4.state.xs[0].tree).eq(p2x)
      expect(components.__point4.state.xs[1].tree).eq(p2y)
      expect(components.__point5.state.xs[0].tree).eq(p1x)
      expect(components.__point5.state.xs[1].tree).eq(p1y)
      expect(components.__point6.state.xs[0].tree).eq(p2x)
      expect(components.__point6.state.xs[1].tree).eq(p2y)
    })

    cy.log('move first array-reffed endpoint');
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let p1x = 0;
      let p1y = 7;
      components.__point5.movePoint({ x: p1x, y: p1y });
      let p2x = -6;
      let p2y = 4;
      expect(components.__point1.state.xs[0].tree).eq(p1x)
      expect(components.__point1.state.xs[1].tree).eq(p1y)
      expect(components.__point2.state.xs[0].tree).eq(p2x)
      expect(components.__point2.state.xs[1].tree).eq(p2y)
      expect(components.__point3.state.xs[0].tree).eq(p1x)
      expect(components.__point3.state.xs[1].tree).eq(p1y)
      expect(components.__point4.state.xs[0].tree).eq(p2x)
      expect(components.__point4.state.xs[1].tree).eq(p2y)
      expect(components.__point5.state.xs[0].tree).eq(p1x)
      expect(components.__point5.state.xs[1].tree).eq(p1y)
      expect(components.__point6.state.xs[0].tree).eq(p2x)
      expect(components.__point6.state.xs[1].tree).eq(p2y)
    })

    cy.log('move line segment up and to the right')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let point1coords = [
        components['/_linesegment1'].state.endpoints[0].get_component(0),
        components['/_linesegment1'].state.endpoints[0].get_component(1),
      ];
      let point2coords = [
        components['/_linesegment1'].state.endpoints[1].get_component(0),
        components['/_linesegment1'].state.endpoints[1].get_component(1),
      ];

      let moveX = 4;
      let moveY = 2;

      point1coords[0] = point1coords[0].add(moveX);
      point1coords[1] = point1coords[1].add(moveY);
      point2coords[0] = point2coords[0].add(moveX);
      point2coords[1] = point2coords[1].add(moveY);

      components['/_linesegment1'].moveLineSegment({
        point1coords: point1coords,
        point2coords: point2coords
      });

      let p1x = point1coords[0].simplify().tree;
      let p1y = point1coords[1].simplify().tree;
      let p2x = point2coords[0].simplify().tree;
      let p2y = point2coords[1].simplify().tree;

      expect(components.__point1.state.xs[0].tree).eq(p1x)
      expect(components.__point1.state.xs[1].tree).eq(p1y)
      expect(components.__point2.state.xs[0].tree).eq(p2x)
      expect(components.__point2.state.xs[1].tree).eq(p2y)
      expect(components.__point3.state.xs[0].tree).eq(p1x)
      expect(components.__point3.state.xs[1].tree).eq(p1y)
      expect(components.__point4.state.xs[0].tree).eq(p2x)
      expect(components.__point4.state.xs[1].tree).eq(p2y)
      expect(components.__point5.state.xs[0].tree).eq(p1x)
      expect(components.__point5.state.xs[1].tree).eq(p1y)
      expect(components.__point6.state.xs[0].tree).eq(p2x)
      expect(components.__point6.state.xs[1].tree).eq(p2y)

    })

  })

  it('new linesegment from reffed endpoints of line segment', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <extract prop="y"><ref prop="endpoint1">_linesegment1</ref></extract>
  <graph>
  <linesegment>(-1,-2),(-3,-4)</linesegment>
  </graph>
  <graph>
  <linesegment>
    <ref prop="endpoints">_linesegment1</ref>
  </linesegment>
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#__math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−2')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let p1x = -1;
      let p1y = -2;
      let p2x = -3;
      let p2y = -4;
      expect(components.__point1.state.xs[0].tree).eq(p1x)
      expect(components.__point1.state.xs[1].tree).eq(p1y)
      expect(components.__point2.state.xs[0].tree).eq(p2x)
      expect(components.__point2.state.xs[1].tree).eq(p2y)
      expect(components.__point3.state.xs[0].tree).eq(p1x)
      expect(components.__point3.state.xs[1].tree).eq(p1y)
      expect(components.__point4.state.xs[0].tree).eq(p2x)
      expect(components.__point4.state.xs[1].tree).eq(p2y)
      expect(components['/_linesegment1'].state.endpoints[0].tree).eqls(["tuple", p1x, p1y]);
      expect(components['/_linesegment1'].state.endpoints[1].tree).eqls(["tuple", p2x, p2y]);
      expect(components['/_linesegment2'].state.endpoints[0].tree).eqls(["tuple", p1x, p1y]);
      expect(components['/_linesegment2'].state.endpoints[1].tree).eqls(["tuple", p2x, p2y]);
    })

    cy.log('move first line segment up and to the right')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let point1coords = [
        components['/_linesegment1'].state.endpoints[0].get_component(0),
        components['/_linesegment1'].state.endpoints[0].get_component(1),
      ];
      let point2coords = [
        components['/_linesegment1'].state.endpoints[1].get_component(0),
        components['/_linesegment1'].state.endpoints[1].get_component(1),
      ];

      let moveX = 4;
      let moveY = 2;

      point1coords[0] = point1coords[0].add(moveX);
      point1coords[1] = point1coords[1].add(moveY);
      point2coords[0] = point2coords[0].add(moveX);
      point2coords[1] = point2coords[1].add(moveY);

      components['/_linesegment1'].moveLineSegment({
        point1coords: point1coords,
        point2coords: point2coords
      });

      let p1x = -1 + moveX;
      let p1y = -2 + moveY;
      let p2x = -3 + moveX;
      let p2y = -4 + moveY;

      expect(components.__point1.state.xs[0].tree).eq(p1x)
      expect(components.__point1.state.xs[1].tree).eq(p1y)
      expect(components.__point2.state.xs[0].tree).eq(p2x)
      expect(components.__point2.state.xs[1].tree).eq(p2y)
      expect(components.__point3.state.xs[0].tree).eq(p1x)
      expect(components.__point3.state.xs[1].tree).eq(p1y)
      expect(components.__point4.state.xs[0].tree).eq(p2x)
      expect(components.__point4.state.xs[1].tree).eq(p2y)
      expect(components['/_linesegment1'].state.endpoints[0].tree).eqls(["tuple", p1x, p1y]);
      expect(components['/_linesegment1'].state.endpoints[1].tree).eqls(["tuple", p2x, p2y]);
      expect(components['/_linesegment2'].state.endpoints[0].tree).eqls(["tuple", p1x, p1y]);
      expect(components['/_linesegment2'].state.endpoints[1].tree).eqls(["tuple", p2x, p2y]);

    })


    cy.log('move second line segment up and to the left')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let point1coords = [
        components['/_linesegment2'].state.endpoints[0].get_component(0),
        components['/_linesegment2'].state.endpoints[0].get_component(1),
      ];
      let point2coords = [
        components['/_linesegment2'].state.endpoints[1].get_component(0),
        components['/_linesegment2'].state.endpoints[1].get_component(1),
      ];

      let moveX = -7;
      let moveY = 3;

      point1coords[0] = point1coords[0].add(moveX);
      point1coords[1] = point1coords[1].add(moveY);
      point2coords[0] = point2coords[0].add(moveX);
      point2coords[1] = point2coords[1].add(moveY);

      components['/_linesegment2'].moveLineSegment({
        point1coords: point1coords,
        point2coords: point2coords
      });


      moveX = 4 + moveX;
      moveY = 2 + moveY;
      let p1x = -1 + moveX;
      let p1y = -2 + moveY;
      let p2x = -3 + moveX;
      let p2y = -4 + moveY;

      expect(components.__point1.state.xs[0].tree).eq(p1x)
      expect(components.__point1.state.xs[1].tree).eq(p1y)
      expect(components.__point2.state.xs[0].tree).eq(p2x)
      expect(components.__point2.state.xs[1].tree).eq(p2y)
      expect(components.__point3.state.xs[0].tree).eq(p1x)
      expect(components.__point3.state.xs[1].tree).eq(p1y)
      expect(components.__point4.state.xs[0].tree).eq(p2x)
      expect(components.__point4.state.xs[1].tree).eq(p2y)
      expect(components['/_linesegment1'].state.endpoints[0].tree).eqls(["tuple", p1x, p1y]);
      expect(components['/_linesegment1'].state.endpoints[1].tree).eqls(["tuple", p2x, p2y]);
      expect(components['/_linesegment2'].state.endpoints[0].tree).eqls(["tuple", p1x, p1y]);
      expect(components['/_linesegment2'].state.endpoints[1].tree).eqls(["tuple", p2x, p2y]);

    })

  })

  it('extracting endpoint coordinates of symmetric linesegment', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <extract prop="y"><ref prop="endpoint1">_linesegment1</ref></extract>
  <graph>
  <linesegment>
    <point>(1,2)</point>
    <point>
      (<ref prop="y">_point1</ref>, <ref prop="x">_point1</ref>)
    </point>
  </linesegment> 
  <point name="x1">
    <x><extract prop="x"><ref prop="endpoint1">_linesegment1</ref></extract></x>
    <y fixed>3</y>
  </point>
  <point name="x2">
    <x><extract prop="x"><ref prop="endpoint2">_linesegment1</ref></extract></x>
    <y fixed>4</y>
  </point>
  <point name="y1">
    <y><extract prop="y"><ref prop="endpoint1">_linesegment1</ref></extract></y>
    <x fixed>3</x>
  </point>
  <point name="y2">
    <y><extract prop="y"><ref prop="endpoint2">_linesegment1</ref></extract></y>
    <x fixed>4</x>
  </point>
</graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#__math7 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    })

    let x = 1, y = 2;

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_linesegment1'].state.endpoints[0].tree).eqls(["tuple", x, y]);
      expect(components['/_linesegment1'].state.endpoints[1].tree).eqls(["tuple", y, x]);
      expect(components['/x1'].state.xs[0].tree).eq(x);
      expect(components['/x2'].state.xs[0].tree).eq(y);
      expect(components['/y1'].state.xs[1].tree).eq(y);
      expect(components['/y2'].state.xs[1].tree).eq(x);
    })

    cy.log("move x point 1")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      x = 3;
      components['/x1'].movePoint({ x: x });
      expect(components['/_linesegment1'].state.endpoints[0].tree).eqls(["tuple", x, y]);
      expect(components['/_linesegment1'].state.endpoints[1].tree).eqls(["tuple", y, x]);
      expect(components['/x1'].state.xs[0].tree).eq(x);
      expect(components['/x2'].state.xs[0].tree).eq(y);
      expect(components['/y1'].state.xs[1].tree).eq(y);
      expect(components['/y2'].state.xs[1].tree).eq(x);
    })

    cy.log("move x point 2")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      y = 4;
      components['/x2'].movePoint({ x: y });
      expect(components['/_linesegment1'].state.endpoints[0].tree).eqls(["tuple", x, y]);
      expect(components['/_linesegment1'].state.endpoints[1].tree).eqls(["tuple", y, x]);
      expect(components['/x1'].state.xs[0].tree).eq(x);
      expect(components['/x2'].state.xs[0].tree).eq(y);
      expect(components['/y1'].state.xs[1].tree).eq(y);
      expect(components['/y2'].state.xs[1].tree).eq(x);
    })

    cy.log("move y point 1")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      y = -6;
      components['/y1'].movePoint({ y: y });
      expect(components['/_linesegment1'].state.endpoints[0].tree).eqls(["tuple", x, y]);
      expect(components['/_linesegment1'].state.endpoints[1].tree).eqls(["tuple", y, x]);
      expect(components['/x1'].state.xs[0].tree).eq(x);
      expect(components['/x2'].state.xs[0].tree).eq(y);
      expect(components['/y1'].state.xs[1].tree).eq(y);
      expect(components['/y2'].state.xs[1].tree).eq(x);
    })

    cy.log("move y point 2")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      x = -8;
      components['/y2'].movePoint({ y: x });
      expect(components['/_linesegment1'].state.endpoints[0].tree).eqls(["tuple", x, y]);
      expect(components['/_linesegment1'].state.endpoints[1].tree).eqls(["tuple", y, x]);
      expect(components['/x1'].state.xs[0].tree).eq(x);
      expect(components['/x2'].state.xs[0].tree).eq(y);
      expect(components['/y1'].state.xs[1].tree).eq(y);
      expect(components['/y2'].state.xs[1].tree).eq(x);
    })


  })

  it('three linesegments with mutual references', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <extract prop="y"><ref prop="endpoint1">_linesegment1</ref></extract>
  <graph>
  <linesegment>
    <endpoints>
    <ref prop="endpoint2">_linesegment2</ref>
    <point>(1,0)</point>
    </endpoints>
  </linesegment>
  <linesegment>
    <endpoints hide="false">
    <ref prop="endpoint2">_linesegment3</ref>
    <point>(3,2)</point>
    </endpoints>
  </linesegment>
  <linesegment>
    <endpoints hide="false">
    <ref prop="endpoint2">_linesegment1</ref>
    <point>(-1,4)</point>
    </endpoints>
  </linesegment>
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#__math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    });

    let x1 = 1, y1 = 0;
    let x2 = 3, y2 = 2;
    let x3 = -1, y3 = 4;

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_linesegment1'].state.endpoints[0].tree).eqls(["tuple", x2, y2]);
      expect(components['/_linesegment1'].state.endpoints[1].tree).eqls(["tuple", x1, y1]);
      expect(components['/_linesegment2'].state.endpoints[0].tree).eqls(["tuple", x3, y3]);
      expect(components['/_linesegment2'].state.endpoints[1].tree).eqls(["tuple", x2, y2]);
      expect(components['/_linesegment3'].state.endpoints[0].tree).eqls(["tuple", x1, y1]);
      expect(components['/_linesegment3'].state.endpoints[1].tree).eqls(["tuple", x3, y3]);

    })

    cy.log("move point 1 of line segment 1")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      x2 = 7;
      y2 = -3;
      components['/_linesegment1'].state.endpointsChild.state.points[0].movePoint({ x: x2, y: y2 });
      expect(components['/_linesegment1'].state.endpoints[0].tree).eqls(["tuple", x2, y2]);
      expect(components['/_linesegment1'].state.endpoints[1].tree).eqls(["tuple", x1, y1]);
      expect(components['/_linesegment2'].state.endpoints[0].tree).eqls(["tuple", x3, y3]);
      expect(components['/_linesegment2'].state.endpoints[1].tree).eqls(["tuple", x2, y2]);
      expect(components['/_linesegment3'].state.endpoints[0].tree).eqls(["tuple", x1, y1]);
      expect(components['/_linesegment3'].state.endpoints[1].tree).eqls(["tuple", x3, y3]);

    })

    cy.log("move point 2 of line segment 1")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      x1 = -1;
      y1 = -4;
      components['/_linesegment1'].state.endpointsChild.state.points[1].movePoint({ x: x1, y: y1 });
      expect(components['/_linesegment1'].state.endpoints[0].tree).eqls(["tuple", x2, y2]);
      expect(components['/_linesegment1'].state.endpoints[1].tree).eqls(["tuple", x1, y1]);
      expect(components['/_linesegment2'].state.endpoints[0].tree).eqls(["tuple", x3, y3]);
      expect(components['/_linesegment2'].state.endpoints[1].tree).eqls(["tuple", x2, y2]);
      expect(components['/_linesegment3'].state.endpoints[0].tree).eqls(["tuple", x1, y1]);
      expect(components['/_linesegment3'].state.endpoints[1].tree).eqls(["tuple", x3, y3]);

    })

    cy.log("move point 1 of line segment 2")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      x3 = 9;
      y3 = -8;
      components['/_linesegment2'].state.endpointsChild.state.points[0].movePoint({ x: x3, y: y3 });
      expect(components['/_linesegment1'].state.endpoints[0].tree).eqls(["tuple", x2, y2]);
      expect(components['/_linesegment1'].state.endpoints[1].tree).eqls(["tuple", x1, y1]);
      expect(components['/_linesegment2'].state.endpoints[0].tree).eqls(["tuple", x3, y3]);
      expect(components['/_linesegment2'].state.endpoints[1].tree).eqls(["tuple", x2, y2]);
      expect(components['/_linesegment3'].state.endpoints[0].tree).eqls(["tuple", x1, y1]);
      expect(components['/_linesegment3'].state.endpoints[1].tree).eqls(["tuple", x3, y3]);

    })

    cy.log("move point 2 of line segment 2")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      x2 = 3;
      y2 = 2;
      components['/_linesegment2'].state.endpointsChild.state.points[1].movePoint({ x: x2, y: y2 });
      expect(components['/_linesegment1'].state.endpoints[0].tree).eqls(["tuple", x2, y2]);
      expect(components['/_linesegment1'].state.endpoints[1].tree).eqls(["tuple", x1, y1]);
      expect(components['/_linesegment2'].state.endpoints[0].tree).eqls(["tuple", x3, y3]);
      expect(components['/_linesegment2'].state.endpoints[1].tree).eqls(["tuple", x2, y2]);
      expect(components['/_linesegment3'].state.endpoints[0].tree).eqls(["tuple", x1, y1]);
      expect(components['/_linesegment3'].state.endpoints[1].tree).eqls(["tuple", x3, y3]);

    })

    cy.log("move point 1 of line segment 3")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      x1 = -5;
      y1 = 8;
      components['/_linesegment3'].state.endpointsChild.state.points[0].movePoint({ x: x1, y: y1 });
      expect(components['/_linesegment1'].state.endpoints[0].tree).eqls(["tuple", x2, y2]);
      expect(components['/_linesegment1'].state.endpoints[1].tree).eqls(["tuple", x1, y1]);
      expect(components['/_linesegment2'].state.endpoints[0].tree).eqls(["tuple", x3, y3]);
      expect(components['/_linesegment2'].state.endpoints[1].tree).eqls(["tuple", x2, y2]);
      expect(components['/_linesegment3'].state.endpoints[0].tree).eqls(["tuple", x1, y1]);
      expect(components['/_linesegment3'].state.endpoints[1].tree).eqls(["tuple", x3, y3]);

    })

    cy.log("move point 2 of line segment 3")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      x3 = 0;
      y3 = -5;
      components['/_linesegment3'].state.endpointsChild.state.points[1].movePoint({ x: x3, y: y3 });
      expect(components['/_linesegment1'].state.endpoints[0].tree).eqls(["tuple", x2, y2]);
      expect(components['/_linesegment1'].state.endpoints[1].tree).eqls(["tuple", x1, y1]);
      expect(components['/_linesegment2'].state.endpoints[0].tree).eqls(["tuple", x3, y3]);
      expect(components['/_linesegment2'].state.endpoints[1].tree).eqls(["tuple", x2, y2]);
      expect(components['/_linesegment3'].state.endpoints[0].tree).eqls(["tuple", x1, y1]);
      expect(components['/_linesegment3'].state.endpoints[1].tree).eqls(["tuple", x3, y3]);

    })

  })

});