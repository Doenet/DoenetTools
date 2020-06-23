import me from 'math-expressions';

describe('Point Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')
  })


  it('point sugar a ref', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
      <point label="P">(5,6)</point>
      <point label="Q">(1, <ref prop="y">_point1</ref>)</point>
    </graph>
    <ref prop="x2">_point2</ref>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('move point P to (-1,-7)')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: -1, y: -7 });
      expect(components['/_point1'].stateValues.xs[0].tree).eq(-1)
      expect(components['/_point1'].stateValues.xs[1].tree).eq(-7)
      expect(components['/_point1'].stateValues.coords.tree).eqls(['vector', -1, -7])
      expect(components['/_point2'].stateValues.xs[0].tree).eq(1)
      expect(components['/_point2'].stateValues.xs[1].tree).eq(-7)
      expect(components['/_point2'].stateValues.coords.tree).eqls(['vector', 1, -7])
    })
  });

  it('coords use a ref', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point label="P">(5,6)</point>
    <point label="Q">
      <coords>(1, <ref prop="y">_point1</ref>)</coords>
    </point>
  </graph>
  <ref prop="x2">_point2</ref>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('move point P to (-1,-7)')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: -1, y: -7 });
      expect(components['/_point1'].stateValues.xs[0].tree).eq(-1)
      expect(components['/_point1'].stateValues.xs[1].tree).eq(-7)
      expect(components['/_point1'].stateValues.coords.tree).eqls(['vector', -1, -7])
      expect(components['/_point2'].stateValues.xs[0].tree).eq(1)
      expect(components['/_point2'].stateValues.xs[1].tree).eq(-7)
      expect(components['/_point2'].stateValues.coords.tree).eqls(['vector', 1, -7])


    })

    cy.log(`move point P to (4,6)`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point2'].movePoint({ x: 4, y: 6 });
      expect(components['/_point1'].stateValues.xs[0].tree).eq(-1)
      expect(components['/_point1'].stateValues.xs[1].tree).eq(6)
      expect(components['/_point1'].stateValues.coords.tree).eqls(['vector', -1, 6])
      expect(components['/_point2'].stateValues.xs[0].tree).eq(4)
      expect(components['/_point2'].stateValues.xs[1].tree).eq(6)
      expect(components['/_point2'].stateValues.coords.tree).eqls(['vector', 4, 6])

    })
  })

  it('label use a ref', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point label="P">(5,6)</point>
    <point>
      <label><ref prop="label">_point1</ref>'</label>
      (1,3)
    </point>
  </graph>
  <ref prop="x2">_point2</ref>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log(`Labels are P and P'`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_point1'].stateValues.label).eq('P')
      expect(components['/_point2'].stateValues.label).eq(`P'`)

    })

  })

  it('test invertible due to modifyIndirectly', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point>
    (0.5<math>2</math><math modifyIndirectly="false">3</math>, <math name="y">1</math>)
  </point>
  </graph>
  <ref prop="y">_point1</ref>
  `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log(`we can move point`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: 7, y: -5 });
      expect(components['/_point1'].stateValues.xs[0].tree).closeTo(7, 1E-12)
      expect(components['/_point1'].stateValues.xs[1].tree).closeTo(-5, 1E-12)
      expect(components['/_math1'].stateValues.value.evaluate_to_constant()).closeTo(7 / 1.5, 1E-12)
      expect(components['/_math2'].stateValues.value.tree).closeTo(3, 1E-12)
      expect(components['/y'].stateValues.value.tree).closeTo(-5, 1E-12)
    })

  })

  it('define 2D point from 3D point', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point>
    (<ref prop="y">source</ref>,<ref prop="z">source</ref>)
  </point>
  </graph>

  <point name="source">
    <math>(<math modifyIndirectly="false">a</math>,2,3)</math>
  </point>
  <ref prop="x">_point1</ref>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait to load

    cy.log('points are where they should be')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      expect(components['/_point1'].stateValues.xs[0].tree).closeTo(2, 1E-12)
      expect(components['/_point1'].stateValues.xs[1].tree).closeTo(3, 1E-12)
      expect(components['/source'].stateValues.xs[0].tree).eq("a")
      expect(components['/source'].stateValues.xs[1].tree).closeTo(2, 1E-12)
      expect(components['/source'].stateValues.xs[2].tree).closeTo(3, 1E-12)
    })

    cy.log('move point 1')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: -4, y: -7 });
      expect(components['/_point1'].stateValues.xs[0].tree).closeTo(-4, 1E-12)
      expect(components['/_point1'].stateValues.xs[1].tree).closeTo(-7, 1E-12)
      expect(components['/source'].stateValues.xs[0].tree).eq("a")
      expect(components['/source'].stateValues.xs[1].tree).closeTo(-4, 1E-12)
      expect(components['/source'].stateValues.xs[2].tree).closeTo(-7, 1E-12)
    })
  })

  it('define 2D point from 3D point, reffing xj', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point>
    (<ref prop="x2">source</ref>,<ref prop="x3">source</ref>)
  </point>
  </graph>

  <point name="source">
    <math>(<math modifyIndirectly="false">a</math>,2,3)</math>
  </point>
  <ref prop="x">_point1</ref>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait to load

    cy.log('points are where they should be')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      expect(components['/_point1'].stateValues.xs[0].tree).closeTo(2, 1E-12)
      expect(components['/_point1'].stateValues.xs[1].tree).closeTo(3, 1E-12)
      expect(components['/source'].stateValues.xs[0].tree).eq("a")
      expect(components['/source'].stateValues.xs[1].tree).closeTo(2, 1E-12)
      expect(components['/source'].stateValues.xs[2].tree).closeTo(3, 1E-12)
    })

    cy.log('move point 1')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: -4, y: -7 });
      expect(components['/_point1'].stateValues.xs[0].tree).closeTo(-4, 1E-12)
      expect(components['/_point1'].stateValues.xs[1].tree).closeTo(-7, 1E-12)
      expect(components['/source'].stateValues.xs[0].tree).eq("a")
      expect(components['/source'].stateValues.xs[1].tree).closeTo(-4, 1E-12)
      expect(components['/source'].stateValues.xs[2].tree).closeTo(-7, 1E-12)
    })
  })

  it('define 2D point from 3D point, separate coordinates', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point>
    <x><ref prop="y">source</ref></x>
    <y><ref prop="z">source</ref></y>
  </point>
  </graph>

  <point name="source">
    <x modifyIndirectly="false">a</x>
    <y>2</y>
    <z>3</z>
  </point>
  <ref prop="x">_point1</ref>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait to load

    cy.log('points are where they should be')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      expect(components['/_point1'].stateValues.xs[0].tree).closeTo(2, 1E-12)
      expect(components['/_point1'].stateValues.xs[1].tree).closeTo(3, 1E-12)
      expect(components['/source'].stateValues.xs[0].tree).eq("a")
      expect(components['/source'].stateValues.xs[1].tree).closeTo(2, 1E-12)
      expect(components['/source'].stateValues.xs[2].tree).closeTo(3, 1E-12)
    })

    cy.log('move point 1')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: -4, y: -7 });
      expect(components['/_point1'].stateValues.xs[0].tree).closeTo(-4, 1E-12)
      expect(components['/_point1'].stateValues.xs[1].tree).closeTo(-7, 1E-12)
      expect(components['/source'].stateValues.xs[0].tree).eq("a")
      expect(components['/source'].stateValues.xs[1].tree).closeTo(-4, 1E-12)
      expect(components['/source'].stateValues.xs[2].tree).closeTo(-7, 1E-12)
    })
  })

  it('define 2D point from double-reffed 3D point, separate coordinates', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point>
    <x><ref prop="y">source3</ref></x>
    <y><ref prop="z">source3</ref></y>
  </point>
  </graph>

  <ref name="source2">source</ref>
  <point name="source">
    <x modifyIndirectly="false">a</x>
    <y>2</y>
    <z>3</z>
  </point>
  <ref name="source3">source2</ref>
  <ref prop="x">_point1</ref>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait to load

    cy.log('points are where they should be')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      expect(components['/_point1'].stateValues.xs[0].tree).closeTo(2, 1E-12)
      expect(components['/_point1'].stateValues.xs[1].tree).closeTo(3, 1E-12)
      expect(components['/source'].stateValues.xs[0].tree).eq("a")
      expect(components['/source'].stateValues.xs[1].tree).closeTo(2, 1E-12)
      expect(components['/source'].stateValues.xs[2].tree).closeTo(3, 1E-12)
    })

    cy.log('move point 1')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: -4, y: -7 });
      expect(components['/_point1'].stateValues.xs[0].tree).closeTo(-4, 1E-12)
      expect(components['/_point1'].stateValues.xs[1].tree).closeTo(-7, 1E-12)
      expect(components['/source'].stateValues.xs[0].tree).eq("a")
      expect(components['/source'].stateValues.xs[1].tree).closeTo(-4, 1E-12)
      expect(components['/source'].stateValues.xs[2].tree).closeTo(-7, 1E-12)
    })
  })

  it('point on graph that is refed in two ways', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point>(1,2)
  </point>
  </graph>
  <ref>_graph1</ref>
  <graph>
  <ref name="p3">_point1</ref>
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let point2 = components['/_ref1'].replacements[0].activeChildren[0];
      let point3 = components['/p3'].replacements[0];


      cy.window().then((win) => {
        expect(components['/_point1'].stateValues.xs[0].tree).eq(1)
        expect(components['/_point1'].stateValues.xs[1].tree).eq(2)
        expect(point2.stateValues.xs[0].tree).eq(1)
        expect(point2.stateValues.xs[1].tree).eq(2)
        expect(point3.stateValues.xs[0].tree).eq(1)
        expect(point3.stateValues.xs[1].tree).eq(2)

      })

      cy.log(`move point1 to (4,6)`)
      cy.window().then((win) => {
        components['/_point1'].movePoint({ x: 4, y: 6 });
        expect(components['/_point1'].stateValues.xs[0].tree).eq(4)
        expect(components['/_point1'].stateValues.xs[1].tree).eq(6)
        expect(point2.stateValues.xs[0].tree).eq(4)
        expect(point2.stateValues.xs[1].tree).eq(6)
        expect(point3.stateValues.xs[0].tree).eq(4)
        expect(point3.stateValues.xs[1].tree).eq(6)
      })

      cy.log(`move point2 to (-3,-7)`)
      cy.window().then((win) => {
        point2.movePoint({ x: -3, y: -7 });
        expect(components['/_point1'].stateValues.xs[0].tree).eq(-3)
        expect(components['/_point1'].stateValues.xs[1].tree).eq(-7)
        expect(point2.stateValues.xs[0].tree).eq(-3)
        expect(point2.stateValues.xs[1].tree).eq(-7)
        expect(point3.stateValues.xs[0].tree).eq(-3)
        expect(point3.stateValues.xs[1].tree).eq(-7)
      })

      cy.log(`move point3 to (9,-2)`)
      cy.window().then((win) => {
        point3.movePoint({ x: 9, y: -2 });
        expect(components['/_point1'].stateValues.xs[0].tree).eq(9)
        expect(components['/_point1'].stateValues.xs[1].tree).eq(-2)
        expect(point2.stateValues.xs[0].tree).eq(9)
        expect(point2.stateValues.xs[1].tree).eq(-2)
        expect(point3.stateValues.xs[0].tree).eq(9)
        expect(point3.stateValues.xs[1].tree).eq(-2)
      })

    })
  });

  it('point draggable but constrained to x = y^2/10', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point>
    (<ref>y</ref>^2/10, <math name="y">1</math>)
  </point>
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_point1'].stateValues.xs[0].tree).eqls(['/', 1, 10]);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(1)

    })

    cy.log(`move point1 to (-9,6)`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: -9, y: 6 });
      expect(components['/_point1'].stateValues.xs[0].tree).eqls(['/', 18, 5])
      expect(components['/_point1'].stateValues.xs[1].tree).eq(6)
    })

    cy.log(`move point1 to (0,-3)`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: 9, y: -3 });
      expect(components['/_point1'].stateValues.xs[0].tree).eqls(['/', 9, 10])
      expect(components['/_point1'].stateValues.xs[1].tree).eq(-3)
    })


  });

  it('point draggable but constrained to y = sin(x)', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point>
    (<math name="x">1</math>, sin(<ref>x</ref>))
  </point>
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_point1'].stateValues.xs[0].tree).eq(1);
      expect(components['/_point1'].stateValues.xs[1].tree).eqls(['apply', 'sin', 1]);

    })

    cy.log(`move point1 to (-9,6)`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: -9, y: 6 });
      expect(components['/_point1'].stateValues.xs[0].tree).eq(-9)
      expect(components['/_point1'].stateValues.xs[1].tree).eqls(['apply', 'sin', -9]);
    })

    cy.log(`move point1 to (9,-3)`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: 9, y: -3 });
      expect(components['/_point1'].stateValues.xs[0].tree).eq(9)
      expect(components['/_point1'].stateValues.xs[1].tree).eqls(['apply', 'sin', 9])
    })


  });

  it('point reflected across line', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point>(1,2)</point>
  <point>
    (<ref prop="y">_point1</ref>, <ref prop="x">_point1</ref>)
  </point>
  <line draggable="false">x=y</line>
  </graph>
  <ref prop="x">_point2</ref>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_point1'].stateValues.xs[0].tree).eq(1);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(2);
      expect(components['/_point2'].stateValues.xs[0].tree).eq(2);
      expect(components['/_point2'].stateValues.xs[1].tree).eq(1);

    })

    cy.log(`move point1 to (-9,6)`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: -9, y: 6 });
      expect(components['/_point1'].stateValues.xs[0].tree).eq(-9)
      expect(components['/_point1'].stateValues.xs[1].tree).eq(6);
      expect(components['/_point2'].stateValues.xs[0].tree).eq(6)
      expect(components['/_point2'].stateValues.xs[1].tree).eq(-9);
    })

    cy.log(`move point2 to (0,-3)`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point2'].movePoint({ x: 0, y: -3 });
      expect(components['/_point1'].stateValues.xs[0].tree).eq(-3)
      expect(components['/_point1'].stateValues.xs[1].tree).eq(0)
      expect(components['/_point2'].stateValues.xs[0].tree).eq(0)
      expect(components['/_point2'].stateValues.xs[1].tree).eq(-3)
    })

  });

  it('point not draggable', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point draggable="false">(1,2)</point>
  </graph>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_point1'].stateValues.xs[0].tree).eq(1);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(2);
    })

    cy.log(`move point1 to (-9,6)`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: -9, y: 6 });
      expect(components['/_point1'].stateValues.xs[0].tree).eq(1);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(2);
    })

  });

  it('point on line', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point>
    (<ref>d</ref>,3-<ref>d</ref>)
  </point>
  </graph>
  <math name="d">5</math>
  <ref prop="x">_point1</ref>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_point1'].stateValues.xs[0].tree).eq(5);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(-2);
    })

    cy.log(`move point1 to (8,8)`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: 8, y: 8 });
      expect(components['/_point1'].stateValues.xs[0].tree).eq(8);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(-5);
    })

  });

  it('points draggable even with complicated dependence', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>q</text>
  <graph>

  <point>
  (<ref prop="y">_point2</ref>,
  <ref>a</ref>)
  </point>
  <point>(5,3)</point>

  </graph>

  <math name="a"><ref prop="x">_point2</ref>+1</math>
  `}, "*");
    });

    cy.get('#\\/_text1').should("have.text", 'q');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_point2'].stateValues.xs[0].tree).eq(5);
      expect(components['/_point2'].stateValues.xs[1].tree).eq(3);
      expect(components['/_point1'].stateValues.xs[0].tree).eq(3);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(6);
    })

    cy.log(`move point1 to (-4,-8)`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point2'].movePoint({ x: -4, y: -8 });
      expect(components['/_point2'].stateValues.xs[0].tree).eq(-4);
      expect(components['/_point2'].stateValues.xs[1].tree).eq(-8);
      expect(components['/_point1'].stateValues.xs[0].tree).eq(-8);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(-3);
    })

    cy.log(`move point2 to (-9,10)`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: -9, y: 10 });
      expect(components['/_point2'].stateValues.xs[0].tree).eq(9);
      expect(components['/_point2'].stateValues.xs[1].tree).eq(-9);
      expect(components['/_point1'].stateValues.xs[0].tree).eq(-9);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(10);
    })

  });

  // The behavior of this test varies widely depending on update order
  // When finalize exactly how we want the updates to occur, could resurrect this
  it.skip('points related through intermediate math', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point>
  (<ref>a</ref>,
  <ref prop="x">_point2</ref>)
  </point>
  <point>(<ref>d</ref>,3-<ref>d</ref>)</point>
  </graph>

  <math name="a" simplify modifyIndirectly="true"><ref>b</ref>+1</math>,
  <math name="b" simplify modifyIndirectly="true"><ref prop="y">_point2</ref><ref>c</ref></math>,
  <math name="c" simplify modifyIndirectly="false"><ref prop="x">_point2</ref><ref>d</ref>*0.01</math>,
  <math name="d" simplify modifyIndirectly="true">5</math>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')
    cy.get('#\\/d .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('5')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let d = 5;
      let point2x = d;
      let point2y = 3 - d;
      let c = point2x * d * 0.01;
      let b = point2y * c;
      let a = b + 1;
      let point1x = a;
      let point1y = point2x;

      expect(components['/_point1'].stateValues.xs[0].tree).closeTo(point1x, 1E-12);
      expect(components['/_point1'].stateValues.xs[1].tree).closeTo(point1y, 1E-12);
      expect(components['/_point2'].stateValues.xs[0].tree).closeTo(point2x, 1E-12);
      expect(components['/_point2'].stateValues.xs[1].tree).closeTo(point2y, 1E-12);
      expect(components['/d'].stateValues.value.tree).closeTo(d, 1E-12);
      expect(components['/c'].stateValues.value.tree).closeTo(c, 1E-12);
      expect(components['/b'].stateValues.value.tree).closeTo(b, 1E-12);
      expect(components['/a'].stateValues.value.tree).closeTo(a, 1E-12);

    })

    cy.log(`move point2 along constained line`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let d = -6;
      let point2x = d;
      let point2y = 3 - d;
      let c = point2x * d * 0.01;
      let b = point2y * c;
      let a = b + 1;
      let point1x = a;
      let point1y = point2x;

      components['/_point2'].movePoint({ x: point2x, y: point2y });
      expect(components['/_point1'].stateValues.xs[0].tree).closeTo(point1x, 1E-12);
      expect(components['/_point1'].stateValues.xs[1].tree).closeTo(point1y, 1E-12);
      expect(components['/_point2'].stateValues.xs[0].tree).closeTo(point2x, 1E-12);
      expect(components['/_point2'].stateValues.xs[1].tree).closeTo(point2y, 1E-12);
      expect(components['/d'].stateValues.value.tree).closeTo(d, 1E-12);
      expect(components['/c'].stateValues.value.tree).closeTo(c, 1E-12);
      expect(components['/b'].stateValues.value.tree).closeTo(b, 1E-12);
      expect(components['/a'].stateValues.value.tree).closeTo(a, 1E-12);
    })

    cy.log(`move point1 along constained curve`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let d = 7;
      let point2x = d;
      let point2y = 3 - d;
      let c = point2x * d * 0.01;
      let b = point2y * c;
      let a = b + 1;
      let point1x = a;
      let point1y = point2x;

      components['/_point1'].movePoint({ x: point1x, y: point1y });
      expect(components['/_point1'].stateValues.xs[0].tree).closeTo(point1x, 1E-12);
      expect(components['/_point1'].stateValues.xs[1].tree).closeTo(point1y, 1E-12);
      expect(components['/_point2'].stateValues.xs[0].tree).closeTo(point2x, 1E-12);
      expect(components['/_point2'].stateValues.xs[1].tree).closeTo(point2y, 1E-12);
      expect(components['/d'].stateValues.value.tree).closeTo(d, 1E-12);
      expect(components['/c'].stateValues.value.tree).closeTo(c, 1E-12);
      expect(components['/b'].stateValues.value.tree).closeTo(b, 1E-12);
      expect(components['/a'].stateValues.value.tree).closeTo(a, 1E-12);
    })

    cy.log(`move point2 to upper right`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      components['/_point2'].movePoint({ x: 9, y: 9 });

      let d = 9;
      let point2x = d;
      let point2y = 3 - d;
      let c = point2x * d * 0.01;
      let b = point2y * c;
      let a = b + 1;
      let point1x = a;
      let point1y = point2x;

      expect(components['/_point1'].stateValues.xs[0].tree).closeTo(point1x, 1E-12);
      expect(components['/_point1'].stateValues.xs[1].tree).closeTo(point1y, 1E-12);
      expect(components['/_point2'].stateValues.xs[0].tree).closeTo(point2x, 1E-12);
      expect(components['/_point2'].stateValues.xs[1].tree).closeTo(point2y, 1E-12);
      expect(components['/d'].stateValues.value.tree).closeTo(d, 1E-12);
      expect(components['/c'].stateValues.value.tree).closeTo(c, 1E-12);
      expect(components['/b'].stateValues.value.tree).closeTo(b, 1E-12);
      expect(components['/a'].stateValues.value.tree).closeTo(a, 1E-12);
    })

    cy.log(`move point1 to upper left`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      components['/_point1'].movePoint({ x: -6, y: 4 });

      let d = 4;
      let point2x = d;
      let point2y = 3 - d;
      let c = point2x * d * 0.01;
      let b = point2y * c;
      let a = b + 1;
      let point1x = a;
      let point1y = point2x;

      expect(components['/_point1'].stateValues.xs[0].tree).closeTo(point1x, 1E-12);
      expect(components['/_point1'].stateValues.xs[1].tree).closeTo(point1y, 1E-12);
      expect(components['/_point2'].stateValues.xs[0].tree).closeTo(point2x, 1E-12);
      expect(components['/_point2'].stateValues.xs[1].tree).closeTo(point2y, 1E-12);
      expect(components['/d'].stateValues.value.tree).closeTo(d, 1E-12);
      expect(components['/c'].stateValues.value.tree).closeTo(c, 1E-12);
      expect(components['/b'].stateValues.value.tree).closeTo(b, 1E-12);
      expect(components['/a'].stateValues.value.tree).closeTo(a, 1E-12);
    })

  });

  it('no dependence on downstream update order', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point>
    (<ref prop="y">_point2</ref>, 3)
  </point>
  <point>
    (<ref>a</ref>,<ref>a</ref>)
  </point>
  </graph>

  <number name="a">2</number>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait to load

    cy.log(`point 2 is moveable, based on x component`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point2'].movePoint({ x: -3, y: -7 })

      expect(components['/_point1'].stateValues.xs[0].tree).closeTo(-3, 1E-12);
      expect(components['/_point1'].stateValues.xs[1].tree).closeTo(3, 1E-12);
      expect(components['/_point2'].stateValues.xs[0].tree).closeTo(-3, 1E-12);
      expect(components['/_point2'].stateValues.xs[1].tree).closeTo(-3, 1E-12);
      expect(components['/a'].stateValues.value).closeTo(-3, 1E-12);

      // test zero as had a bug affect case when zero
      components['/_point2'].movePoint({ x: 0, y: 5 })

      expect(components['/_point1'].stateValues.xs[0].tree).closeTo(0, 1E-12);
      expect(components['/_point1'].stateValues.xs[1].tree).closeTo(3, 1E-12);
      expect(components['/_point2'].stateValues.xs[0].tree).closeTo(0, 1E-12);
      expect(components['/_point2'].stateValues.xs[1].tree).closeTo(0, 1E-12);
      expect(components['/a'].stateValues.value).closeTo(0, 1E-12);

    })

    cy.log(`point1 is free to move`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      components['/_point1'].movePoint({ x: 9, y: -6 })

      expect(components['/_point1'].stateValues.xs[0].tree).closeTo(9, 1E-12);
      expect(components['/_point1'].stateValues.xs[1].tree).closeTo(-6, 1E-12);
      expect(components['/_point2'].stateValues.xs[0].tree).closeTo(9, 1E-12);
      expect(components['/_point2'].stateValues.xs[1].tree).closeTo(9, 1E-12);
      expect(components['/a'].stateValues.value).closeTo(9, 1E-12);

      // move to zero to make sure are testing the bug that occured at zero
      components['/_point1'].movePoint({ x: 0, y: 0 })

      expect(components['/_point1'].stateValues.xs[0].tree).closeTo(0, 1E-12);
      expect(components['/_point1'].stateValues.xs[1].tree).closeTo(0, 1E-12);
      expect(components['/_point2'].stateValues.xs[0].tree).closeTo(0, 1E-12);
      expect(components['/_point2'].stateValues.xs[1].tree).closeTo(0, 1E-12);
      expect(components['/a'].stateValues.value).closeTo(0, 1E-12);

    })
    cy.visit('/test')

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>b</text>
  <graph>
  <point>
    (<ref prop="x">_point2</ref>, 3)
  </point>
  <point>
    (<ref>a</ref>,<ref>a</ref>)
  </point>
  </graph>

  <number name="a">3</number>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'b');  // to wait to load

    cy.log(`point 2 is moveable, based on x component`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point2'].movePoint({ x: -3, y: -7 })

      expect(components['/_point1'].stateValues.xs[0].tree).closeTo(-3, 1E-12);
      expect(components['/_point1'].stateValues.xs[1].tree).closeTo(3, 1E-12);
      expect(components['/_point2'].stateValues.xs[0].tree).closeTo(-3, 1E-12);
      expect(components['/_point2'].stateValues.xs[1].tree).closeTo(-3, 1E-12);
      expect(components['/a'].stateValues.value).closeTo(-3, 1E-12);

      // test zero as had a bug affect case when zero
      components['/_point2'].movePoint({ x: 0, y: 5 })

      expect(components['/_point1'].stateValues.xs[0].tree).closeTo(0, 1E-12);
      expect(components['/_point1'].stateValues.xs[1].tree).closeTo(3, 1E-12);
      expect(components['/_point2'].stateValues.xs[0].tree).closeTo(0, 1E-12);
      expect(components['/_point2'].stateValues.xs[1].tree).closeTo(0, 1E-12);
      expect(components['/a'].stateValues.value).closeTo(0, 1E-12);

    })

    cy.log(`point1 is free to move`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      components['/_point1'].movePoint({ x: 9, y: -6 })

      expect(components['/_point1'].stateValues.xs[0].tree).closeTo(9, 1E-12);
      expect(components['/_point1'].stateValues.xs[1].tree).closeTo(-6, 1E-12);
      expect(components['/_point2'].stateValues.xs[0].tree).closeTo(9, 1E-12);
      expect(components['/_point2'].stateValues.xs[1].tree).closeTo(9, 1E-12);
      expect(components['/a'].stateValues.value).closeTo(9, 1E-12);

      // move to zero to make sure are testing the bug that occured at zero
      components['/_point1'].movePoint({ x: 0, y: 0 })

      expect(components['/_point1'].stateValues.xs[0].tree).closeTo(0, 1E-12);
      expect(components['/_point1'].stateValues.xs[1].tree).closeTo(0, 1E-12);
      expect(components['/_point2'].stateValues.xs[0].tree).closeTo(0, 1E-12);
      expect(components['/_point2'].stateValues.xs[1].tree).closeTo(0, 1E-12);
      expect(components['/a'].stateValues.value).closeTo(0, 1E-12);

    })

  });

  it('point constrained to grid', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>

  <point>
  <constrainToGrid/>
  (1,2)
  </point>

  </graph>
  <math><ref prop="coords">_point1</ref></math>
  <boolean><ref prop="constraintUsed">_point1</ref></boolean>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    cy.log(`move point to (1.2,3.6)`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: 1.2, y: 3.6 });
      expect(components['/_point1'].stateValues.xs[0].tree).eq(1);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(4);
      expect(components['/_point1'].stateValues.coords.tree).eqls(["vector", 1, 4]);
      expect(components['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,4)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")

    cy.log(`move point to (-9.8,-7.4)`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: -9.8, y: -7.4 });
      expect(components['/_point1'].stateValues.xs[0].tree).eq(-10);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(-7);
      expect(components['/_point1'].stateValues.coords.tree).eqls(["vector", -10, -7]);
      expect(components['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−10,−7)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")
  });

  it('point constrained to two contradictory grids', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>

  <point>
  <constrainToGrid dx="2" dy="2"/>
  <constrainToGrid dx="2" dy="2" xoffset="1" yoffset="1" />
  (1,3.1)
  </point>

  </graph>
  <math><ref prop="coords">_point1</ref></math>
  <boolean><ref prop="constraintUsed">_point1</ref></boolean>

  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    cy.log("second constraint wins, but first constraint affects result")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_point1'].stateValues.xs[0].tree).eq(3);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(5);
      expect(components['/_point1'].stateValues.coords.tree).eqls(["vector", 3, 5]);
      expect(components['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,5)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")

    cy.log(`Unexpected results when moving since constraints applied twice`)
    // Note: the behavior isn't necessarily desired, but it is a consequence
    // of applying the constraints in the inverse direction, and then
    // again in the normal direction.
    // If one can find a way to avoid this strange behavior, we can change this test

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: 3, y: 2.9 });
      expect(components['/_point1'].stateValues.xs[0].tree).eq(7);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(5);
      expect(components['/_point1'].stateValues.coords.tree).eqls(["vector", 7, 5]);
      expect(components['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(7,5)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")
  });

  it('three points with one constrained to grid', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point name="original">(1,2)</point>
    <point name="constrained">
      <constrainToGrid/>
        (<ref prop="x">original</ref>+1,
          <ref prop="y">original</ref>+1)
    </point>
    <point name="follower">
        (<ref prop="x">constrained</ref>+1,
          <ref prop="y">constrained</ref>+1)
    </point>
  </graph>
  <math><ref prop="coords">original</ref></math>
  <math><ref prop="coords">constrained</ref></math>
  <math><ref prop="coords">follower</ref></math>
  <boolean><ref prop="constraintUsed">original</ref></boolean>
  <boolean><ref prop="constraintUsed">constrained</ref></boolean>
  <boolean><ref prop="constraintUsed">follower</ref></boolean>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    cy.log(`move point1 to (1.2,3.6)`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/original'].movePoint({ x: 1.2, y: 3.6 });
      expect(components['/original'].stateValues.xs[0].tree).eq(1.2);
      expect(components['/original'].stateValues.xs[1].tree).eq(3.6);
      expect(components['/original'].stateValues.coords.tree).eqls(["vector", 1.2, 3.6]);
      expect(components['/original'].stateValues.constraintUsed).eq(false);
      expect(components['/constrained'].stateValues.xs[0].tree).eq(2);
      expect(components['/constrained'].stateValues.xs[1].tree).eq(5);
      expect(components['/constrained'].stateValues.coords.tree).eqls(["vector", 2, 5]);
      expect(components['/constrained'].stateValues.constraintUsed).eq(true);
      expect(components['/follower'].stateValues.xs[0].tree).eq(3);
      expect(components['/follower'].stateValues.xs[1].tree).eq(6);
      expect(components['/follower'].stateValues.coords.tree).eqls(["vector", 3, 6]);
      expect(components['/follower'].stateValues.constraintUsed).eq(false);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1.2,3.6)')
    });
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(2,5)')
    });
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,6)')
    });

    cy.get('#\\/_boolean1').should('have.text', 'false')
    cy.get('#\\/_boolean2').should('have.text', 'true')
    cy.get('#\\/_boolean3').should('have.text', 'false')

    cy.log(`move point2 to (-3.4,6.7)`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/constrained'].movePoint({ x: -3.4, y: 6.7 });
      expect(components['/original'].stateValues.xs[0].tree).eq(-4);
      expect(components['/original'].stateValues.xs[1].tree).eq(6);
      expect(components['/original'].stateValues.coords.tree).eqls(["vector", -4, 6]);
      expect(components['/original'].stateValues.constraintUsed).eq(false);
      expect(components['/constrained'].stateValues.xs[0].tree).eq(-3);
      expect(components['/constrained'].stateValues.xs[1].tree).eq(7);
      expect(components['/constrained'].stateValues.coords.tree).eqls(["vector", -3, 7]);
      expect(components['/constrained'].stateValues.constraintUsed).eq(true);
      expect(components['/follower'].stateValues.xs[0].tree).eq(-2);
      expect(components['/follower'].stateValues.xs[1].tree).eq(8);
      expect(components['/follower'].stateValues.coords.tree).eqls(["vector", -2, 8]);
      expect(components['/follower'].stateValues.constraintUsed).eq(false);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−4,6)')
    });
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−3,7)')
    });
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−2,8)')
    });
    cy.get('#\\/_boolean1').should('have.text', 'false')
    cy.get('#\\/_boolean2').should('have.text', 'true')
    cy.get('#\\/_boolean3').should('have.text', 'false')

    cy.log(`move point3 to (5.3, -2.2)`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/follower'].movePoint({ x: 5.3, y: -2.2 });
      expect(components['/original'].stateValues.xs[0].tree).eq(3);
      expect(components['/original'].stateValues.xs[1].tree).eq(-4);
      expect(components['/original'].stateValues.coords.tree).eqls(["vector", 3, -4]);
      expect(components['/original'].stateValues.constraintUsed).eq(false);
      expect(components['/constrained'].stateValues.xs[0].tree).eq(4);
      expect(components['/constrained'].stateValues.xs[1].tree).eq(-3);
      expect(components['/constrained'].stateValues.coords.tree).eqls(["vector", 4, -3]);
      expect(components['/constrained'].stateValues.constraintUsed).eq(true);
      expect(components['/follower'].stateValues.xs[0].tree).eq(5);
      expect(components['/follower'].stateValues.xs[1].tree).eq(-2);
      expect(components['/follower'].stateValues.coords.tree).eqls(["vector", 5, -2]);
      expect(components['/follower'].stateValues.constraintUsed).eq(false);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,−4)')
    });
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(4,−3)')
    });
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(5,−2)')
    });
    cy.get('#\\/_boolean1').should('have.text', 'false')
    cy.get('#\\/_boolean2').should('have.text', 'true')
    cy.get('#\\/_boolean3').should('have.text', 'false')

  });

  it('points constrained to grid with parameters', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <mathinput name="dx"/>
  <mathinput name="dy"/>
  <mathinput name="xoffset"/>
  <mathinput name="yoffset"/>

  <graph>
    <point name="original">(1.2,3.6)</point>
    <point name="constrained">
    <constrainToGrid>
      <dx><ref prop="value">dx</ref></dx>
      <dy><ref prop="value">dy</ref></dy>
      <xoffset><ref prop="value">xoffset</ref></xoffset>
      <yoffset><ref prop="value">yoffset</ref></yoffset>
    </constrainToGrid>
        (<ref prop="x">original</ref>+1,
          <ref prop="y">original</ref>+1)
    </point>
    <point name="follower">
        (<ref prop="x">constrained</ref>+1,
          <ref prop="y">constrained</ref>+1)
    </point>
  </graph>
  <math><ref prop="coords">original</ref></math>
  <math><ref prop="coords">constrained</ref></math>
  <math><ref prop="coords">follower</ref></math>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    cy.log(`no constraints with blanks`)
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1.2,3.6)')
    });
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(2.2,4.6)')
    });
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3.2,5.6)')
    }); cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/original'].stateValues.xs[0].tree).eq(1.2);
      expect(components['/original'].stateValues.xs[1].tree).eq(3.6);
      expect(components['/original'].stateValues.coords.tree).eqls(["vector", 1.2, 3.6]);
      expect(components['/constrained'].stateValues.xs[0].tree).eq(2.2);
      expect(components['/constrained'].stateValues.xs[1].tree).eq(4.6);
      expect(components['/constrained'].stateValues.coords.tree).eqls(["vector", 2.2, 4.6]);
      expect(components['/follower'].stateValues.xs[0].tree).eq(3.2);
      expect(components['/follower'].stateValues.xs[1].tree).eq(5.6);
      expect(components['/follower'].stateValues.coords.tree).eqls(["vector", 3.2, 5.6]);
    })


    cy.log(`constrain x and y to integers`);
    cy.get('#\\/dx_input').clear().type('1');
    cy.get('#\\/dy_input').clear().type('1');
    cy.get('#\\/xoffset_input').clear().type('0');
    cy.get('#\\/yoffset_input').clear().type('0').blur();
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/original'].stateValues.xs[0].tree).eq(1.2);
      expect(components['/original'].stateValues.xs[1].tree).eq(3.6);
      expect(components['/original'].stateValues.coords.tree).eqls(["vector", 1.2, 3.6]);
      expect(components['/constrained'].stateValues.xs[0].tree).eq(2);
      expect(components['/constrained'].stateValues.xs[1].tree).eq(5);
      expect(components['/constrained'].stateValues.coords.tree).eqls(["vector", 2, 5]);
      expect(components['/follower'].stateValues.xs[0].tree).eq(3);
      expect(components['/follower'].stateValues.xs[1].tree).eq(6);
      expect(components['/follower'].stateValues.coords.tree).eqls(["vector", 3, 6]);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1.2,3.6)')
    });
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(2,5)')
    });
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,6)')
    });

    cy.log(`move point2 to (5.3, -2.2)`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/constrained'].movePoint({ x: 5.3, y: -2.2 });
      expect(components['/original'].stateValues.xs[0].tree).eq(4);
      expect(components['/original'].stateValues.xs[1].tree).eq(-3);
      expect(components['/original'].stateValues.coords.tree).eqls(["vector", 4, -3]);
      expect(components['/constrained'].stateValues.xs[0].tree).eq(5);
      expect(components['/constrained'].stateValues.xs[1].tree).eq(-2);
      expect(components['/constrained'].stateValues.coords.tree).eqls(["vector", 5, -2]);
      expect(components['/follower'].stateValues.xs[0].tree).eq(6);
      expect(components['/follower'].stateValues.xs[1].tree).eq(-1);
      expect(components['/follower'].stateValues.coords.tree).eqls(["vector", 6, -1]);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(4,−3)')
    });
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(5,−2)')
    });
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(6,−1)')
    });


    cy.log(`change constraints`);
    cy.get('#\\/dx_input').clear().type('3');
    cy.get('#\\/dy_input').clear().type('0.5');
    cy.get('#\\/xoffset_input').clear().type('1');
    cy.get('#\\/yoffset_input').clear().type('0.1').blur();
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/original'].stateValues.xs[0].tree).eq(4);
      expect(components['/original'].stateValues.xs[1].tree).eq(-3);
      expect(components['/original'].stateValues.coords.tree).eqls(["vector", 4, -3]);
      expect(components['/constrained'].stateValues.xs[0].tree).eq(4);
      expect(components['/constrained'].stateValues.xs[1].tree).eq(-1.9);
      expect(components['/constrained'].stateValues.coords.tree).eqls(["vector", 4, -1.9]);
      expect(components['/follower'].stateValues.xs[0].tree).eq(5);
      expect(components['/follower'].stateValues.xs[1].tree).to.be.approximately(-0.9, 1E-10);
      expect(components['/follower'].stateValues.coords.tree.slice(0, 2)).eqls(["vector", 5]);
      expect(components['/follower'].stateValues.coords.tree[2]).to.be.approximately(-0.9, 1E-10);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(4,−3)')
    });
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(4,−1.9)')
    });
    // cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
    //   expect(text.trim()).equal('(5,−0.9)')
    // });

    cy.log(`move point to (-2.2, -8.6)`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/constrained'].movePoint({ x: -0.6, y: -8.6 });
      expect(components['/original'].stateValues.xs[0].tree).eq(-3);
      expect(components['/original'].stateValues.xs[1].tree).eq(-9.4);
      expect(components['/original'].stateValues.coords.tree).eqls(["vector", -3, -9.4]);
      expect(components['/constrained'].stateValues.xs[0].tree).eq(-2);
      expect(components['/constrained'].stateValues.xs[1].tree).eq(-8.4);
      expect(components['/constrained'].stateValues.coords.tree).eqls(["vector", -2, -8.4]);
      expect(components['/follower'].stateValues.xs[0].tree).eq(-1);
      expect(components['/follower'].stateValues.xs[1].tree).eq(-7.4);
      expect(components['/follower'].stateValues.coords.tree).eqls(["vector", -1, -7.4]);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−3,−9.4)')
    });
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−2,−8.4)')
    });
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−1,−7.4)')
    });

  });

  it('point attracted to grid', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>

  <point>
  <attractToGrid/>
  (-7.1,8.9)
  </point>

  </graph>
  <math><ref prop="coords">_point1</ref></math>
  <boolean><ref prop="constraintUsed">_point1</ref></boolean>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_point1'].stateValues.xs[0].tree).eq(-7);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(9);
      expect(components['/_point1'].stateValues.coords.tree).eqls(["vector", -7, 9]);
      expect(components['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−7,9)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")

    cy.log(`move point to (1.1,3.6)`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: 1.1, y: 3.6 });
      expect(components['/_point1'].stateValues.xs[0].tree).eq(1.1);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(3.6);
      expect(components['/_point1'].stateValues.coords.tree).eqls(["vector", 1.1, 3.6]);
      expect(components['/_point1'].stateValues.constraintUsed).eq(false);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1.1,3.6)')
    });
    cy.get('#\\/_boolean1').should('have.text', "false")

    cy.log(`move point to (1.1,3.9)`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: 1.1, y: 3.9 });
      expect(components['/_point1'].stateValues.xs[0].tree).eq(1);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(4);
      expect(components['/_point1'].stateValues.coords.tree).eqls(["vector", 1, 4]);
      expect(components['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,4)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")

  });

  it('point attracted to grid, including gridlines', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>

  <point>
  <attractToGrid includeGridlines="true"/>
  (3.1,-3.4)
  </point>

  </graph>
  <math><ref prop="coords">_point1</ref></math>
  <boolean><ref prop="constraintUsed">_point1</ref></boolean>
  

  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,−3.4)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true");

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_point1'].stateValues.xs[0].tree).eq(3);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(-3.4);
      expect(components['/_point1'].stateValues.coords.tree).eqls(["vector", 3, -3.4]);
      expect(components['/_point1'].stateValues.constraintUsed).eq(true);
    })


    cy.log(`move point to (1.3,3.9)`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: 1.3, y: 3.9 });
      expect(components['/_point1'].stateValues.xs[0].tree).eq(1.3);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(4);
      expect(components['/_point1'].stateValues.coords.tree).eqls(["vector", 1.3, 4]);
      expect(components['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1.3,4)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true");

    cy.log(`move point to (1.1,3.9)`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: 1.1, y: 3.9 });
      expect(components['/_point1'].stateValues.xs[0].tree).eq(1);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(4);
      expect(components['/_point1'].stateValues.coords.tree).eqls(["vector", 1, 4]);
      expect(components['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,4)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true");

    cy.log(`move point to (1.3,3.7)`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: 1.3, y: 3.7 });
      expect(components['/_point1'].stateValues.xs[0].tree).eq(1.3);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(3.7);
      expect(components['/_point1'].stateValues.coords.tree).eqls(["vector", 1.3, 3.7]);
      expect(components['/_point1'].stateValues.constraintUsed).eq(false);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1.3,3.7)')
    });
    cy.get('#\\/_boolean1').should('have.text', "false");

  });

  it('point attracted to grid with parameters', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <mathinput name="dx"/>
  <mathinput name="dy"/>
  <mathinput name="xoffset"/>
  <mathinput name="yoffset"/>
  <mathinput name="xthreshold"/>
  <mathinput name="ythreshold"/>

  <graph>

  <point>
    <attractToGrid>
      <dx><ref prop="value">dx</ref></dx>
      <dy><ref prop="value">dy</ref></dy>
      <xoffset><ref prop="value">xoffset</ref></xoffset>
      <yoffset><ref prop="value">yoffset</ref></yoffset>
      <xthreshold><ref prop="value">xthreshold</ref></xthreshold>
      <ythreshold><ref prop="value">ythreshold</ref></ythreshold>
      </attractToGrid>
  (-7.1,8.9)
  </point>

  </graph>
  <math><ref prop="coords">_point1</ref></math>
  <boolean><ref prop="constraintUsed">_point1</ref></boolean>

  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    cy.log(`no constraints with blanks`)

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_point1'].stateValues.xs[0].tree).eq(-7.1);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(8.9);
      expect(components['/_point1'].stateValues.coords.tree).eqls(["vector", -7.1, 8.9]);
      expect(components['/_point1'].stateValues.constraintUsed).eq(false);
    })
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−7.1,8.9)')
    });
    cy.get('#\\/_boolean1').should('have.text', "false")

    cy.log(`constrain x and y to integers`);
    cy.get('#\\/dx_input').clear().type('1');
    cy.get('#\\/dy_input').clear().type('1');
    cy.get('#\\/xoffset_input').clear().type('0');
    cy.get('#\\/yoffset_input').clear().type('0');
    cy.get('#\\/xthreshold_input').clear().type('0.2');
    cy.get('#\\/ythreshold_input').clear().type('0.2').blur();
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_point1'].stateValues.xs[0].tree).eq(-7);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(9);
      expect(components['/_point1'].stateValues.coords.tree).eqls(["vector", -7, 9]);
      expect(components['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−7,9)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")

    cy.log(`change constraints`);
    cy.get('#\\/dx_input').clear().type('3');
    cy.get('#\\/dy_input').clear().type('0.5');
    cy.get('#\\/xoffset_input').clear().type('1');
    cy.get('#\\/yoffset_input').clear().type('0.1').blur();
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_point1'].stateValues.xs[0].tree).eq(-7.1);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(8.9);
      expect(components['/_point1'].stateValues.coords.tree).eqls(["vector", -7.1, 8.9]);
      expect(components['/_point1'].stateValues.constraintUsed).eq(false);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−7.1,8.9)')
    });
    cy.get('#\\/_boolean1').should('have.text', "false")

    cy.get('#\\/xthreshold_input').clear().type('1.0');
    cy.get('#\\/ythreshold_input').clear().type('0.3').blur();
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_point1'].stateValues.xs[0].tree).eq(-8);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(9.1);
      expect(components['/_point1'].stateValues.coords.tree).eqls(["vector", -8, 9.1]);
      expect(components['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−8,9.1)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")



  });

  it('point constrained to line', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point>(0,2)</point>
  <point>(2,0)</point>
  <line>
    <through>
      <ref>_point1</ref>
      <ref>_point2</ref>
    </through>
  </line>
  <point name="A">
    <constrainTo><ref>_line1</ref></constrainTo>
    (-1,-5)
  </point>
  </graph>
  <ref prop="constraintUsed" name="constraintUsed">A</ref>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let constraintUsed1 = components['/constraintused'].replacements[0];
      let constraintUsed1Anchor = '#' + constraintUsed1.componentName;

      cy.log(`point is on line`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/a'].stateValues.xs[0].tree + components['/a'].stateValues.xs[1].tree).eq(2);
        expect(components['/a'].stateValues.constraintUsed).eq(true);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")


      cy.log(`move point`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        components['/a'].movePoint({ x: 9, y: -3 });
        expect(components['/a'].stateValues.xs[0].tree + components['/a'].stateValues.xs[1].tree).eq(2);
        expect(components['/a'].stateValues.constraintUsed).eq(true);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`change line`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        components['/_point1'].movePoint({ x: 3, y: 1 });
        expect(components['/a'].stateValues.xs[0].tree - components['/a'].stateValues.xs[1].tree).eq(2);
        expect(components['/a'].stateValues.constraintUsed).eq(true);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move point`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        components['/a'].movePoint({ x: 9, y: -3 });
        expect(components['/a'].stateValues.xs[0].tree - components['/a'].stateValues.xs[1].tree).eq(2);
        expect(components['/a'].stateValues.constraintUsed).eq(true);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

    })
  });

  it('point attracted to line', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point>(0,2)</point>
  <point>(2,0)</point>
  <line>
    <through>
      <ref>_point1</ref>
      <ref>_point2</ref>
    </through>
  </line>
  <point name="A">
    <attractTo><ref>_line1</ref></attractTo>
    (-1,-5)
  </point>
  </graph>
  <ref prop="constraintUsed" name="constraintUsed">A</ref>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let constraintUsed1 = components['/constraintused'].replacements[0];
      let constraintUsed1Anchor = '#' + constraintUsed1.componentName;

      cy.log(`point is not on line`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/a'].stateValues.xs[0].tree).eq(-1);
        expect(components['/a'].stateValues.xs[1].tree).eq(-5);
        expect(components['/a'].stateValues.coords.tree).eqls(["vector", -1, -5]);
        expect(components['/a'].stateValues.constraintUsed).eq(false)
      })
      cy.get(constraintUsed1Anchor).should('have.text', "false")

      cy.log(`move point near line`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        components['/a'].movePoint({ x: 9.1, y: -6.8 });
        expect(components['/a'].stateValues.xs[0].tree + components['/a'].stateValues.xs[1].tree).eq(2);
        expect(components['/a'].stateValues.constraintUsed).eq(true);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`change line, point not on line`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        components['/_point1'].movePoint({ x: 3, y: 1 });
        expect(components['/a'].stateValues.xs[0].tree + components['/a'].stateValues.xs[1].tree).eq(2);
        expect(components['/a'].stateValues.constraintUsed).eq(false)
      })
      cy.get(constraintUsed1Anchor).should('have.text', "false")

      cy.log(`move point`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        components['/a'].movePoint({ x: -5.1, y: -6.8 });
        expect(components['/a'].stateValues.xs[0].tree - components['/a'].stateValues.xs[1].tree).eq(2);
        expect(components['/a'].stateValues.constraintUsed).eq(true);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")
    })

  });

  it('point constrained to lines and points', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <graph>
  <line hide>y = x + 7</line>
  <line hide>y = x - 3</line>
  <map>
    <template>
      <point hide>(<copyFromSubs/>,<copyFromSubs/>+2)</point>
    </template>
    <substitutions><sequence from="-10" to="10"/></substitutions>
  </map>

  <point>
    <constrainTo>
      <ref>_line1</ref>
      <ref>_line2</ref>
      <ref>_map1</ref>
    </constrainTo>
    (3,2)
  </point>
  </graph>
  <ref prop="constraintUsed" name="constraintUsed">_point1</ref>
  <text>a</text>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let constraintUsed1 = components['/constraintused'].replacements[0];
      let constraintUsed1Anchor = '#' + constraintUsed1.componentName;

      cy.log(`point is on line`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_point1'].stateValues.xs[1].tree - components['/_point1'].stateValues.xs[0].tree).eq(-3);
        expect(components['/_point1'].stateValues.constraintUsed).eq(true)
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move point to lower right`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        components['/_point1'].movePoint({ x: 9, y: -5 });
        expect(components['/_point1'].stateValues.xs[1].tree - components['/_point1'].stateValues.xs[0].tree).eq(-3);
        expect(components['/_point1'].stateValues.constraintUsed).eq(true)
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move point near points`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        components['/_point1'].movePoint({ x: 3.5, y: 5.5 });
        expect(components['/_point1'].stateValues.xs[0].tree).eq(3);
        expect(components['/_point1'].stateValues.xs[1].tree).eq(5);
        expect(components['/_point1'].stateValues.coords.tree).eqls(["vector", 3, 5]);
        expect(components['/_point1'].stateValues.constraintUsed).eq(true)
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move point to upper left`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        components['/_point1'].movePoint({ x: -9, y: 8 });
        expect(components['/_point1'].stateValues.xs[1].tree - components['/_point1'].stateValues.xs[0].tree).eq(7);
        expect(components['/_point1'].stateValues.constraintUsed).eq(true);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")
    })
  });

  it('point attracted to lines and points', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <graph>
  <line hide>y = x + 7</line>
  <line hide>y = x - 3</line>
  <map>
    <template>
      <point hide>(<copyFromSubs/>,<copyFromSubs/>+2)</point>
    </template>
    <substitutions><sequence from="-10" to="10"/></substitutions>
  </map>

  <point>
    <attractTo threshold="1">
      <ref>_line1</ref>
      <ref>_line2</ref>
      <ref>_map1</ref>
    </attractTo>
    (3,2)
  </point>
  </graph>
  <ref prop="constraintUsed" name="constraintUsed">_point1</ref>
  <text>a</text>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let constraintUsed1 = components['/constraintused'].replacements[0];
      let constraintUsed1Anchor = '#' + constraintUsed1.componentName;

      cy.log(`point is in original location`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_point1'].stateValues.xs[0].tree).eq(3);
        expect(components['/_point1'].stateValues.xs[1].tree).eq(2);
        expect(components['/_point1'].stateValues.coords.tree).eqls(["vector", 3, 2]);
        expect(components['/_point1'].stateValues.constraintUsed).eq(false);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "false")

      cy.log(`point is on line`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        components['/_point1'].movePoint({ x: 3.1, y: 0.5 });
        expect(components['/_point1'].stateValues.xs[1].tree - components['/_point1'].stateValues.xs[0].tree).eq(-3);
        expect(components['/_point1'].stateValues.constraintUsed).eq(true)
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move point to lower right`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        components['/_point1'].movePoint({ x: 9, y: -5 });
        expect(components['/_point1'].stateValues.xs[0].tree).eq(9);
        expect(components['/_point1'].stateValues.xs[1].tree).eq(-5);
        expect(components['/_point1'].stateValues.coords.tree).eqls(["vector", 9, -5]);
        expect(components['/_point1'].stateValues.constraintUsed).eq(false);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "false")

      cy.log(`move point near points`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        components['/_point1'].movePoint({ x: 3.1, y: 5.1 });
        expect(components['/_point1'].stateValues.xs[0].tree).eq(3);
        expect(components['/_point1'].stateValues.xs[1].tree).eq(5);
        expect(components['/_point1'].stateValues.coords.tree).eqls(["vector", 3, 5]);
        expect(components['/_point1'].stateValues.constraintUsed).eq(true)
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move point to upper left`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        components['/_point1'].movePoint({ x: -9, y: 8 });
        expect(components['/_point1'].stateValues.xs[0].tree).eq(-9);
        expect(components['/_point1'].stateValues.xs[1].tree).eq(8);
        expect(components['/_point1'].stateValues.coords.tree).eqls(["vector", -9, 8]);
        expect(components['/_point1'].stateValues.constraintUsed).eq(false);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "false")

      cy.log(`move point near upper line`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        components['/_point1'].movePoint({ x: -8.8, y: -2.3 });
        expect(components['/_point1'].stateValues.xs[1].tree - components['/_point1'].stateValues.xs[0].tree).eq(7);
        expect(components['/_point1'].stateValues.constraintUsed).eq(true);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")
    })
  });

  it('point constrained to union of lines and grid', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <graph>
  <line>x+y=0</line>
  <line>x=y</line>
  <line>x=2y+8</line>
  <line>x=-2y-8</line>
  <point name="A">
    <constraintUnion>
      <constrainTo><ref>_line1</ref></constrainTo>
      <constrainTo><ref>_line2</ref><ref>_line3</ref></constrainTo>
      <constrainTo><ref>_line4</ref></constrainTo>
      <constrainToGrid dx="2" dy="2"/>
    </constraintUnion>
    (7,3)
  </point>
  </graph>
  <ref prop="constraintUsed" name="constraintUsed">A</ref>
  <text>a</text>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let constraintUsed1 = components['/constraintused'].replacements[0];
      let constraintUsed1Anchor = '#' + constraintUsed1.componentName;

      cy.log(`point on grid`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/a'].stateValues.xs[0].tree).to.be.closeTo(8, 1E-12);
        expect(components['/a'].stateValues.xs[1].tree).to.be.closeTo(4, 1E-12);
        expect(components['/a'].stateValues.constraintUsed).eq(true)
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move near line x+y=0`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        components['/a'].movePoint({ x: -7.1, y: 8.2 });
        expect(components['/a'].stateValues.xs[0].tree + components['/a'].stateValues.xs[1].tree).to.be.closeTo(0, 1E-12);
        expect(components['/a'].stateValues.constraintUsed).eq(true);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move near line x=y`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        components['/a'].movePoint({ x: 7.1, y: 8.2 });
        expect(components['/a'].stateValues.xs[0].tree - components['/a'].stateValues.xs[1].tree).to.be.closeTo(0, 1E-12);
        expect(components['/a'].stateValues.constraintUsed).eq(true);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move near line x=2y+8`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        components['/a'].movePoint({ x: 3.5, y: -2.5 });
        expect(components['/a'].stateValues.xs[0].tree - 2 * components['/a'].stateValues.xs[1].tree).to.be.closeTo(8, 1E-12);
        expect(components['/a'].stateValues.constraintUsed).eq(true);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move near line x=-2y-8`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        components['/a'].movePoint({ x: -3.5, y: -2.5 });
        expect(components['/a'].stateValues.xs[0].tree + 2 * components['/a'].stateValues.xs[1].tree).to.be.closeTo(-8, 1E-12);
        expect(components['/a'].stateValues.constraintUsed).eq(true);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")
    })

  });

  it('point attracted to union of lines and grid', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <graph>
  <line>x+y=0</line>
  <line>x=y</line>
  <line>x=2y+8</line>
  <line>x=-2y-8</line>
  <point name="A">
    <constraintToAttractor>
      <constraintUnion>
        <constrainTo><ref>_line1</ref></constrainTo>
        <constrainTo><ref>_line2</ref><ref>_line3</ref></constrainTo>
        <constrainTo><ref>_line4</ref></constrainTo>
        <constrainToGrid dx="2" dy="2"/>
      </constraintUnion>
    </constraintToAttractor>
    (7,3)
  </point>
  </graph>
  <ref prop="constraintUsed" name="constraintUsed">A</ref>
  <text>a</text>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let constraintUsed1 = components['/constraintused'].replacements[0];
      let constraintUsed1Anchor = '#' + constraintUsed1.componentName;

      cy.log(`point in original location`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/a'].stateValues.xs[0].tree).to.be.closeTo(7, 1E-12);
        expect(components['/a'].stateValues.xs[1].tree).to.be.closeTo(3, 1E-12);
        expect(components['/a'].stateValues.constraintUsed).eq(false);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "false")

      cy.log(`move point near grid`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        components['/a'].movePoint({ x: 0.2, y: -1.8 });
        expect(components['/a'].stateValues.xs[0].tree).to.be.closeTo(0, 1E-12);
        expect(components['/a'].stateValues.xs[1].tree).to.be.closeTo(-2, 1E-12);
        expect(components['/a'].stateValues.constraintUsed).eq(true)
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move not close enough to line x+y=0`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        components['/a'].movePoint({ x: -7.1, y: 8.2 });
        expect(components['/a'].stateValues.xs[0].tree).to.be.closeTo(-7.1, 1E-12);
        expect(components['/a'].stateValues.xs[1].tree).to.be.closeTo(8.2, 1E-12);
        expect(components['/a'].stateValues.constraintUsed).eq(false);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "false")

      cy.log(`move close enough to line x+y=0`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        components['/a'].movePoint({ x: -7.5, y: 7.8 });
        expect(components['/a'].stateValues.xs[0].tree + components['/a'].stateValues.xs[1].tree).to.be.closeTo(0, 1E-12);
        expect(components['/a'].stateValues.constraintUsed).eq(true)
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move not close enough to line x=y`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        components['/a'].movePoint({ x: 7.1, y: 8.2 });
        expect(components['/a'].stateValues.xs[0].tree).to.be.closeTo(7.1, 1E-12);
        expect(components['/a'].stateValues.xs[1].tree).to.be.closeTo(8.2, 1E-12);
        expect(components['/a'].stateValues.constraintUsed).eq(false);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "false")

      cy.log(`move close enough to line x=y`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        components['/a'].movePoint({ x: 7.5, y: 7.8 });
        expect(components['/a'].stateValues.xs[0].tree - components['/a'].stateValues.xs[1].tree).to.be.closeTo(0, 1E-12);
        expect(components['/a'].stateValues.constraintUsed).eq(true)
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move near line x=2y+8`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        components['/a'].movePoint({ x: 3.5, y: -2.5 });
        expect(components['/a'].stateValues.xs[0].tree - 2 * components['/a'].stateValues.xs[1].tree).to.be.closeTo(8, 1E-12);
        expect(components['/a'].stateValues.constraintUsed).eq(true)
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")


      cy.log(`move near line x=-2y-8`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        components['/a'].movePoint({ x: -3.5, y: -2.5 });
        expect(components['/a'].stateValues.xs[0].tree + 2 * components['/a'].stateValues.xs[1].tree).to.be.closeTo(-8, 1E-12);
        expect(components['/a'].stateValues.constraintUsed).eq(true)
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

    })
  });

  it('point attracted to union of lines and intersections', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <graph>
  <line>x+y=0</line>
  <line>x=y</line>
  <line>x=2y+8</line>
  <line>x=-2y-8</line>
  <point name="A">
    <attractTo>
      <ref>_line1</ref>
      <ref>_line2</ref>
      <ref>_line3</ref>
      <ref>_line4</ref>
    </attractTo>
    <attractTo>
      <intersection><ref>_line1</ref><ref>_line2</ref></intersection>
      <intersection><ref>_line1</ref><ref>_line3</ref></intersection>
      <intersection><ref>_line1</ref><ref>_line4</ref></intersection>
      <intersection><ref>_line2</ref><ref>_line3</ref></intersection>
      <intersection><ref>_line2</ref><ref>_line4</ref></intersection>
      <intersection><ref>_line3</ref><ref>_line4</ref></intersection>
    </attractTo>
    (7,3)
  </point>
  </graph>
  <ref prop="constraintUsed" name="constraintUsed">A</ref>
  <text>a</text>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let constraintUsed1 = components['/constraintused'].replacements[0];
      let constraintUsed1Anchor = '#' + constraintUsed1.componentName;

      cy.log(`point in original location`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/a'].stateValues.xs[0].tree).to.be.closeTo(7, 1E-12);
        expect(components['/a'].stateValues.xs[1].tree).to.be.closeTo(3, 1E-12);
        expect(components['/a'].stateValues.constraintUsed).eq(false);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "false")

      cy.log(`move not close enough to line x+y=0`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        components['/a'].movePoint({ x: -7.1, y: 8.2 });
        expect(components['/a'].stateValues.xs[0].tree).to.be.closeTo(-7.1, 1E-12);
        expect(components['/a'].stateValues.xs[1].tree).to.be.closeTo(8.2, 1E-12);
        expect(components['/a'].stateValues.constraintUsed).eq(false);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "false")

      cy.log(`move close enough to line x+y=0`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        components['/a'].movePoint({ x: -7.5, y: 7.8 });
        expect(components['/a'].stateValues.xs[0].tree + components['/a'].stateValues.xs[1].tree).to.be.closeTo(0, 1E-12);
        expect(components['/a'].stateValues.constraintUsed).eq(true);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move not close enough to line x=y`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        components['/a'].movePoint({ x: 7.1, y: 8.2 });
        expect(components['/a'].stateValues.xs[0].tree).to.be.closeTo(7.1, 1E-12);
        expect(components['/a'].stateValues.xs[1].tree).to.be.closeTo(8.2, 1E-12);
        expect(components['/a'].stateValues.constraintUsed).eq(false);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "false")

      cy.log(`move close enough to line x=y`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        components['/a'].movePoint({ x: 7.5, y: 7.8 });
        expect(components['/a'].stateValues.xs[0].tree - components['/a'].stateValues.xs[1].tree).to.be.closeTo(0, 1E-12);
        expect(components['/a'].stateValues.constraintUsed).eq(true)
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move near line x=2y+8`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        components['/a'].movePoint({ x: 3.5, y: -2.5 });
        expect(components['/a'].stateValues.xs[0].tree - 2 * components['/a'].stateValues.xs[1].tree).to.be.closeTo(8, 1E-12);
        expect(components['/a'].stateValues.constraintUsed).eq(true)
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move near line x=-2y-8`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        components['/a'].movePoint({ x: -3.5, y: -2.5 });
        expect(components['/a'].stateValues.xs[0].tree + 2 * components['/a'].stateValues.xs[1].tree).to.be.closeTo(-8, 1E-12);
        expect(components['/a'].stateValues.constraintUsed).eq(true)
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move near intersection of x+y=0 and x=y`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        components['/a'].movePoint({ x: -0.2, y: 0.1 });
        expect(components['/a'].stateValues.xs[0].tree).to.be.closeTo(0, 1E-12);
        expect(components['/a'].stateValues.xs[1].tree).to.be.closeTo(0, 1E-12);
        expect(components['/a'].stateValues.constraintUsed).eq(true)
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move near intersection of x+y=0 and x=2y+8`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        components['/a'].movePoint({ x: 2.6, y: -2.7 });
        expect(components['/a'].stateValues.xs[0].tree).to.be.closeTo(8 / 3, 1E-12);
        expect(components['/a'].stateValues.xs[1].tree).to.be.closeTo(-8 / 3, 1E-12);
        expect(components['/a'].stateValues.constraintUsed).eq(true)
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move near intersection of x+y=0 and x=-2y-8`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        components['/a'].movePoint({ x: 7.9, y: -8.2 });
        expect(components['/a'].stateValues.xs[0].tree).to.be.closeTo(8, 1E-12);
        expect(components['/a'].stateValues.xs[1].tree).to.be.closeTo(-8, 1E-12);
        expect(components['/a'].stateValues.constraintUsed).eq(true)
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move near intersection of x=y and x=2y+8`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        components['/a'].movePoint({ x: -8.1, y: -7.8 });
        expect(components['/a'].stateValues.xs[0].tree).to.be.closeTo(-8, 1E-12);
        expect(components['/a'].stateValues.xs[1].tree).to.be.closeTo(-8, 1E-12);
        expect(components['/a'].stateValues.constraintUsed).eq(true)
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move near intersection of x+y=0 and x=-2y-8`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        components['/a'].movePoint({ x: -2.5, y: -2.7 });
        expect(components['/a'].stateValues.xs[0].tree).to.be.closeTo(-8 / 3, 1E-12);
        expect(components['/a'].stateValues.xs[1].tree).to.be.closeTo(-8 / 3, 1E-12);
        expect(components['/a'].stateValues.constraintUsed).eq(true)
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move near intersection of x=2y+8 and x=-2y-8`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        components['/a'].movePoint({ x: 0.2, y: -3.9 });
        expect(components['/a'].stateValues.xs[0].tree).to.be.closeTo(0, 1E-12);
        expect(components['/a'].stateValues.xs[1].tree).to.be.closeTo(-4, 1E-12);
        expect(components['/a'].stateValues.constraintUsed).eq(true)
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")
    })
  });

  it('point constrained to union of lines and attracted to intersections', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <graph>
  <line>x+y=0</line>
  <line>x=y</line>
  <line>x=2y+8</line>
  <line>x=-2y-8</line>
  <point name="A">
    <constrainTo>
      <ref>_line1</ref>
      <ref>_line2</ref>
      <ref>_line3</ref>
      <ref>_line4</ref>
    </constrainTo>
    <attractTo>
      <intersection><ref>_line1</ref><ref>_line2</ref></intersection>
      <intersection><ref>_line1</ref><ref>_line3</ref></intersection>
      <intersection><ref>_line1</ref><ref>_line4</ref></intersection>
      <intersection><ref>_line2</ref><ref>_line3</ref></intersection>
      <intersection><ref>_line2</ref><ref>_line4</ref></intersection>
      <intersection><ref>_line3</ref><ref>_line4</ref></intersection>
    </attractTo>
    (7,3)
  </point>
  </graph>
  <ref prop="constraintUsed" name="constraintUsed">A</ref>
  <text>a</text>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let constraintUsed1 = components['/constraintused'].replacements[0];
      let constraintUsed1Anchor = '#' + constraintUsed1.componentName;

      cy.log(`on x=y`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/a'].stateValues.xs[0].tree - components['/a'].stateValues.xs[1].tree).to.be.closeTo(0, 1E-12);
        expect(components['/a'].stateValues.constraintUsed).eq(true)
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`attract to line x+y=0`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        components['/a'].movePoint({ x: -7.1, y: 10 });
        expect(components['/a'].stateValues.xs[0].tree + components['/a'].stateValues.xs[1].tree).to.be.closeTo(0, 1E-12);
        expect(components['/a'].stateValues.constraintUsed).eq(true);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move near line x=2y+8`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        components['/a'].movePoint({ x: 10, y: -3 });
        expect(components['/a'].stateValues.xs[0].tree - 2 * components['/a'].stateValues.xs[1].tree).to.be.closeTo(8, 1E-12);
        expect(components['/a'].stateValues.constraintUsed).eq(true);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move near line x=-2y-8`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        components['/a'].movePoint({ x: -10, y: -3 });
        expect(components['/a'].stateValues.xs[0].tree + 2 * components['/a'].stateValues.xs[1].tree).to.be.closeTo(-8, 1E-12);
        expect(components['/a'].stateValues.constraintUsed).eq(true);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move near intersection of x+y=0 and x=y`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        components['/a'].movePoint({ x: -0.2, y: 0.1 });
        expect(components['/a'].stateValues.xs[0].tree).to.be.closeTo(0, 1E-12);
        expect(components['/a'].stateValues.xs[1].tree).to.be.closeTo(0, 1E-12);
        expect(components['/a'].stateValues.constraintUsed).eq(true);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move near intersection of x+y=0 and x=2y+8`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        components['/a'].movePoint({ x: 2.6, y: -2.7 });
        expect(components['/a'].stateValues.xs[0].tree).to.be.closeTo(8 / 3, 1E-12);
        expect(components['/a'].stateValues.xs[1].tree).to.be.closeTo(-8 / 3, 1E-12);
        expect(components['/a'].stateValues.constraintUsed).eq(true);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move near intersection of x+y=0 and x=-2y-8`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        components['/a'].movePoint({ x: 7.9, y: -8.2 });
        expect(components['/a'].stateValues.xs[0].tree).to.be.closeTo(8, 1E-12);
        expect(components['/a'].stateValues.xs[1].tree).to.be.closeTo(-8, 1E-12);
        expect(components['/a'].stateValues.constraintUsed).eq(true);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move near intersection of x=y and x=2y+8`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        components['/a'].movePoint({ x: -8.1, y: -7.8 });
        expect(components['/a'].stateValues.xs[0].tree).to.be.closeTo(-8, 1E-12);
        expect(components['/a'].stateValues.xs[1].tree).to.be.closeTo(-8, 1E-12);
        expect(components['/a'].stateValues.constraintUsed).eq(true);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move near intersection of x=y and x=-2y-8`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        components['/a'].movePoint({ x: -2.5, y: -2.7 });
        expect(components['/a'].stateValues.xs[0].tree).to.be.closeTo(-8 / 3, 1E-12);
        expect(components['/a'].stateValues.xs[1].tree).to.be.closeTo(-8 / 3, 1E-12);
        expect(components['/a'].stateValues.constraintUsed).eq(true);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move near intersection of x=2y+8 and x=-2y-8`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        components['/a'].movePoint({ x: 0.2, y: -3.9 });
        expect(components['/a'].stateValues.xs[0].tree).to.be.closeTo(0, 1E-12);
        expect(components['/a'].stateValues.xs[1].tree).to.be.closeTo(-4, 1E-12);
        expect(components['/a'].stateValues.constraintUsed).eq(true);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

    })
  });

  it('point constrained intersection of two lines', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <graph>
  <point>(1,2)</point>
  <point>(2,2)</point>
  <point>(3,2)</point>
  <point>(4,2)</point>
  
  <line><through><ref>_point1</ref><ref>_point2</ref></through></line>
  <line><through><ref>_point3</ref><ref>_point4</ref></through></line>
  <intersection><ref>_line1</ref><ref>_line2</ref></intersection>
  
  </graph>
  <text>a</text>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log(`intersection is a line`);
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let intersectionReplacementsArray = components['/_intersection1'].replacements;
      expect(intersectionReplacementsArray.length).eq(1);
      let replacement = intersectionReplacementsArray[0];
      expect(replacement.componentType).eq("line");
      expect(replacement.stateValues.slope.tree).eq(0);
      expect(replacement.stateValues.yintercept.tree).eq(2);
    })

    cy.log(`make first line vertical`);
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: 3, y: 5 });
      components['/_point2'].movePoint({ x: 3, y: -5 });
      let intersectionReplacementsArray = components['/_intersection1'].replacements;
      expect(intersectionReplacementsArray.length).eq(1);
      let replacement = intersectionReplacementsArray[0];
      expect(replacement.componentType).eq("point");
      expect(replacement.stateValues.xs[0].tree).eq(3);
      expect(replacement.stateValues.xs[1].tree).eq(2);
    })

    cy.log(`make second line vertical`);
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point3'].movePoint({ x: -4, y: 5 });
      components['/_point4'].movePoint({ x: -4, y: -5 });
      let intersectionReplacementsArray = components['/_intersection1'].replacements;
      expect(intersectionReplacementsArray.length).eq(0);
    })

    cy.log(`make lines intersect again`);
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: -8, y: -7 });
      components['/_point2'].movePoint({ x: 8, y: 9 });
      components['/_point3'].movePoint({ x: 4, y: 6 });
      components['/_point4'].movePoint({ x: -4, y: -6 });
      let intersectionReplacementsArray = components['/_intersection1'].replacements;
      expect(intersectionReplacementsArray.length).eq(1);
      let replacement = intersectionReplacementsArray[0];
      expect(replacement.componentType).eq("point");
      expect(replacement.stateValues.xs[0].tree).eq(2);
      expect(replacement.stateValues.xs[1].tree).eq(3);
    })

    cy.log(`make lines equal again`);
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: 6, y: 9 });
      components['/_point2'].movePoint({ x: -6, y: -9 });
      components['/_point3'].movePoint({ x: 4, y: 6 });
      components['/_point4'].movePoint({ x: -4, y: -6 });
      let intersectionReplacementsArray = components['/_intersection1'].replacements;
      expect(intersectionReplacementsArray.length).eq(1);
      let replacement = intersectionReplacementsArray[0];
      expect(replacement.componentType).eq("line");
      expect(replacement.stateValues.slope.tree).eqls(['/', 3, 2]);
      expect(replacement.stateValues.xintercept.tree).eq(0);
      expect(replacement.stateValues.yintercept.tree).eq(0);
    })

  });

  it('point constrained to grid as a property', () => {
    // included many properties so that constrainToGrid
    // is likely to have property children on either side
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point name='A' label="A" constrainToGrid="true" modifyIndirectly="true" hide="false" draggable="true">(1,2)</point>
  <point name="B" label="B" constrainToGrid modifyIndirectly hide="false" draggable>(2,3)</point>
  <point name="C" label="C" constrainToGrid="false" modifyIndirectly="true" hide="false" draggable="true">(1,2)</point>
  </graph>
  `}, "*");
    });


    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    cy.log(`check constraints`);
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/a'].movePoint({ x: 3.2, y: 5.1 });
      components['/b'].movePoint({ x: 4.2, y: 6.1 });
      components['/c'].movePoint({ x: 5.2, y: 7.1 });
      expect(components['/a'].stateValues.xs[0].tree).eq(3);
      expect(components['/a'].stateValues.xs[1].tree).eq(5);
      expect(components['/b'].stateValues.xs[0].tree).eq(4);
      expect(components['/b'].stateValues.xs[1].tree).eq(6);
      expect(components['/c'].stateValues.xs[0].tree).eq(5.2);
      expect(components['/c'].stateValues.xs[1].tree).eq(7.1);
    })

  });

  it('point attracted to grid as a property', () => {
    // included many properties so that constrainToGrid
    // is likely to have property children on either side
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point name="A" label="A" attractToGrid="true" modifyIndirectly="true" hide="false" draggable="true">(1,2)</point>
  <point name="B" label="B" attractToGrid modifyIndirectly hide="false" draggable>(2,3)</point>
  <point name="C" label="C" attractToGrid="false" modifyIndirectly="true" hide="false" draggable="true">(1,2)</point>
  </graph>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    cy.log(`check attraction`);
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/a'].movePoint({ x: 3.1, y: 5.1 });
      components['/b'].movePoint({ x: 4.1, y: 6.1 });
      components['/c'].movePoint({ x: 5.1, y: 7.1 });
      expect(components['/a'].stateValues.xs[0].tree).eq(3);
      expect(components['/a'].stateValues.xs[1].tree).eq(5);
      expect(components['/b'].stateValues.xs[0].tree).eq(4);
      expect(components['/b'].stateValues.xs[1].tree).eq(6);
      expect(components['/c'].stateValues.xs[0].tree).eq(5.1);
      expect(components['/c'].stateValues.xs[1].tree).eq(7.1);
    })

    cy.log(`too far to attract`);
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/a'].movePoint({ x: 3.3, y: 5.1 });
      components['/b'].movePoint({ x: 4.3, y: 6.1 });
      components['/c'].movePoint({ x: 5.3, y: 7.1 });
      expect(components['/a'].stateValues.xs[0].tree).eq(3.3);
      expect(components['/a'].stateValues.xs[1].tree).eq(5.1);
      expect(components['/b'].stateValues.xs[0].tree).eq(4.3);
      expect(components['/b'].stateValues.xs[1].tree).eq(6.1);
      expect(components['/c'].stateValues.xs[0].tree).eq(5.3);
      expect(components['/c'].stateValues.xs[1].tree).eq(7.1);
    })
  });

  it('sugar coords with defining gap', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <mathinput name="n"/>

  <graph>
    <point>(5<sequence from="2"><to><ref prop="value">n</ref></to></sequence>,4 )</point>
  </graph>

  <text>a</text>
    `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let coords1 = components['/_point1'].activeChildren[0];
      let string1 = coords1.definingChildren[0];
      let string1Name = string1.componentName;
      let string2 = coords1.definingChildren[2];
      let string2Name = string2.componentName;

      cy.window().then((win) => {
        expect(coords1.definingChildren.map(x => x.componentName)).eqls(
          [string1Name, '/_sequence1', string2Name]);
        expect(coords1.activeChildren.map(x => x.componentName)).eqls(
          [string1Name, string2Name]);
        expect(components['/_point1'].stateValues.xs[0].tree).eq(5)
        expect(components['/_point1'].stateValues.xs[1].tree).eq(4)
      })

      cy.get('#\\/n_input').clear().type("2{enter}").blur();

      cy.window().then((win) => {
        let math1 = components['/_sequence1'].replacements[0].adapterUsed;
        let math1Name = math1.componentName;
        expect(coords1.definingChildren.map(x => x.componentName)).eqls(
          [string1Name, '/_sequence1', string2Name]);
        expect(coords1.activeChildren.map(x => x.componentName)).eqls(
          [string1Name, math1Name, string2Name]);
        expect(components['/_point1'].stateValues.xs[0].tree).eq(10)
        expect(components['/_point1'].stateValues.xs[1].tree).eq(4)

      })
    })
  })

  it('referencing via x1 and x2', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point>(1,2)</point>
    <point>(<ref prop="x2">_point1</ref>, <ref prop="x1">_point1</ref>)</point>
  </graph>
    `}, "*");
    });


    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_point1'].stateValues.xs[0].tree).eq(1);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(2);
      expect(components['/_point2'].stateValues.xs[0].tree).eq(2);
      expect(components['/_point2'].stateValues.xs[1].tree).eq(1);
    })

    cy.log("move point 2")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point2'].movePoint({ x: -4, y: 9 });
      expect(components['/_point1'].stateValues.xs[0].tree).eq(9);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(-4);
      expect(components['/_point2'].stateValues.xs[0].tree).eq(-4);
      expect(components['/_point2'].stateValues.xs[1].tree).eq(9);
    })

  })

  it('updating via adapters', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point><point>(1,2)</point></point>
  </graph>
  
  <graph>
  <point><ref>_point1</ref></point>
  </graph>
  
  <graph>
  <point><ref>_point2</ref></point>
  </graph>
  
  <graph>
  <point><ref>_ref1</ref></point>
  </graph>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let points = [
        '/_point1', '/_point2', '/_point3', '/_point4', '/_point5',
        components['/_ref1'].replacements[0].componentName,
        components['/_ref2'].replacements[0].componentName,
        components['/_ref3'].replacements[0].replacements[0].componentName,
      ];
      let xs = [-10, 6, -4, 2, -9, -5, -2, 4];
      let ys = [8, 3, -3, -2, -6, 5, -9, 0];

      cy.log("initial positions")
      cy.window().then((win) => {
        let x = 1;
        let y = 2;
        for (let point of points) {
          expect(components[point].stateValues.xs[0].tree).eq(x);
          expect(components[point].stateValues.xs[1].tree).eq(y);
        }
      })

      cy.log("move each point in turn")
      cy.window().then((win) => {
        for (let i = 0; i < 8; i++) {
          let x = xs[i];
          let y = ys[i];
          components[points[i]].movePoint({ x: x, y: y });
          for (let point of points) {
            expect(components[point].stateValues.xs[0].tree).eq(x);
            expect(components[point].stateValues.xs[1].tree).eq(y);
          }

        }
      })
    })
  })

  it('combining different components through refs', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point>(1,2)</point>
    <ref>_point1</ref>
    <ref>_point1</ref>
    <point>(<ref prop="y">_ref1</ref>,<ref prop="x">_ref2</ref>)</point>
  </graph>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log("initial positions")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x = 1;
      let y = 2;

      expect(components['/_point1'].stateValues.xs[0].tree).eq(x);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(y);

      expect(components['/_point2'].stateValues.xs[0].tree).eq(y);
      expect(components['/_point2'].stateValues.xs[1].tree).eq(x);

    });

    cy.log("move point 1")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x = -3;
      let y = 5;

      components['/_point1'].movePoint({ x: x, y: y });

      expect(components['/_point1'].stateValues.xs[0].tree).eq(x);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(y);

      expect(components['/_point2'].stateValues.xs[0].tree).eq(y);
      expect(components['/_point2'].stateValues.xs[1].tree).eq(x);

    });


    cy.log("move point 2")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x = 9;
      let y = -1;

      components['/_point2'].movePoint({ x: y, y: x });

      expect(components['/_point1'].stateValues.xs[0].tree).eq(x);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(y);

      expect(components['/_point2'].stateValues.xs[0].tree).eq(y);
      expect(components['/_point2'].stateValues.xs[1].tree).eq(x);

    });
  })

  it('combining different components through refs 2', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point>(1,2)</point>
    <ref>_point1</ref>
    <ref>_point1</ref>
    <point>
      <x><ref prop="y">_ref1</ref></x>
      <y><ref prop="x">_ref2</ref></y>
    </point>
  </graph>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log("initial positions")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x = 1;
      let y = 2;

      expect(components['/_point1'].stateValues.xs[0].tree).eq(x);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(y);

      expect(components['/_point2'].stateValues.xs[0].tree).eq(y);
      expect(components['/_point2'].stateValues.xs[1].tree).eq(x);

    });

    cy.log("move point 1")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x = -3;
      let y = 5;

      components['/_point1'].movePoint({ x: x, y: y });

      expect(components['/_point1'].stateValues.xs[0].tree).eq(x);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(y);

      expect(components['/_point2'].stateValues.xs[0].tree).eq(y);
      expect(components['/_point2'].stateValues.xs[1].tree).eq(x);

    });


    cy.log("move point 2")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x = 9;
      let y = -1;

      components['/_point2'].movePoint({ x: y, y: x });

      expect(components['/_point1'].stateValues.xs[0].tree).eq(x);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(y);

      expect(components['/_point2'].stateValues.xs[0].tree).eq(y);
      expect(components['/_point2'].stateValues.xs[1].tree).eq(x);

    });
  })

  it('ref prop of refs', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math><ref prop="y">p1a</ref></math>

    <graph>
      <ref name="p1a">p1</ref>
    </graph>
    
    <graph>
      <point name="p1">
        <x>3</x>
        <y>7</y>
      </point>
    </graph>
  `}, "*");
    });


    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log("initial values")

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x = 3;
      let y = 7;

      expect(components['/p1'].stateValues.xs[0].tree).eq(x);
      expect(components['/p1'].stateValues.xs[1].tree).eq(y);

      expect(components['/p1a'].replacements[0].stateValues.xs[0].tree).eq(x);
      expect(components['/p1a'].replacements[0].stateValues.xs[1].tree).eq(y);

      expect(components['/_ref1'].replacements[0].stateValues.value.tree).eq(y);

    });

    cy.log("move point 1")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x = -3;
      let y = 5;

      components['/p1'].movePoint({ x: x, y: y });

      expect(components['/p1'].stateValues.xs[0].tree).eq(x);
      expect(components['/p1'].stateValues.xs[1].tree).eq(y);

      expect(components['/p1a'].replacements[0].stateValues.xs[0].tree).eq(x);
      expect(components['/p1a'].replacements[0].stateValues.xs[1].tree).eq(y);
      expect(components['/_ref1'].replacements[0].stateValues.value.tree).eq(y);

      cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(y.toString())
      })
    });

    cy.log("move point 2")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x = 7;
      let y = 9;

      components['/p1a'].replacements[0].movePoint({ x: x, y: y });

      expect(components['/p1'].stateValues.xs[0].tree).eq(x);
      expect(components['/p1'].stateValues.xs[1].tree).eq(y);

      expect(components['/p1a'].replacements[0].stateValues.xs[0].tree).eq(x);
      expect(components['/p1a'].replacements[0].stateValues.xs[1].tree).eq(y);
      expect(components['/_ref1'].replacements[0].stateValues.value.tree).eq(y);

      cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(y.toString())
      })
    });

  })

  it('nested refs', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <ref name="p1b">p1a</ref>
  </graph>
  
  <graph>
    <ref name="p1a">p1</ref>
  </graph>
  
  <graph>
    <point name="p1">
      <x>3</x>
      <y>7</y>
    </point>
  </graph>
  `}, "*");
    });


    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log("initial values")

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x = 3;
      let y = 7;

      expect(components['/p1'].stateValues.xs[0].tree).eq(x);
      expect(components['/p1'].stateValues.xs[1].tree).eq(y);

      expect(components['/p1a'].replacements[0].stateValues.xs[0].tree).eq(x);
      expect(components['/p1a'].replacements[0].stateValues.xs[1].tree).eq(y);

      expect(components['/p1b'].replacements[0].replacements[0].stateValues.xs[0].tree).eq(x);
      expect(components['/p1b'].replacements[0].replacements[0].stateValues.xs[1].tree).eq(y);

    });

    cy.log("move point 1")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x = -3;
      let y = 5;

      components['/p1'].movePoint({ x: x, y: y });

      expect(components['/p1'].stateValues.xs[0].tree).eq(x);
      expect(components['/p1'].stateValues.xs[1].tree).eq(y);

      expect(components['/p1a'].replacements[0].stateValues.xs[0].tree).eq(x);
      expect(components['/p1a'].replacements[0].stateValues.xs[1].tree).eq(y);

      expect(components['/p1b'].replacements[0].replacements[0].stateValues.xs[0].tree).eq(x);
      expect(components['/p1b'].replacements[0].replacements[0].stateValues.xs[1].tree).eq(y);

    });

    cy.log("move point 2")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x = 7;
      let y = 9;

      components['/p1a'].replacements[0].movePoint({ x: x, y: y });

      expect(components['/p1'].stateValues.xs[0].tree).eq(x);
      expect(components['/p1'].stateValues.xs[1].tree).eq(y);

      expect(components['/p1a'].replacements[0].stateValues.xs[0].tree).eq(x);
      expect(components['/p1a'].replacements[0].stateValues.xs[1].tree).eq(y);

      expect(components['/p1b'].replacements[0].replacements[0].stateValues.xs[0].tree).eq(x);
      expect(components['/p1b'].replacements[0].replacements[0].stateValues.xs[1].tree).eq(y);

    });


    cy.log("move point 3")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x = -4;
      let y = 0;

      components['/p1b'].replacements[0].replacements[0].movePoint({ x: x, y: y });

      expect(components['/p1'].stateValues.xs[0].tree).eq(x);
      expect(components['/p1'].stateValues.xs[1].tree).eq(y);

      expect(components['/p1a'].replacements[0].stateValues.xs[0].tree).eq(x);
      expect(components['/p1a'].replacements[0].stateValues.xs[1].tree).eq(y);

      expect(components['/p1b'].replacements[0].replacements[0].stateValues.xs[0].tree).eq(x);
      expect(components['/p1b'].replacements[0].replacements[0].stateValues.xs[1].tree).eq(y);

    });


  })

  it('points depending on each other', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point>
      <x><ref prop="y">_point2</ref></x>
      <y>7</y>
    </point>
    <point>
      <x><ref prop="y">_point1</ref></x>
      <y>9</y>
    </point>
  
  </graph>
      
  `}, "*");
    });


    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log("initial values")

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x = 9;
      let y = 7;

      expect(components['/_point1'].stateValues.xs[0].tree).eq(x);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(y);

      expect(components['/_point2'].stateValues.xs[0].tree).eq(y);
      expect(components['/_point2'].stateValues.xs[1].tree).eq(x);

    });

    cy.log("move point 1")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x = -3;
      let y = 5;

      components['/_point1'].movePoint({ x: x, y: y });

      expect(components['/_point1'].stateValues.xs[0].tree).eq(x);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(y);

      expect(components['/_point2'].stateValues.xs[0].tree).eq(y);
      expect(components['/_point2'].stateValues.xs[1].tree).eq(x);

    });

    cy.log("move point 2")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x = 7;
      let y = 9;

      components['/_point2'].movePoint({ x: y, y: x });

      expect(components['/_point1'].stateValues.xs[0].tree).eq(x);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(y);

      expect(components['/_point2'].stateValues.xs[0].tree).eq(y);
      expect(components['/_point2'].stateValues.xs[1].tree).eq(x);

    });


  })

  it('points depending on each other through intermediaries', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point>
      <x><ref prop="y">P2a</ref></x>
      <y>7</y>
    </point>
    <point>
      <x><ref prop="y">P1a</ref></x>
      <y>9</y>
    </point>
  </graph>
  
  <graph>
    <ref name="P1a">_point1</ref>
    <ref name="P2a">_point2</ref>
  </graph>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log("initial values")

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x = 9;
      let y = 7;

      expect(components['/_point1'].stateValues.xs[0].tree).eq(x);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(y);

      expect(components['/_point2'].stateValues.xs[0].tree).eq(y);
      expect(components['/_point2'].stateValues.xs[1].tree).eq(x);

      expect(components['/p1a'].replacements[0].stateValues.xs[0].tree).eq(x);
      expect(components['/p1a'].replacements[0].stateValues.xs[1].tree).eq(y);

      expect(components['/p2a'].replacements[0].stateValues.xs[0].tree).eq(y);
      expect(components['/p2a'].replacements[0].stateValues.xs[1].tree).eq(x);

    });

    cy.log("move point 1")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x = -3;
      let y = 5;

      components['/_point1'].movePoint({ x: x, y: y });

      expect(components['/_point1'].stateValues.xs[0].tree).eq(x);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(y);

      expect(components['/_point2'].stateValues.xs[0].tree).eq(y);
      expect(components['/_point2'].stateValues.xs[1].tree).eq(x);

      expect(components['/p1a'].replacements[0].stateValues.xs[0].tree).eq(x);
      expect(components['/p1a'].replacements[0].stateValues.xs[1].tree).eq(y);

      expect(components['/p2a'].replacements[0].stateValues.xs[0].tree).eq(y);
      expect(components['/p2a'].replacements[0].stateValues.xs[1].tree).eq(x);

    });

    cy.log("move point 2")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x = 7;
      let y = 9;

      components['/_point2'].movePoint({ x: y, y: x });

      expect(components['/_point1'].stateValues.xs[0].tree).eq(x);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(y);

      expect(components['/_point2'].stateValues.xs[0].tree).eq(y);
      expect(components['/_point2'].stateValues.xs[1].tree).eq(x);

      expect(components['/p1a'].replacements[0].stateValues.xs[0].tree).eq(x);
      expect(components['/p1a'].replacements[0].stateValues.xs[1].tree).eq(y);

      expect(components['/p2a'].replacements[0].stateValues.xs[0].tree).eq(y);
      expect(components['/p2a'].replacements[0].stateValues.xs[1].tree).eq(x);

    });


    cy.log("move point 3")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x = 6;
      let y = -1;

      components['/p1a'].replacements[0].movePoint({ x: x, y: y });

      expect(components['/_point1'].stateValues.xs[0].tree).eq(x);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(y);

      expect(components['/_point2'].stateValues.xs[0].tree).eq(y);
      expect(components['/_point2'].stateValues.xs[1].tree).eq(x);

      expect(components['/p1a'].replacements[0].stateValues.xs[0].tree).eq(x);
      expect(components['/p1a'].replacements[0].stateValues.xs[1].tree).eq(y);

      expect(components['/p2a'].replacements[0].stateValues.xs[0].tree).eq(y);
      expect(components['/p2a'].replacements[0].stateValues.xs[1].tree).eq(x);

    });


    cy.log("move point 4")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x = -3;
      let y = 2;

      components['/p2a'].replacements[0].movePoint({ x: y, y: x });

      expect(components['/_point1'].stateValues.xs[0].tree).eq(x);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(y);

      expect(components['/_point2'].stateValues.xs[0].tree).eq(y);
      expect(components['/_point2'].stateValues.xs[1].tree).eq(x);

      expect(components['/p1a'].replacements[0].stateValues.xs[0].tree).eq(x);
      expect(components['/p1a'].replacements[0].stateValues.xs[1].tree).eq(y);

      expect(components['/p2a'].replacements[0].stateValues.xs[0].tree).eq(y);
      expect(components['/p2a'].replacements[0].stateValues.xs[1].tree).eq(x);

    });


  })

  it('points depending on each other, one using coords', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point>
      (<ref prop="y">_point2</ref>,7)
    </point>
    <point>
      <x><ref prop="y">_point1</ref></x>
      <y>9</y>
    </point>
  
  </graph>
  `}, "*");
    });


    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log("initial values")

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x = 9;
      let y = 7;

      expect(components['/_point1'].stateValues.xs[0].tree).eq(x);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(y);

      expect(components['/_point2'].stateValues.xs[0].tree).eq(y);
      expect(components['/_point2'].stateValues.xs[1].tree).eq(x);

    });

    cy.log("move point 1")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x = -3;
      let y = 5;

      components['/_point1'].movePoint({ x: x, y: y });

      expect(components['/_point1'].stateValues.xs[0].tree).eq(x);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(y);

      expect(components['/_point2'].stateValues.xs[0].tree).eq(y);
      expect(components['/_point2'].stateValues.xs[1].tree).eq(x);

    });

    cy.log("move point 2")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x = 7;
      let y = 9;

      components['/_point2'].movePoint({ x: y, y: x });

      expect(components['/_point1'].stateValues.xs[0].tree).eq(x);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(y);

      expect(components['/_point2'].stateValues.xs[0].tree).eq(y);
      expect(components['/_point2'].stateValues.xs[1].tree).eq(x);

    });


  })

  it('points depending original graph axis limit', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point>
      <x>3</x>
      <y><ref prop="ymax" fixed="true">_graph1</ref></y>
    </point>
    <point>
      (<ref prop="xmin" fixed="true">_graph1</ref>,5)
    </point>
  </graph>
  `}, "*");
    });


    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log("initial values")

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x1 = 3;
      let y1 = 10;
      let x2 = -10
      let y2 = 5;

      expect(components['/_point1'].stateValues.xs[0].tree).eq(x1);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(y1);

      expect(components['/_point2'].stateValues.xs[0].tree).eq(x2);
      expect(components['/_point2'].stateValues.xs[1].tree).eq(y2);

    });

    cy.log("move points")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x1 = 1;
      let y1 = 5;
      let x2 = 8
      let y2 = -3;

      components['/_point1'].movePoint({ x: x1, y: y1 });
      components['/_point2'].movePoint({ x: x2, y: y2 });

      expect(components['/_point1'].stateValues.xs[0].tree).eq(x1);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(10);

      expect(components['/_point2'].stateValues.xs[0].tree).eq(-10);
      expect(components['/_point2'].stateValues.xs[1].tree).eq(y2);

    });


  })

  it('label points by combining coordinates with other point', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point>
      <label><ref prop="x" displaydigits="3">_point1</ref>, <ref prop="x" displaydigits="3">_point2</ref></label>
      (1,2)
    </point>
    <point>
      <label><ref prop="y" displaydigits="3">_point1</ref>, <ref prop="y" displaydigits="3">_point2</ref></label>
      (3,4)
    </point>
  </graph>

  <p>Label 1: <ref prop="label">_point1</ref></p>
  <p>Label 2: <ref prop="label">_point2</ref></p>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log("initial values")

    cy.get('#\\/_p1').should('have.text', 'Label 1: 1, 3')
    cy.get('#\\/_p2').should('have.text', 'Label 2: 2, 4')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x1 = 1;
      let y1 = 2;
      let x2 = 3;
      let y2 = 4;

      let label1 = `${x1}, ${x2}`;
      let label2 = `${y1}, ${y2}`;

      expect(components['/_point1'].stateValues.xs[0].tree).eq(x1);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(y1);

      expect(components['/_point2'].stateValues.xs[0].tree).eq(x2);
      expect(components['/_point2'].stateValues.xs[1].tree).eq(y2);

      expect(components['/_point1'].stateValues.label).eq(label1);
      expect(components['/_point2'].stateValues.label).eq(label2);

    });

    cy.log("move points")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x1 = 1;
      let y1 = 5;
      let x2 = 8
      let y2 = -3;

      components['/_point1'].movePoint({ x: x1, y: y1 });
      components['/_point2'].movePoint({ x: x2, y: y2 });

      let label1 = `${x1}, ${x2}`;
      let label2 = `${y1}, ${y2}`;

      expect(components['/_point1'].stateValues.xs[0].tree).eq(x1);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(y1);

      expect(components['/_point2'].stateValues.xs[0].tree).eq(x2);
      expect(components['/_point2'].stateValues.xs[1].tree).eq(y2);

      expect(components['/_point1'].stateValues.label).eq(label1);
      expect(components['/_point2'].stateValues.label).eq(label2);

      cy.get('#\\/_p1').should('have.text', `Label 1: ${label1}`)
      cy.get('#\\/_p2').should('have.text', `Label 2: ${label2}`)

    });


    cy.log("move points to fractional coordinates")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x1 = 3.12552502;
      let y1 = -3.4815436398;
      let x2 = 0.36193540738
      let y2 = 7.813395519475;

      components['/_point1'].movePoint({ x: x1, y: y1 });
      components['/_point2'].movePoint({ x: x2, y: y2 });

      let x1round = me.fromAst(x1).round_numbers_to_precision(3).tree;
      let y1round = me.fromAst(y1).round_numbers_to_precision(3).tree;
      let x2round = me.fromAst(x2).round_numbers_to_precision(3).tree;
      let y2round = me.fromAst(y2).round_numbers_to_precision(3).tree;

      let label1 = `${x1round}, ${x2round}`;
      let label2 = `${y1round}, ${y2round}`;

      expect(components['/_point1'].stateValues.xs[0].tree).eq(x1);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(y1);

      expect(components['/_point2'].stateValues.xs[0].tree).eq(x2);
      expect(components['/_point2'].stateValues.xs[1].tree).eq(y2);

      expect(components['/_point1'].stateValues.label).eq(label1);
      expect(components['/_point2'].stateValues.label).eq(label2);

      cy.get('#\\/_p1').should('have.text', `Label 1: ${label1}`)
      cy.get('#\\/_p2').should('have.text', `Label 2: ${label2}`)

    });

  })


  it('update point with constraints', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
      <point>
        <attractTo><point>(1,-7)</point></attractTo>
        (-4,1)
      </point>
      <point>
        <x><ref prop="x">_point1</ref></x>
        <y fixed>0</y>
      </point>
        <point>
        <y><ref prop="y">_point1</ref></y>
        <x fixed>0</x>
      </point>
    </graph>
  `}, "*");
    });

    cy.get("#\\/_text1").should('have.text', 'a'); // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x = -4;
      let y = 1;

      expect(components['/_point1'].stateValues.xs[0].tree).eq(x);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(y);
      expect(components['/_point3'].stateValues.xs[0].tree).eq(x);
      expect(components['/_point3'].stateValues.xs[1].tree).eq(0);
      expect(components['/_point4'].stateValues.xs[0].tree).eq(0);
      expect(components['/_point4'].stateValues.xs[1].tree).eq(y);

    });

    cy.log("move first point")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x = 3;
      let y = -2;

      components['/_point1'].movePoint({ x: x, y: y });

      expect(components['/_point1'].stateValues.xs[0].tree).eq(x);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(y);
      expect(components['/_point3'].stateValues.xs[0].tree).eq(x);
      expect(components['/_point3'].stateValues.xs[1].tree).eq(0);
      expect(components['/_point4'].stateValues.xs[0].tree).eq(0);
      expect(components['/_point4'].stateValues.xs[1].tree).eq(y);

    });

    cy.log("move x-axis point")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x = 9;
      let y = -2;

      components['/_point3'].movePoint({ x: x, y: -3 });

      expect(components['/_point1'].stateValues.xs[0].tree).eq(x);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(y);
      expect(components['/_point3'].stateValues.xs[0].tree).eq(x);
      expect(components['/_point3'].stateValues.xs[1].tree).eq(0);
      expect(components['/_point4'].stateValues.xs[0].tree).eq(0);
      expect(components['/_point4'].stateValues.xs[1].tree).eq(y);

    });

    cy.log("move y-axis point")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x = 9;
      let y = -7.1;

      components['/_point4'].movePoint({ x: -10, y: y });

      expect(components['/_point1'].stateValues.xs[0].tree).eq(x);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(y);
      expect(components['/_point3'].stateValues.xs[0].tree).eq(x);
      expect(components['/_point3'].stateValues.xs[1].tree).eq(0);
      expect(components['/_point4'].stateValues.xs[0].tree).eq(0);
      expect(components['/_point4'].stateValues.xs[1].tree).eq(y);

    });

    cy.log("move near attractor")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x = 1;
      let y = -7;

      components['/_point3'].movePoint({ x: 0.9, y: 6 });

      expect(components['/_point1'].stateValues.xs[0].tree).eq(x);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(y);
      expect(components['/_point3'].stateValues.xs[0].tree).eq(x);
      expect(components['/_point3'].stateValues.xs[1].tree).eq(0);
      expect(components['/_point4'].stateValues.xs[0].tree).eq(0);
      expect(components['/_point4'].stateValues.xs[1].tree).eq(y);

    });

    cy.log("move again near attract to make sure doesn't change")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x = 1;
      let y = -7;

      components['/_point3'].movePoint({ x: 1.1, y: 6 });

      expect(components['/_point1'].stateValues.xs[0].tree).eq(x);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(y);
      expect(components['/_point3'].stateValues.xs[0].tree).eq(x);
      expect(components['/_point3'].stateValues.xs[1].tree).eq(0);
      expect(components['/_point4'].stateValues.xs[0].tree).eq(0);
      expect(components['/_point4'].stateValues.xs[1].tree).eq(y);

    });
  })

})
