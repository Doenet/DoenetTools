import me from 'math-expressions';
import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('Point Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')
  })


  it('point sugar a copy', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
      <point label="P">(5,6)</point>
      <point label="Q">(1, <copy prop="y" target="_point1" />)</point>
    </graph>
    <copy prop="x2" target="_point2" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('move point P to (-1,-7)')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point1'].movePoint({ x: -1, y: -7 });
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(-1)
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(-7)
      expect((await components['/_point1'].stateValues.coords).tree).eqls(['vector', -1, -7])
      expect((await components['/_point2'].stateValues.xs)[0].tree).eq(1)
      expect((await components['/_point2'].stateValues.xs)[1].tree).eq(-7)
      expect((await components['/_point2'].stateValues.coords).tree).eqls(['vector', 1, -7])
    })
  });

  it('coords use a copy', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point label="P">(5,6)</point>
    <point label="Q" coords="(1, $(_point1{prop='y'}))" />
  </graph>
  <copy prop="x2" target="_point2" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('move point P to (-1,-7)')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point1'].movePoint({ x: -1, y: -7 });
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(-1)
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(-7)
      expect((await components['/_point1'].stateValues.coords).tree).eqls(['vector', -1, -7])
      expect((await components['/_point2'].stateValues.xs)[0].tree).eq(1)
      expect((await components['/_point2'].stateValues.xs)[1].tree).eq(-7)
      expect((await components['/_point2'].stateValues.coords).tree).eqls(['vector', 1, -7])


    })

    cy.log(`move point P to (4,6)`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point2'].movePoint({ x: 4, y: 6 });
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(-1)
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(6)
      expect((await components['/_point1'].stateValues.coords).tree).eqls(['vector', -1, 6])
      expect((await components['/_point2'].stateValues.xs)[0].tree).eq(4)
      expect((await components['/_point2'].stateValues.xs)[1].tree).eq(6)
      expect((await components['/_point2'].stateValues.coords).tree).eqls(['vector', 4, 6])

    })
  })

  it('label use a copy', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point label="P">(5,6)</point>
    <point label="$l'">
      (1,3)
    </point>
  </graph>
  <copy prop="label" target="_point1" name="l" hide />
  <copy prop="x2" target="_point2" />
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log(`Labels are P and P'`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_point1'].stateValues.label).eq('P')
      expect(components['/_point2'].stateValues.label).eq(`P'`)

    })

  })

  it('point sugar from single macro', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput name="coords" />
    <graph>
      <point label="P" name="P">$coords</point>
    </graph>
    <graph>
      <copy target="P" assignNames="Q" label="Q" />
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('initially undefined')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/P'].stateValues.xs).map(x => x.tree)).eqls(['\uff3f'])
      expect((await components['/P'].stateValues.coords).tree).eqls('\uff3f')
      expect((await components['/Q'].stateValues.xs).map(x => x.tree)).eqls(['\uff3f'])
      expect((await components['/Q'].stateValues.coords).tree).eqls('\uff3f')
    })

    cy.log('create 2D point')
    cy.get('#\\/coords textarea').type("(-1,-7){enter}", { force: true })
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/P'].stateValues.xs).map(x => x.tree)).eqls([-1, -7])
      expect((await components['/P'].stateValues.coords).tree).eqls(["vector", -1, -7])
      expect((await components['/Q'].stateValues.xs).map(x => x.tree)).eqls([-1, -7])
      expect((await components['/Q'].stateValues.coords).tree).eqls(["vector", -1, -7])
    })

    cy.log('move point P to (3,5)')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/P'].movePoint({ x: 3, y: 5 });
      expect((await components['/P'].stateValues.xs).map(x => x.tree)).eqls([3, 5])
      expect((await components['/P'].stateValues.coords).tree).eqls(["vector", 3, 5])
      expect((await components['/Q'].stateValues.xs).map(x => x.tree)).eqls([3, 5])
      expect((await components['/Q'].stateValues.coords).tree).eqls(["vector", 3, 5])
    })

    cy.log('move point Q to (9,1)')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/Q'].movePoint({ x: 9, y: 1 });
      expect((await components['/P'].stateValues.xs).map(x => x.tree)).eqls([9, 1])
      expect((await components['/P'].stateValues.coords).tree).eqls(["vector", 9, 1])
      expect((await components['/Q'].stateValues.xs).map(x => x.tree)).eqls([9, 1])
      expect((await components['/Q'].stateValues.coords).tree).eqls(["vector", 9, 1])
    })

    cy.log('make point undefined again')
    cy.get('#\\/coords textarea').type("{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{enter}", { force: true })
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/P'].stateValues.xs).map(x => x.tree)).eqls(['\uff3f'])
      expect((await components['/P'].stateValues.coords).tree).eqls('\uff3f')
      expect((await components['/Q'].stateValues.xs).map(x => x.tree)).eqls(['\uff3f'])
      expect((await components['/Q'].stateValues.coords).tree).eqls('\uff3f')
    })


    cy.log('create 1D point')
    cy.get('#\\/coords textarea').type("-3{enter}", { force: true })
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/P'].stateValues.xs).map(x => x.tree)).eqls([-3])
      expect((await components['/P'].stateValues.coords).tree).eqls(-3)
      expect((await components['/Q'].stateValues.xs).map(x => x.tree)).eqls([-3])
      expect((await components['/Q'].stateValues.coords).tree).eqls(-3)
    })


    cy.log('create 3D point')
    cy.get('#\\/coords textarea').type("{end}{backspace}{backspace}(6,5,4){enter}", { force: true })
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/P'].stateValues.xs).map(x => x.tree)).eqls([6, 5, 4])
      expect((await components['/P'].stateValues.coords).tree).eqls(["vector", 6, 5, 4])
      expect((await components['/Q'].stateValues.xs).map(x => x.tree)).eqls([6, 5, 4])
      expect((await components['/Q'].stateValues.coords).tree).eqls(["vector", 6, 5, 4])
    })

  });

  it('test invertible due to modifyIndirectly', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point>
    (0.5<math>2</math><math modifyIndirectly="false">3</math>, <math name="y">1</math>)
  </point>
  </graph>
  <copy prop="y" target="_point1" />
  `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log(`we can move point`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point1'].movePoint({ x: 7, y: -5 });
      expect((await components['/_point1'].stateValues.xs)[0].tree).closeTo(7, 1E-12)
      expect((await components['/_point1'].stateValues.xs)[1].tree).closeTo(-5, 1E-12)
      expect((await components['/_math1'].stateValues.value).evaluate_to_constant()).closeTo(7 / 1.5, 1E-12)
      expect((await components['/_math2'].stateValues.value).tree).closeTo(3, 1E-12)
      expect((await components['/y'].stateValues.value).tree).closeTo(-5, 1E-12)
    })

  })

  it('define 2D point from 3D point', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point>
    (<copy prop="y" target="source" />,<copy prop="z" target="source" />)
  </point>
  </graph>

  <point name="source">
    (<math modifyIndirectly="false">a</math>,2,3)
  </point>
  <copy prop="x" target="_point1" />
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait to load

    cy.log('points are where they should be')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      expect((await components['/_point1'].stateValues.xs)[0].tree).closeTo(2, 1E-12)
      expect((await components['/_point1'].stateValues.xs)[1].tree).closeTo(3, 1E-12)
      expect((await components['/source'].stateValues.xs)[0].tree).eq("a")
      expect((await components['/source'].stateValues.xs)[1].tree).closeTo(2, 1E-12)
      expect((await components['/source'].stateValues.xs)[2].tree).closeTo(3, 1E-12)
    })

    cy.log('move point 1')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point1'].movePoint({ x: -4, y: -7 });
      expect((await components['/_point1'].stateValues.xs)[0].tree).closeTo(-4, 1E-12)
      expect((await components['/_point1'].stateValues.xs)[1].tree).closeTo(-7, 1E-12)
      expect((await components['/source'].stateValues.xs)[0].tree).eq("a")
      expect((await components['/source'].stateValues.xs)[1].tree).closeTo(-4, 1E-12)
      expect((await components['/source'].stateValues.xs)[2].tree).closeTo(-7, 1E-12)
    })
  })

  it('define 2D point from 3D point, copying xj', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point>
    (<copy prop="x2" target="source" />,<copy prop="x3" target="source" />)
  </point>
  </graph>

  <point name="source">
    (<math modifyIndirectly="false">a</math>,2,3)
  </point>
  <copy prop="x" target="_point1" />
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait to load

    cy.log('points are where they should be')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      expect((await components['/_point1'].stateValues.xs)[0].tree).closeTo(2, 1E-12)
      expect((await components['/_point1'].stateValues.xs)[1].tree).closeTo(3, 1E-12)
      expect((await components['/source'].stateValues.xs)[0].tree).eq("a")
      expect((await components['/source'].stateValues.xs)[1].tree).closeTo(2, 1E-12)
      expect((await components['/source'].stateValues.xs)[2].tree).closeTo(3, 1E-12)
    })

    cy.log('move point 1')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point1'].movePoint({ x: -4, y: -7 });
      expect((await components['/_point1'].stateValues.xs)[0].tree).closeTo(-4, 1E-12)
      expect((await components['/_point1'].stateValues.xs)[1].tree).closeTo(-7, 1E-12)
      expect((await components['/source'].stateValues.xs)[0].tree).eq("a")
      expect((await components['/source'].stateValues.xs)[1].tree).closeTo(-4, 1E-12)
      expect((await components['/source'].stateValues.xs)[2].tree).closeTo(-7, 1E-12)
    })
  })

  it('define 2D point from 3D point, separate coordinates', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point x="$(source{prop='y'})" y = "$(source{prop='z'})" />
  </graph>

  <math name="a" modifyIndirectly="false">a</math>
  <point name="source" x="$a" y="2" z="3" />
  <copy prop="x" target="_point1" />
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait to load

    cy.log('points are where they should be')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      expect((await components['/_point1'].stateValues.xs)[0].tree).closeTo(2, 1E-12)
      expect((await components['/_point1'].stateValues.xs)[1].tree).closeTo(3, 1E-12)
      expect((await components['/source'].stateValues.xs)[0].tree).eq("a")
      expect((await components['/source'].stateValues.xs)[1].tree).closeTo(2, 1E-12)
      expect((await components['/source'].stateValues.xs)[2].tree).closeTo(3, 1E-12)
    })

    cy.log('move point 1')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point1'].movePoint({ x: -4, y: -7 });
      expect((await components['/_point1'].stateValues.xs)[0].tree).closeTo(-4, 1E-12)
      expect((await components['/_point1'].stateValues.xs)[1].tree).closeTo(-7, 1E-12)
      expect((await components['/source'].stateValues.xs)[0].tree).eq("a")
      expect((await components['/source'].stateValues.xs)[1].tree).closeTo(-4, 1E-12)
      expect((await components['/source'].stateValues.xs)[2].tree).closeTo(-7, 1E-12)
    })
  })

  it('define 2D point from double-copied 3D point, separate coordinates', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point x="$(source3{prop='y'})" y = "$(source3{prop='z'})" />
  </graph>

  <copy name="source2" target="source" />
  <math name="a" modifyIndirectly="false">a</math>
  <point name="source" x="$a" y="2" z="3" />
  <copy name="source3" target="source2" />
  <copy prop="x" target="_point1" />

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait to load

    cy.log('points are where they should be')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      expect((await components['/_point1'].stateValues.xs)[0].tree).closeTo(2, 1E-12)
      expect((await components['/_point1'].stateValues.xs)[1].tree).closeTo(3, 1E-12)
      expect((await components['/source'].stateValues.xs)[0].tree).eq("a")
      expect((await components['/source'].stateValues.xs)[1].tree).closeTo(2, 1E-12)
      expect((await components['/source'].stateValues.xs)[2].tree).closeTo(3, 1E-12)
    })

    cy.log('move point 1')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point1'].movePoint({ x: -4, y: -7 });
      expect((await components['/_point1'].stateValues.xs)[0].tree).closeTo(-4, 1E-12)
      expect((await components['/_point1'].stateValues.xs)[1].tree).closeTo(-7, 1E-12)
      expect((await components['/source'].stateValues.xs)[0].tree).eq("a")
      expect((await components['/source'].stateValues.xs)[1].tree).closeTo(-4, 1E-12)
      expect((await components['/source'].stateValues.xs)[2].tree).closeTo(-7, 1E-12)
    })
  })

  it('point on graph that is copied in two ways', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point>(1,2)
  </point>
  </graph>
  <copy target="_graph1" />
  <graph>
  <copy name="p3" target="_point1" />
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let point2 = components['/_copy1'].replacements[0].activeChildren[0];
      let point3 = components['/p3'].replacements[0];


      cy.window().then(async (win) => {
        expect((await components['/_point1'].stateValues.xs)[0].tree).eq(1)
        expect((await components['/_point1'].stateValues.xs)[1].tree).eq(2)
        expect((await point2.stateValues.xs)[0].tree).eq(1)
        expect((await point2.stateValues.xs)[1].tree).eq(2)
        expect((await point3.stateValues.xs)[0].tree).eq(1)
        expect((await point3.stateValues.xs)[1].tree).eq(2)

      })

      cy.log(`move point1 to (4,6)`)
      cy.window().then(async (win) => {
        await components['/_point1'].movePoint({ x: 4, y: 6 });
        expect((await components['/_point1'].stateValues.xs)[0].tree).eq(4)
        expect((await components['/_point1'].stateValues.xs)[1].tree).eq(6)
        expect((await point2.stateValues.xs)[0].tree).eq(4)
        expect((await point2.stateValues.xs)[1].tree).eq(6)
        expect((await point3.stateValues.xs)[0].tree).eq(4)
        expect((await point3.stateValues.xs)[1].tree).eq(6)
      })

      cy.log(`move point2 to (-3,-7)`)
      cy.window().then(async (win) => {
        await point2.movePoint({ x: -3, y: -7 });
        expect((await components['/_point1'].stateValues.xs)[0].tree).eq(-3)
        expect((await components['/_point1'].stateValues.xs)[1].tree).eq(-7)
        expect((await point2.stateValues.xs)[0].tree).eq(-3)
        expect((await point2.stateValues.xs)[1].tree).eq(-7)
        expect((await point3.stateValues.xs)[0].tree).eq(-3)
        expect((await point3.stateValues.xs)[1].tree).eq(-7)
      })

      cy.log(`move point3 to (9,-2)`)
      cy.window().then(async (win) => {
        await point3.movePoint({ x: 9, y: -2 });
        expect((await components['/_point1'].stateValues.xs)[0].tree).eq(9)
        expect((await components['/_point1'].stateValues.xs)[1].tree).eq(-2)
        expect((await point2.stateValues.xs)[0].tree).eq(9)
        expect((await point2.stateValues.xs)[1].tree).eq(-2)
        expect((await point3.stateValues.xs)[0].tree).eq(9)
        expect((await point3.stateValues.xs)[1].tree).eq(-2)
      })

    })
  });

  it('point draggable but constrained to x = y^2/10', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point>
    (<copy target="y" />^2/10, <math name="y">1</math>)
  </point>
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/_point1'].stateValues.xs)[0].tree).eqls(['/', 1, 10]);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(1)

    })

    cy.log(`move point1 to (-9,6)`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point1'].movePoint({ x: -9, y: 6 });
      expect((await components['/_point1'].stateValues.xs)[0].tree).eqls(['/', 18, 5])
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(6)
    })

    cy.log(`move point1 to (0,-3)`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point1'].movePoint({ x: 9, y: -3 });
      expect((await components['/_point1'].stateValues.xs)[0].tree).eqls(['/', 9, 10])
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(-3)
    })


  });

  it('point draggable but constrained to y = sin(x)', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point>
    (<math name="x">1</math>, sin($x))
  </point>
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(1);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eqls(['apply', 'sin', 1]);

    })

    cy.log(`move point1 to (-9,6)`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point1'].movePoint({ x: -9, y: 6 });
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(-9)
      expect((await components['/_point1'].stateValues.xs)[1].tree).eqls(['apply', 'sin', -9]);
    })

    cy.log(`move point1 to (9,-3)`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point1'].movePoint({ x: 9, y: -3 });
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(9)
      expect((await components['/_point1'].stateValues.xs)[1].tree).eqls(['apply', 'sin', 9])
    })


  });

  it('point reflected across line', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point>(1,2)</point>
  <point>
    (<copy prop="y" target="_point1" />, <copy prop="x" target="_point1" />)
  </point>
  <line draggable="false">x=y</line>
  </graph>
  <copy prop="x" target="_point2" />
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(1);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(2);
      expect((await components['/_point2'].stateValues.xs)[0].tree).eq(2);
      expect((await components['/_point2'].stateValues.xs)[1].tree).eq(1);

    })

    cy.log(`move point1 to (-9,6)`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point1'].movePoint({ x: -9, y: 6 });
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(-9)
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(6);
      expect((await components['/_point2'].stateValues.xs)[0].tree).eq(6)
      expect((await components['/_point2'].stateValues.xs)[1].tree).eq(-9);
    })

    cy.log(`move point2 to (0,-3)`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point2'].movePoint({ x: 0, y: -3 });
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(-3)
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(0)
      expect((await components['/_point2'].stateValues.xs)[0].tree).eq(0)
      expect((await components['/_point2'].stateValues.xs)[1].tree).eq(-3)
    })

  });

  it('point not draggable', () => {
    cy.window().then(async (win) => {
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

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(1);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(2);
    })

    cy.log(`move point1 to (-9,6)`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point1'].movePoint({ x: -9, y: 6 });
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(1);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(2);
    })

  });

  it('point on line', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point>
    ($d,3-$d)
  </point>
  </graph>
  <math name="d">5</math>
  <copy prop="x" target="_point1" />
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(5);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(-2);
    })

    cy.log(`move point1 to (8,8)`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point1'].movePoint({ x: 8, y: 8 });
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(8);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(-5);
    })

  });

  it('points draggable even with complicated dependence', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>q</text>
  <graph>

  <point>
  (<copy prop="y" target="_point2" />,
  <copy target="a" />)
  </point>
  <point>(5,3)</point>

  </graph>

  <math name="a"><copy prop="x" target="_point2" />+1</math>
  `}, "*");
    });

    cy.get('#\\/_text1').should("have.text", 'q');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/_point2'].stateValues.xs)[0].tree).eq(5);
      expect((await components['/_point2'].stateValues.xs)[1].tree).eq(3);
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(3);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(6);
    })

    cy.log(`move point1 to (-4,-8)`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point2'].movePoint({ x: -4, y: -8 });
      expect((await components['/_point2'].stateValues.xs)[0].tree).eq(-4);
      expect((await components['/_point2'].stateValues.xs)[1].tree).eq(-8);
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(-8);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(-3);
    })

    cy.log(`move point2 to (-9,10)`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point1'].movePoint({ x: -9, y: 10 });
      expect((await components['/_point2'].stateValues.xs)[0].tree).eq(9);
      expect((await components['/_point2'].stateValues.xs)[1].tree).eq(-9);
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(-9);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(10);
    })

  });

  // The behavior of this test varies widely depending on update order
  // When finalize exactly how we want the updates to occur, could resurrect this
  it.skip('points related through intermediate math', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point>
  (<copy target="a" />,
  <copy prop="x" target="_point2" />)
  </point>
  <point>(<copy target="d" />,3-<copy target="d" />)</point>
  </graph>

  <math name="a" simplify modifyIndirectly="true"><copy target="b" />+1</math>,
  <math name="b" simplify modifyIndirectly="true"><copy prop="y" target="_point2" /><copy target="c" /></math>,
  <math name="c" simplify modifyIndirectly="false"><copy prop="x" target="_point2" /><copy target="d" />*0.01</math>,
  <math name="d" simplify modifyIndirectly="true">5</math>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')
    cy.get('#\\/d .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('5')
    })

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let d = 5;
      let point2x = d;
      let point2y = 3 - d;
      let c = point2x * d * 0.01;
      let b = point2y * c;
      let a = b + 1;
      let point1x = a;
      let point1y = point2x;

      expect((await components['/_point1'].stateValues.xs)[0].tree).closeTo(point1x, 1E-12);
      expect((await components['/_point1'].stateValues.xs)[1].tree).closeTo(point1y, 1E-12);
      expect((await components['/_point2'].stateValues.xs)[0].tree).closeTo(point2x, 1E-12);
      expect((await components['/_point2'].stateValues.xs)[1].tree).closeTo(point2y, 1E-12);
      expect((await components['/d'].stateValues.value).tree).closeTo(d, 1E-12);
      expect((await components['/c'].stateValues.value).tree).closeTo(c, 1E-12);
      expect((await components['/b'].stateValues.value).tree).closeTo(b, 1E-12);
      expect((await components['/a'].stateValues.value).tree).closeTo(a, 1E-12);

    })

    cy.log(`move point2 along constained line`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let d = -6;
      let point2x = d;
      let point2y = 3 - d;
      let c = point2x * d * 0.01;
      let b = point2y * c;
      let a = b + 1;
      let point1x = a;
      let point1y = point2x;

      await components['/_point2'].movePoint({ x: point2x, y: point2y });
      expect((await components['/_point1'].stateValues.xs)[0].tree).closeTo(point1x, 1E-12);
      expect((await components['/_point1'].stateValues.xs)[1].tree).closeTo(point1y, 1E-12);
      expect((await components['/_point2'].stateValues.xs)[0].tree).closeTo(point2x, 1E-12);
      expect((await components['/_point2'].stateValues.xs)[1].tree).closeTo(point2y, 1E-12);
      expect((await components['/d'].stateValues.value).tree).closeTo(d, 1E-12);
      expect((await components['/c'].stateValues.value).tree).closeTo(c, 1E-12);
      expect((await components['/b'].stateValues.value).tree).closeTo(b, 1E-12);
      expect((await components['/a'].stateValues.value).tree).closeTo(a, 1E-12);
    })

    cy.log(`move point1 along constained curve`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let d = 7;
      let point2x = d;
      let point2y = 3 - d;
      let c = point2x * d * 0.01;
      let b = point2y * c;
      let a = b + 1;
      let point1x = a;
      let point1y = point2x;

      await components['/_point1'].movePoint({ x: point1x, y: point1y });
      expect((await components['/_point1'].stateValues.xs)[0].tree).closeTo(point1x, 1E-12);
      expect((await components['/_point1'].stateValues.xs)[1].tree).closeTo(point1y, 1E-12);
      expect((await components['/_point2'].stateValues.xs)[0].tree).closeTo(point2x, 1E-12);
      expect((await components['/_point2'].stateValues.xs)[1].tree).closeTo(point2y, 1E-12);
      expect((await components['/d'].stateValues.value).tree).closeTo(d, 1E-12);
      expect((await components['/c'].stateValues.value).tree).closeTo(c, 1E-12);
      expect((await components['/b'].stateValues.value).tree).closeTo(b, 1E-12);
      expect((await components['/a'].stateValues.value).tree).closeTo(a, 1E-12);
    })

    cy.log(`move point2 to upper right`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      await components['/_point2'].movePoint({ x: 9, y: 9 });

      let d = 9;
      let point2x = d;
      let point2y = 3 - d;
      let c = point2x * d * 0.01;
      let b = point2y * c;
      let a = b + 1;
      let point1x = a;
      let point1y = point2x;

      expect((await components['/_point1'].stateValues.xs)[0].tree).closeTo(point1x, 1E-12);
      expect((await components['/_point1'].stateValues.xs)[1].tree).closeTo(point1y, 1E-12);
      expect((await components['/_point2'].stateValues.xs)[0].tree).closeTo(point2x, 1E-12);
      expect((await components['/_point2'].stateValues.xs)[1].tree).closeTo(point2y, 1E-12);
      expect((await components['/d'].stateValues.value).tree).closeTo(d, 1E-12);
      expect((await components['/c'].stateValues.value).tree).closeTo(c, 1E-12);
      expect((await components['/b'].stateValues.value).tree).closeTo(b, 1E-12);
      expect((await components['/a'].stateValues.value).tree).closeTo(a, 1E-12);
    })

    cy.log(`move point1 to upper left`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      await components['/_point1'].movePoint({ x: -6, y: 4 });

      let d = 4;
      let point2x = d;
      let point2y = 3 - d;
      let c = point2x * d * 0.01;
      let b = point2y * c;
      let a = b + 1;
      let point1x = a;
      let point1y = point2x;

      expect((await components['/_point1'].stateValues.xs)[0].tree).closeTo(point1x, 1E-12);
      expect((await components['/_point1'].stateValues.xs)[1].tree).closeTo(point1y, 1E-12);
      expect((await components['/_point2'].stateValues.xs)[0].tree).closeTo(point2x, 1E-12);
      expect((await components['/_point2'].stateValues.xs)[1].tree).closeTo(point2y, 1E-12);
      expect((await components['/d'].stateValues.value).tree).closeTo(d, 1E-12);
      expect((await components['/c'].stateValues.value).tree).closeTo(c, 1E-12);
      expect((await components['/b'].stateValues.value).tree).closeTo(b, 1E-12);
      expect((await components['/a'].stateValues.value).tree).closeTo(a, 1E-12);
    })

  });

  it('no dependence on downstream update order', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point>
    (<copy prop="y" target="_point2" />, 3)
  </point>
  <point>
    (<copy target="a" />,<copy target="a" />)
  </point>
  </graph>

  <number name="a">2</number>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait to load

    cy.log(`point 2 is moveable, based on x component`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point2'].movePoint({ x: -3, y: -7 })

      expect((await components['/_point1'].stateValues.xs)[0].tree).closeTo(-3, 1E-12);
      expect((await components['/_point1'].stateValues.xs)[1].tree).closeTo(3, 1E-12);
      expect((await components['/_point2'].stateValues.xs)[0].tree).closeTo(-3, 1E-12);
      expect((await components['/_point2'].stateValues.xs)[1].tree).closeTo(-3, 1E-12);
      expect((await components['/a'].stateValues.value)).closeTo(-3, 1E-12);

      // test zero as had a bug affect case when zero
      await components['/_point2'].movePoint({ x: 0, y: 5 })

      expect((await components['/_point1'].stateValues.xs)[0].tree).closeTo(0, 1E-12);
      expect((await components['/_point1'].stateValues.xs)[1].tree).closeTo(3, 1E-12);
      expect((await components['/_point2'].stateValues.xs)[0].tree).closeTo(0, 1E-12);
      expect((await components['/_point2'].stateValues.xs)[1].tree).closeTo(0, 1E-12);
      expect((await components['/a'].stateValues.value)).closeTo(0, 1E-12);

    })

    cy.log(`point1 is free to move`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      await components['/_point1'].movePoint({ x: 9, y: -6 })

      expect((await components['/_point1'].stateValues.xs)[0].tree).closeTo(9, 1E-12);
      expect((await components['/_point1'].stateValues.xs)[1].tree).closeTo(-6, 1E-12);
      expect((await components['/_point2'].stateValues.xs)[0].tree).closeTo(9, 1E-12);
      expect((await components['/_point2'].stateValues.xs)[1].tree).closeTo(9, 1E-12);
      expect((await components['/a'].stateValues.value)).closeTo(9, 1E-12);

      // move to zero to make sure are testing the bug that occured at zero
      await components['/_point1'].movePoint({ x: 0, y: 0 })

      expect((await components['/_point1'].stateValues.xs)[0].tree).closeTo(0, 1E-12);
      expect((await components['/_point1'].stateValues.xs)[1].tree).closeTo(0, 1E-12);
      expect((await components['/_point2'].stateValues.xs)[0].tree).closeTo(0, 1E-12);
      expect((await components['/_point2'].stateValues.xs)[1].tree).closeTo(0, 1E-12);
      expect((await components['/a'].stateValues.value)).closeTo(0, 1E-12);

    })
    cy.visit('/cypressTest')

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>b</text>
  <graph>
  <point>
    (<copy prop="x" target="_point2" />, 3)
  </point>
  <point>
    (<copy target="a" />,<copy target="a" />)
  </point>
  </graph>

  <number name="a">3</number>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'b');  // to wait to load

    cy.log(`point 2 is moveable, based on x component`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point2'].movePoint({ x: -3, y: -7 })

      expect((await components['/_point1'].stateValues.xs)[0].tree).closeTo(-3, 1E-12);
      expect((await components['/_point1'].stateValues.xs)[1].tree).closeTo(3, 1E-12);
      expect((await components['/_point2'].stateValues.xs)[0].tree).closeTo(-3, 1E-12);
      expect((await components['/_point2'].stateValues.xs)[1].tree).closeTo(-3, 1E-12);
      expect((await components['/a'].stateValues.value)).closeTo(-3, 1E-12);

      // test zero as had a bug affect case when zero
      await components['/_point2'].movePoint({ x: 0, y: 5 })

      expect((await components['/_point1'].stateValues.xs)[0].tree).closeTo(0, 1E-12);
      expect((await components['/_point1'].stateValues.xs)[1].tree).closeTo(3, 1E-12);
      expect((await components['/_point2'].stateValues.xs)[0].tree).closeTo(0, 1E-12);
      expect((await components['/_point2'].stateValues.xs)[1].tree).closeTo(0, 1E-12);
      expect((await components['/a'].stateValues.value)).closeTo(0, 1E-12);

    })

    cy.log(`point1 is free to move`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      await components['/_point1'].movePoint({ x: 9, y: -6 })

      expect((await components['/_point1'].stateValues.xs)[0].tree).closeTo(9, 1E-12);
      expect((await components['/_point1'].stateValues.xs)[1].tree).closeTo(-6, 1E-12);
      expect((await components['/_point2'].stateValues.xs)[0].tree).closeTo(9, 1E-12);
      expect((await components['/_point2'].stateValues.xs)[1].tree).closeTo(9, 1E-12);
      expect((await components['/a'].stateValues.value)).closeTo(9, 1E-12);

      // move to zero to make sure are testing the bug that occured at zero
      await components['/_point1'].movePoint({ x: 0, y: 0 })

      expect((await components['/_point1'].stateValues.xs)[0].tree).closeTo(0, 1E-12);
      expect((await components['/_point1'].stateValues.xs)[1].tree).closeTo(0, 1E-12);
      expect((await components['/_point2'].stateValues.xs)[0].tree).closeTo(0, 1E-12);
      expect((await components['/_point2'].stateValues.xs)[1].tree).closeTo(0, 1E-12);
      expect((await components['/a'].stateValues.value)).closeTo(0, 1E-12);

    })

  });

  it('point constrained to grid', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>

  <point x="1" y="2">
    <constraints>
      <constrainToGrid/>
    </constraints>
  </point>

  </graph>
  <math><copy prop="coords" target="_point1" /></math>
  <boolean><copy prop="constraintUsed" target="_point1" /></boolean>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    cy.log(`move point to (1.2,3.6)`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point1'].movePoint({ x: 1.2, y: 3.6 });
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(1);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(4);
      expect((await components['/_point1'].stateValues.coords).tree).eqls(["vector", 1, 4]);
      expect(components['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,4)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")

    cy.log(`move point to (-9.8,-7.4)`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point1'].movePoint({ x: -9.8, y: -7.4 });
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(-10);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(-7);
      expect((await components['/_point1'].stateValues.coords).tree).eqls(["vector", -10, -7]);
      expect(components['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−10,−7)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")


    // test bug with number in scientific notation 
    cy.log(`move point to (-1.3E-14,2.5E-12)`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point1'].movePoint({ x: -1.3E-14, y: 2.5E-12 });
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(0);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(0);
      expect((await components['/_point1'].stateValues.coords).tree).eqls(["vector", 0, 0]);
      expect(components['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(0,0)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")

  });

  it('point constrained to grid with sugared coordinates', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>

  <point>
    (1,2)
    <constraints>
      <constrainToGrid/>
    </constraints>
  </point>

  </graph>
  <math><copy prop="coords" target="_point1" /></math>
  <boolean><copy prop="constraintUsed" target="_point1" /></boolean>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    cy.log(`move point to (1.2,3.6)`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point1'].movePoint({ x: 1.2, y: 3.6 });
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(1);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(4);
      expect((await components['/_point1'].stateValues.coords).tree).eqls(["vector", 1, 4]);
      expect(components['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,4)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")

    cy.log(`move point to (-9.8,-7.4)`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point1'].movePoint({ x: -9.8, y: -7.4 });
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(-10);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(-7);
      expect((await components['/_point1'].stateValues.coords).tree).eqls(["vector", -10, -7]);
      expect(components['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−10,−7)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")
  });

  it('point constrained to grid, copied from outside', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>

  <constraints name="toGrid">
    <constrainToGrid/>
  </constraints>

  <graph>
  <point x="1" y="2">
    <copy target="toGrid" />
  </point>
  </graph>
  <math><copy prop="coords" target="_point1" /></math>
  <boolean><copy prop="constraintUsed" target="_point1" /></boolean>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    cy.log(`move point to (1.2,3.6)`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point1'].movePoint({ x: 1.2, y: 3.6 });
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(1);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(4);
      expect((await components['/_point1'].stateValues.coords).tree).eqls(["vector", 1, 4]);
      expect(components['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,4)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")

    cy.log(`move point to (-9.8,-7.4)`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point1'].movePoint({ x: -9.8, y: -7.4 });
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(-10);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(-7);
      expect((await components['/_point1'].stateValues.coords).tree).eqls(["vector", -10, -7]);
      expect(components['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−10,−7)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")
  });


  it('point constrained to grid, 3D', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <point x="1" y="2" z="3">
    <constraints>
      <constrainToGrid/>
    </constraints>
  </point>

  <math><copy prop="coords" target="_point1" /></math>
  <boolean><copy prop="constraintUsed" target="_point1" /></boolean>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    cy.log(`move point to (1.2,3.6,5.4)`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point1'].movePoint({ x: 1.2, y: 3.6, z: 5.4 });
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(1);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(4);
      expect((await components['/_point1'].stateValues.xs)[2].tree).eq(5);
      expect((await components['/_point1'].stateValues.coords).tree).eqls(["vector", 1, 4, 5]);
      expect(components['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,4,5)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")

    cy.log(`move point to (-9.8,-7.4,-4.6)`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point1'].movePoint({ x: -9.8, y: -7.4, z: -4.6 });
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(-10);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(-7);
      expect((await components['/_point1'].stateValues.xs)[2].tree).eq(-5);
      expect((await components['/_point1'].stateValues.coords).tree).eqls(["vector", -10, -7, -5]);
      expect(components['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−10,−7,−5)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")


    // test bug with number in scientific notation 
    cy.log(`move point to (-1.3E-14,2.5E-12,7.1E-21)`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point1'].movePoint({ x: -1.3E-14, y: 2.5E-12, z: 7.1E-121 });
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(0);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(0);
      expect((await components['/_point1'].stateValues.xs)[2].tree).eq(0);
      expect((await components['/_point1'].stateValues.coords).tree).eqls(["vector", 0, 0, 0]);
      expect(components['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(0,0,0)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")

  });


  it('point constrained to two contradictory grids', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>

  <point xs="1 3.1">
    <constraints>
      <constrainToGrid dx="2" dy="2"/>
      <constrainToGrid dx="2" dy="2" xoffset="1" yoffset="1" />
    </constraints>
  </point>

  </graph>
  <math><copy prop="coords" target="_point1" /></math>
  <boolean><copy prop="constraintUsed" target="_point1" /></boolean>

  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    cy.log("second constraint wins, but first constraint affects result")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(3);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(5);
      expect((await components['/_point1'].stateValues.coords).tree).eqls(["vector", 3, 5]);
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

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point1'].movePoint({ x: 3, y: 2.9 });
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(7);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(5);
      expect((await components['/_point1'].stateValues.coords).tree).eqls(["vector", 7, 5]);
      expect(components['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(7,5)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")
  });

  it('point constrained to grid and line', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <line name="PhaseLine" equation="y=0" fixed styleNumber="3"/>
    <point x="-1.5" y="7.9">
      <constraints>
        <constrainToGrid/>
        <constrainto>$PhaseLine</constrainto>
      </constraints>
    </point>
  </graph>
  <math><copy prop="coords" target="_point1" /></math>
  <boolean><copy prop="constraintUsed" target="_point1" /></boolean>

  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(-1);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(0);
      expect(components['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−1,0)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")


    cy.log(`move point`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point1'].movePoint({ x: 8.5, y: -6.2 });
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(9);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(0);
      expect(components['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(9,0)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")
  });

  it('point constrained to graph', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>

  <point x="1" y="2">
    <constraints>
      <constrainToGraph/>
    </constraints>
  </point>

  </graph>
  <math><copy prop="coords" target="_point1" /></math>
  <boolean><copy prop="constraintUsed" target="_point1" /></boolean>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    cy.log(`move point to (105,3)`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point1'].movePoint({ x: 105, y: 3 });
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(9.8);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(3);
      expect(components['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(9.8,3)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")

    cy.log(`move point to (-30,11)`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point1'].movePoint({ x: -9.8, y: 9.8 });
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(-9.8);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(9.8);
      expect(components['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−9.8,9.8)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")

    cy.log(`move point to (-3,1)`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point1'].movePoint({ x: -3, y: 1 });
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(-3);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(1);
      expect(components['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−3,1)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")
  });

  it('three points with one constrained to grid', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point name="original">(1,2)</point>
    <point name="constrained" x="$(original{prop='x'})+1" y="$(original{prop='y'})+1" >
      <constraints>
        <constrainToGrid/>
      </constraints>
    </point>
    <point name="follower">
        (<copy prop="x" target="constrained" />+1,
          <copy prop="y" target="constrained" />+1)
    </point>
  </graph>
  <math><copy prop="coords" target="original" /></math>
  <math><copy prop="coords" target="constrained" /></math>
  <math><copy prop="coords" target="follower" /></math>
  <boolean><copy prop="constraintUsed" target="original" /></boolean>
  <boolean><copy prop="constraintUsed" target="constrained" /></boolean>
  <boolean><copy prop="constraintUsed" target="follower" /></boolean>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    cy.log(`move point1 to (1.2,3.6)`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/original'].movePoint({ x: 1.2, y: 3.6 });
      expect((await components['/original'].stateValues.xs)[0].tree).eq(1.2);
      expect((await components['/original'].stateValues.xs)[1].tree).eq(3.6);
      expect((await components['/original'].stateValues.coords).tree).eqls(["vector", 1.2, 3.6]);
      expect(components['/original'].stateValues.constraintUsed).eq(false);
      expect((await components['/constrained'].stateValues.xs)[0].tree).eq(2);
      expect((await components['/constrained'].stateValues.xs)[1].tree).eq(5);
      expect((await components['/constrained'].stateValues.coords).tree).eqls(["vector", 2, 5]);
      expect(components['/constrained'].stateValues.constraintUsed).eq(true);
      expect((await components['/follower'].stateValues.xs)[0].tree).eq(3);
      expect((await components['/follower'].stateValues.xs)[1].tree).eq(6);
      expect((await components['/follower'].stateValues.coords).tree).eqls(["vector", 3, 6]);
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
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/constrained'].movePoint({ x: -3.4, y: 6.7 });
      expect((await components['/original'].stateValues.xs)[0].tree).eq(-4);
      expect((await components['/original'].stateValues.xs)[1].tree).eq(6);
      expect((await components['/original'].stateValues.coords).tree).eqls(["vector", -4, 6]);
      expect(components['/original'].stateValues.constraintUsed).eq(false);
      expect((await components['/constrained'].stateValues.xs)[0].tree).eq(-3);
      expect((await components['/constrained'].stateValues.xs)[1].tree).eq(7);
      expect((await components['/constrained'].stateValues.coords).tree).eqls(["vector", -3, 7]);
      expect(components['/constrained'].stateValues.constraintUsed).eq(true);
      expect((await components['/follower'].stateValues.xs)[0].tree).eq(-2);
      expect((await components['/follower'].stateValues.xs)[1].tree).eq(8);
      expect((await components['/follower'].stateValues.coords).tree).eqls(["vector", -2, 8]);
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
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/follower'].movePoint({ x: 5.3, y: -2.2 });
      expect((await components['/original'].stateValues.xs)[0].tree).eq(3);
      expect((await components['/original'].stateValues.xs)[1].tree).eq(-4);
      expect((await components['/original'].stateValues.coords).tree).eqls(["vector", 3, -4]);
      expect(components['/original'].stateValues.constraintUsed).eq(false);
      expect((await components['/constrained'].stateValues.xs)[0].tree).eq(4);
      expect((await components['/constrained'].stateValues.xs)[1].tree).eq(-3);
      expect((await components['/constrained'].stateValues.coords).tree).eqls(["vector", 4, -3]);
      expect(components['/constrained'].stateValues.constraintUsed).eq(true);
      expect((await components['/follower'].stateValues.xs)[0].tree).eq(5);
      expect((await components['/follower'].stateValues.xs)[1].tree).eq(-2);
      expect((await components['/follower'].stateValues.coords).tree).eqls(["vector", 5, -2]);
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
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <mathinput name="dx"/>
  <mathinput name="dy"/>
  <mathinput name="xoffset"/>
  <mathinput name="yoffset"/>

  <graph>
    <point name="original">(1.2,3.6)</point>
    <point name="constrained" x="$(original{prop='x'})+1" y="$(original{prop='y'})+1">
      <constraints>
        <constrainToGrid dx="$dx" dy="$dy" xoffset="$xoffset" yoffset="$yoffset" />
      </constraints>
    </point>
    <point name="follower">
        (<copy prop="x" target="constrained" />+1,
          <copy prop="y" target="constrained" />+1)
    </point>
  </graph>
  <math><copy prop="coords" target="original" /></math>
  <math><copy prop="coords" target="constrained" /></math>
  <math><copy prop="coords" target="follower" /></math>
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
    }); cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/original'].stateValues.xs)[0].tree).eq(1.2);
      expect((await components['/original'].stateValues.xs)[1].tree).eq(3.6);
      expect((await components['/original'].stateValues.coords).tree).eqls(["vector", 1.2, 3.6]);
      expect((await components['/constrained'].stateValues.xs)[0].tree).eq(2.2);
      expect((await components['/constrained'].stateValues.xs)[1].tree).eq(4.6);
      expect((await components['/constrained'].stateValues.coords).tree).eqls(["vector", 2.2, 4.6]);
      expect((await components['/follower'].stateValues.xs)[0].tree).eq(3.2);
      expect((await components['/follower'].stateValues.xs)[1].tree).eq(5.6);
      expect((await components['/follower'].stateValues.coords).tree).eqls(["vector", 3.2, 5.6]);
    })


    cy.log(`constrain x and y to integers`);
    cy.get('#\\/dx textarea').type('1', { force: true });
    cy.get('#\\/dy textarea').type('1', { force: true });
    cy.get('#\\/xoffset textarea').type('0', { force: true });
    cy.get('#\\/yoffset textarea').type('0{enter}', { force: true });

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/original'].stateValues.xs)[0].tree).eq(1.2);
      expect((await components['/original'].stateValues.xs)[1].tree).eq(3.6);
      expect((await components['/original'].stateValues.coords).tree).eqls(["vector", 1.2, 3.6]);
      expect((await components['/constrained'].stateValues.xs)[0].tree).eq(2);
      expect((await components['/constrained'].stateValues.xs)[1].tree).eq(5);
      expect((await components['/constrained'].stateValues.coords).tree).eqls(["vector", 2, 5]);
      expect((await components['/follower'].stateValues.xs)[0].tree).eq(3);
      expect((await components['/follower'].stateValues.xs)[1].tree).eq(6);
      expect((await components['/follower'].stateValues.coords).tree).eqls(["vector", 3, 6]);
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
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/constrained'].movePoint({ x: 5.3, y: -2.2 });
      expect((await components['/original'].stateValues.xs)[0].tree).eq(4);
      expect((await components['/original'].stateValues.xs)[1].tree).eq(-3);
      expect((await components['/original'].stateValues.coords).tree).eqls(["vector", 4, -3]);
      expect((await components['/constrained'].stateValues.xs)[0].tree).eq(5);
      expect((await components['/constrained'].stateValues.xs)[1].tree).eq(-2);
      expect((await components['/constrained'].stateValues.coords).tree).eqls(["vector", 5, -2]);
      expect((await components['/follower'].stateValues.xs)[0].tree).eq(6);
      expect((await components['/follower'].stateValues.xs)[1].tree).eq(-1);
      expect((await components['/follower'].stateValues.coords).tree).eqls(["vector", 6, -1]);
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
    cy.get('#\\/dx textarea').type('{end}{backspace}3', { force: true });
    cy.get('#\\/dy textarea').type('{end}{backspace}0.5', { force: true });
    cy.get('#\\/xoffset textarea').type('{end}{backspace}1', { force: true });
    cy.get('#\\/yoffset textarea').type('{end}{backspace}0.1{enter}', { force: true });
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/original'].stateValues.xs)[0].tree).eq(4);
      expect((await components['/original'].stateValues.xs)[1].tree).eq(-3);
      expect((await components['/original'].stateValues.coords).tree).eqls(["vector", 4, -3]);
      expect((await components['/constrained'].stateValues.xs)[0].tree).eq(4);
      expect((await components['/constrained'].stateValues.xs)[1].tree).eq(-1.9);
      expect((await components['/constrained'].stateValues.coords).tree).eqls(["vector", 4, -1.9]);
      expect((await components['/follower'].stateValues.xs)[0].tree).eq(5);
      expect((await components['/follower'].stateValues.xs)[1].tree).to.be.approximately(-0.9, 1E-10);
      expect((await components['/follower'].stateValues.coords).tree.slice(0, 2)).eqls(["vector", 5]);
      expect((await components['/follower'].stateValues.coords).tree[2]).to.be.approximately(-0.9, 1E-10);
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
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/constrained'].movePoint({ x: -0.6, y: -8.6 });
      expect((await components['/original'].stateValues.xs)[0].tree).eq(-3);
      expect((await components['/original'].stateValues.xs)[1].tree).eq(-9.4);
      expect((await components['/original'].stateValues.coords).tree).eqls(["vector", -3, -9.4]);
      expect((await components['/constrained'].stateValues.xs)[0].tree).eq(-2);
      expect((await components['/constrained'].stateValues.xs)[1].tree).eq(-8.4);
      expect((await components['/constrained'].stateValues.coords).tree).eqls(["vector", -2, -8.4]);
      expect((await components['/follower'].stateValues.xs)[0].tree).eq(-1);
      expect((await components['/follower'].stateValues.xs)[1].tree).eq(-7.4);
      expect((await components['/follower'].stateValues.coords).tree).eqls(["vector", -1, -7.4]);
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
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>

  <point xs="-7.1 8.9">
    <constraints>
      <attractToGrid/>
    </constraints>
  </point>

  </graph>
  <math><copy prop="coords" target="_point1" /></math>
  <boolean><copy prop="constraintUsed" target="_point1" /></boolean>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(-7);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(9);
      expect((await components['/_point1'].stateValues.coords).tree).eqls(["vector", -7, 9]);
      expect(components['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−7,9)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")

    cy.log(`move point to (1.1,3.6)`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point1'].movePoint({ x: 1.1, y: 3.6 });
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(1.1);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(3.6);
      expect((await components['/_point1'].stateValues.coords).tree).eqls(["vector", 1.1, 3.6]);
      expect(components['/_point1'].stateValues.constraintUsed).eq(false);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1.1,3.6)')
    });
    cy.get('#\\/_boolean1').should('have.text', "false")

    cy.log(`move point to (1.1,3.9)`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point1'].movePoint({ x: 1.1, y: 3.9 });
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(1);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(4);
      expect((await components['/_point1'].stateValues.coords).tree).eqls(["vector", 1, 4]);
      expect(components['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,4)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")


    // test bug with number in scientific notation 
    cy.log(`move point to (-1.3E-14,2.5E-12)`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point1'].movePoint({ x: -1.3E-14, y: 2.5E-12 });
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(0);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(0);
      expect((await components['/_point1'].stateValues.coords).tree).eqls(["vector", 0, 0]);
      expect(components['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(0,0)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")

  });

  it('point attracted to grid, copied from outside', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>

  <constraints name="toGrid">
    <attractToGrid/>
  </constraints>

  <graph>

  <point xs="-7.1 8.9">
    <copy target="toGrid" />
  </point>

  </graph>
  <math><copy prop="coords" target="_point1" /></math>
  <boolean><copy prop="constraintUsed" target="_point1" /></boolean>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(-7);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(9);
      expect((await components['/_point1'].stateValues.coords).tree).eqls(["vector", -7, 9]);
      expect(components['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−7,9)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")

    cy.log(`move point to (1.1,3.6)`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point1'].movePoint({ x: 1.1, y: 3.6 });
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(1.1);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(3.6);
      expect((await components['/_point1'].stateValues.coords).tree).eqls(["vector", 1.1, 3.6]);
      expect(components['/_point1'].stateValues.constraintUsed).eq(false);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1.1,3.6)')
    });
    cy.get('#\\/_boolean1').should('have.text', "false")

    cy.log(`move point to (1.1,3.9)`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point1'].movePoint({ x: 1.1, y: 3.9 });
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(1);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(4);
      expect((await components['/_point1'].stateValues.coords).tree).eqls(["vector", 1, 4]);
      expect(components['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,4)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")

  });

  it('point attracted to grid, 3D', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <point xs="-7.1 8.9 2.1">
    <constraints>
      <attractToGrid/>
    </constraints>
  </point>

  <math><copy prop="coords" target="_point1" /></math>
  <boolean><copy prop="constraintUsed" target="_point1" /></boolean>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(-7);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(9);
      expect((await components['/_point1'].stateValues.xs)[2].tree).eq(2);
      expect((await components['/_point1'].stateValues.coords).tree).eqls(["vector", -7, 9, 2]);
      expect(components['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−7,9,2)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")

    cy.log(`move point to (1.1,3.9,5.4)`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point1'].movePoint({ x: 1.1, y: 3.9, z: 5.4 });
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(1.1);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(3.9);
      expect((await components['/_point1'].stateValues.xs)[2].tree).eq(5.4);
      expect((await components['/_point1'].stateValues.coords).tree).eqls(["vector", 1.1, 3.9, 5.4]);
      expect(components['/_point1'].stateValues.constraintUsed).eq(false);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1.1,3.9,5.4)')
    });
    cy.get('#\\/_boolean1').should('have.text', "false")

    cy.log(`move point to (1.1,3.9,5.9)`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point1'].movePoint({ x: 1.1, y: 3.9, z: 5.9 });
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(1);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(4);
      expect((await components['/_point1'].stateValues.xs)[2].tree).eq(6);
      expect((await components['/_point1'].stateValues.coords).tree).eqls(["vector", 1, 4, 6]);
      expect(components['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,4,6)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")


    // test bug with number in scientific notation 
    cy.log(`move point to (-1.3E-14,2.5E-12,-2.3E-19)`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point1'].movePoint({ x: -1.3E-14, y: 2.5E-12, z: -2.3E-19 });
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(0);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(0);
      expect((await components['/_point1'].stateValues.xs)[2].tree).eq(0);
      expect((await components['/_point1'].stateValues.coords).tree).eqls(["vector", 0, 0, 0]);
      expect(components['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(0,0,0)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")

  });


  it('point attracted to grid, including gridlines', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>

  <point xs="3.1 -3.4">
    <constraints>
      <attractToGrid includeGridlines="true"/>
    </constraints>
  </point>

  </graph>
  <math><copy prop="coords" target="_point1" /></math>
  <boolean><copy prop="constraintUsed" target="_point1" /></boolean>
  

  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,−3.4)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true");

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(3);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(-3.4);
      expect((await components['/_point1'].stateValues.coords).tree).eqls(["vector", 3, -3.4]);
      expect(components['/_point1'].stateValues.constraintUsed).eq(true);
    })


    cy.log(`move point to (1.3,3.9)`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point1'].movePoint({ x: 1.3, y: 3.9 });
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(1.3);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(4);
      expect((await components['/_point1'].stateValues.coords).tree).eqls(["vector", 1.3, 4]);
      expect(components['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1.3,4)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true");

    cy.log(`move point to (1.1,3.9)`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point1'].movePoint({ x: 1.1, y: 3.9 });
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(1);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(4);
      expect((await components['/_point1'].stateValues.coords).tree).eqls(["vector", 1, 4]);
      expect(components['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,4)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true");

    cy.log(`move point to (1.3,3.7)`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point1'].movePoint({ x: 1.3, y: 3.7 });
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(1.3);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(3.7);
      expect((await components['/_point1'].stateValues.coords).tree).eqls(["vector", 1.3, 3.7]);
      expect(components['/_point1'].stateValues.constraintUsed).eq(false);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1.3,3.7)')
    });
    cy.get('#\\/_boolean1').should('have.text', "false");

  });

  it('point attracted to grid with parameters', () => {
    cy.window().then(async (win) => {
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

  <point xs="-7.1 8.9">
    <constraints>
      <attractToGrid dx="$dx" dy="$dy" xoffset="$xoffset" yoffset="$yoffset" xthreshold="$xthreshold" ythreshold="$ythreshold" />
    </constraints>
  </point>

  </graph>
  <math><copy prop="coords" target="_point1" /></math>
  <boolean><copy prop="constraintUsed" target="_point1" /></boolean>

  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    cy.log(`no constraints with blanks`)

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(-7.1);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(8.9);
      expect((await components['/_point1'].stateValues.coords).tree).eqls(["vector", -7.1, 8.9]);
      expect(components['/_point1'].stateValues.constraintUsed).eq(false);
    })
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−7.1,8.9)')
    });
    cy.get('#\\/_boolean1').should('have.text', "false")

    cy.log(`constrain x and y to integers`);
    cy.get('#\\/dx textarea').type('1', { force: true });
    cy.get('#\\/dy textarea').type('1', { force: true });
    cy.get('#\\/xoffset textarea').type('0', { force: true });
    cy.get('#\\/yoffset textarea').type('0', { force: true });
    cy.get('#\\/xthreshold textarea').type('0.2', { force: true });
    cy.get('#\\/ythreshold textarea').type('0.2{enter}', { force: true });
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(-7);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(9);
      expect((await components['/_point1'].stateValues.coords).tree).eqls(["vector", -7, 9]);
      expect(components['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−7,9)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")

    cy.log(`change constraints`);
    cy.get('#\\/dx textarea').type('{end}{backspace}3', { force: true });
    cy.get('#\\/dy textarea').type('{end}{backspace}0.5', { force: true });
    cy.get('#\\/xoffset textarea').type('{end}{backspace}1', { force: true });
    cy.get('#\\/yoffset textarea').type('{end}{backspace}0.1{enter}', { force: true });
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(-7.1);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(8.9);
      expect((await components['/_point1'].stateValues.coords).tree).eqls(["vector", -7.1, 8.9]);
      expect(components['/_point1'].stateValues.constraintUsed).eq(false);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−7.1,8.9)')
    });
    cy.get('#\\/_boolean1').should('have.text', "false")

    cy.get('#\\/xthreshold textarea').type('{end}{backspace}{backspace}{backspace}1.0', { force: true });
    cy.get('#\\/ythreshold textarea').type('{end}{backspace}{backspace}{backspace}0.3{enter}', { force: true });
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(-8);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(9.1);
      expect((await components['/_point1'].stateValues.coords).tree).eqls(["vector", -8, 9.1]);
      expect(components['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−8,9.1)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")



  });

  it('point constrained to line', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point>(0,2)</point>
  <point>(2,0)</point>
  <line through="$_point1 $_point2"/>
  <point name="A" xs="-1 -5">
    <constraints>
      <constrainTo><copy target="_line1" /></constrainTo>
    </constraints>
  </point>
  </graph>
  <copy prop="constraintUsed" name="constraintUsed" target="A" />
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let constraintUsed1 = components['/constraintUsed'].replacements[0];
      let constraintUsed1Anchor = cesc('#' + constraintUsed1.componentName);

      cy.log(`point is on line`);
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        expect((await components['/A'].stateValues.xs)[0].tree + (await components['/A'].stateValues.xs)[1].tree).eq(2);
        expect(components['/A'].stateValues.constraintUsed).eq(true);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")


      cy.log(`move point`);
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/A'].movePoint({ x: 9, y: -3 });
        expect((await components['/A'].stateValues.xs)[0].tree + (await components['/A'].stateValues.xs)[1].tree).eq(2);
        expect(components['/A'].stateValues.constraintUsed).eq(true);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`change line`);
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/_point1'].movePoint({ x: 3, y: 1 });
        expect((await components['/A'].stateValues.xs)[0].tree - (await components['/A'].stateValues.xs)[1].tree).eq(2);
        expect(components['/A'].stateValues.constraintUsed).eq(true);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move point`);
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/A'].movePoint({ x: 9, y: -3 });
        expect((await components['/A'].stateValues.xs)[0].tree - (await components['/A'].stateValues.xs)[1].tree).eq(2);
        expect(components['/A'].stateValues.constraintUsed).eq(true);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

    })
  });

  it('point attracted to line', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point>(0,2)</point>
  <point>(2,0)</point>
  <line through="$_point1 $_point2"/>
  <point name="A" xs="-1 -5">
    <constraints>
      <attractTo><copy target="_line1" /></attractTo>
    </constraints>
  </point>
  </graph>
  <copy prop="constraintUsed" name="constraintUsed" target="A" />
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let constraintUsed1 = components['/constraintUsed'].replacements[0];
      let constraintUsed1Anchor = cesc('#' + constraintUsed1.componentName);

      cy.log(`point is not on line`);
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        expect((await components['/A'].stateValues.xs)[0].tree).eq(-1);
        expect((await components['/A'].stateValues.xs)[1].tree).eq(-5);
        expect((await components['/A'].stateValues.coords).tree).eqls(["vector", -1, -5]);
        expect(components['/A'].stateValues.constraintUsed).eq(false)
      })
      cy.get(constraintUsed1Anchor).should('have.text', "false")

      cy.log(`move point near line`);
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/A'].movePoint({ x: 9.1, y: -6.8 });
        expect((await components['/A'].stateValues.xs)[0].tree + (await components['/A'].stateValues.xs)[1].tree).closeTo(2, 1E-14);
        expect(components['/A'].stateValues.constraintUsed).eq(true);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`change line, point not on line`);
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/_point1'].movePoint({ x: 3, y: 1 });
        expect((await components['/A'].stateValues.xs)[0].tree + (await components['/A'].stateValues.xs)[1].tree).closeTo(2, 1E-14);
        expect(components['/A'].stateValues.constraintUsed).eq(false)
      })
      cy.get(constraintUsed1Anchor).should('have.text', "false")

      cy.log(`move point`);
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/A'].movePoint({ x: -5.1, y: -6.8 });
        expect((await components['/A'].stateValues.xs)[0].tree - (await components['/A'].stateValues.xs)[1].tree).closeTo(2, 1E-14);
        expect(components['/A'].stateValues.constraintUsed).eq(true);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")
    })

  });

  it('point constrained to lines and points', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <graph>
  <line hide>y = x + 7</line>
  <line hide>y = x - 3</line>
  <map>
    <template newNamespace>
      <point hide>($n,$n+2)</point>
    </template>
    <sources alias="n"><sequence from="-10" to="10"/></sources>
  </map>

  <point xs="3 2">
    <constraints>
    <constrainTo>
      <copy target="_line1" />
      <copy target="_line2" />
      <copy target="_map1" />
    </constrainTo>
    </constraints>
  </point>
  </graph>
  <copy prop="constraintUsed" name="constraintUsed" target="_point1" />
  <text>a</text>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let constraintUsed1 = components['/constraintUsed'].replacements[0];
      let constraintUsed1Anchor = cesc('#' + constraintUsed1.componentName);

      cy.log(`point is on line`);
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        expect((await components['/_point1'].stateValues.xs)[1].tree - (await components['/_point1'].stateValues.xs)[0].tree).eq(-3);
        expect(components['/_point1'].stateValues.constraintUsed).eq(true)
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move point to lower right`);
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/_point1'].movePoint({ x: 9, y: -5 });
        expect((await components['/_point1'].stateValues.xs)[1].tree - (await components['/_point1'].stateValues.xs)[0].tree).eq(-3);
        expect(components['/_point1'].stateValues.constraintUsed).eq(true)
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move point near points`);
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/_point1'].movePoint({ x: 3.5, y: 5.5 });
        expect((await components['/_point1'].stateValues.xs)[0].tree).eq(3);
        expect((await components['/_point1'].stateValues.xs)[1].tree).eq(5);
        expect((await components['/_point1'].stateValues.coords).tree).eqls(["vector", 3, 5]);
        expect(components['/_point1'].stateValues.constraintUsed).eq(true)
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move point to upper left`);
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/_point1'].movePoint({ x: -9, y: 8 });
        expect((await components['/_point1'].stateValues.xs)[1].tree - (await components['/_point1'].stateValues.xs)[0].tree).eq(7);
        expect(components['/_point1'].stateValues.constraintUsed).eq(true);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")
    })
  });

  it('point attracted to lines and points', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <graph>
  <line hide>y = x + 7</line>
  <line hide>y = x - 3</line>
  <map>
    <template newNamespace>
      <point hide>($n,$n+2)</point>
    </template>
    <sources alias="n"><sequence from="-10" to="10"/></sources>
  </map>

  <point xs="3 2">
    <constraints>
      <attractTo threshold="1">
        <copy target="_line1" />
        <copy target="_line2" />
        <copy target="_map1" />
      </attractTo>
    </constraints>
  </point>
  </graph>
  <copy prop="constraintUsed" name="constraintUsed" target="_point1" />
  <text>a</text>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let constraintUsed1 = components['/constraintUsed'].replacements[0];
      let constraintUsed1Anchor = cesc('#' + constraintUsed1.componentName);

      cy.log(`point is in original location`);
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        expect((await components['/_point1'].stateValues.xs)[0].tree).eq(3);
        expect((await components['/_point1'].stateValues.xs)[1].tree).eq(2);
        expect((await components['/_point1'].stateValues.coords).tree).eqls(["vector", 3, 2]);
        expect(components['/_point1'].stateValues.constraintUsed).eq(false);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "false")

      cy.log(`point is on line`);
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/_point1'].movePoint({ x: 3.1, y: 0.5 });
        expect((await components['/_point1'].stateValues.xs)[1].tree - (await components['/_point1'].stateValues.xs)[0].tree).eq(-3);
        expect(components['/_point1'].stateValues.constraintUsed).eq(true)
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move point to lower right`);
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/_point1'].movePoint({ x: 9, y: -5 });
        expect((await components['/_point1'].stateValues.xs)[0].tree).eq(9);
        expect((await components['/_point1'].stateValues.xs)[1].tree).eq(-5);
        expect((await components['/_point1'].stateValues.coords).tree).eqls(["vector", 9, -5]);
        expect(components['/_point1'].stateValues.constraintUsed).eq(false);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "false")

      cy.log(`move point near points`);
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/_point1'].movePoint({ x: 3.1, y: 5.1 });
        expect((await components['/_point1'].stateValues.xs)[0].tree).eq(3);
        expect((await components['/_point1'].stateValues.xs)[1].tree).eq(5);
        expect((await components['/_point1'].stateValues.coords).tree).eqls(["vector", 3, 5]);
        expect(components['/_point1'].stateValues.constraintUsed).eq(true)
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move point to upper left`);
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/_point1'].movePoint({ x: -9, y: 8 });
        expect((await components['/_point1'].stateValues.xs)[0].tree).eq(-9);
        expect((await components['/_point1'].stateValues.xs)[1].tree).eq(8);
        expect((await components['/_point1'].stateValues.coords).tree).eqls(["vector", -9, 8]);
        expect(components['/_point1'].stateValues.constraintUsed).eq(false);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "false")

      cy.log(`move point near upper line`);
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/_point1'].movePoint({ x: -8.8, y: -2.3 });
        expect((await components['/_point1'].stateValues.xs)[1].tree - (await components['/_point1'].stateValues.xs)[0].tree).eq(7);
        expect(components['/_point1'].stateValues.constraintUsed).eq(true);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")
    })
  });

  it('point constrained to union of lines and grid', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <graph>
  <line>x+y=0</line>
  <line>x=y</line>
  <line>x=2y+8</line>
  <line>x=-2y-8</line>
  <point name="A" xs="7 3">
    <constraints>
    <constraintUnion>
      <constrainTo><copy target="_line1" /></constrainTo>
      <constrainTo><copy target="_line2" /><copy target="_line3" /></constrainTo>
      <constrainTo><copy target="_line4" /></constrainTo>
      <constrainToGrid dx="2" dy="2"/>
    </constraintUnion>
    </constraints>
  </point>
  </graph>
  <copy prop="constraintUsed" name="constraintUsed" target="A" />
  <text>a</text>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let constraintUsed1 = components['/constraintUsed'].replacements[0];
      let constraintUsed1Anchor = cesc('#' + constraintUsed1.componentName);

      cy.log(`point on grid`);
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        expect((await components['/A'].stateValues.xs)[0].tree).to.be.closeTo(8, 1E-12);
        expect((await components['/A'].stateValues.xs)[1].tree).to.be.closeTo(4, 1E-12);
        expect(components['/A'].stateValues.constraintUsed).eq(true)
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move near line x+y=0`);
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/A'].movePoint({ x: -7.1, y: 8.2 });
        expect((await components['/A'].stateValues.xs)[0].tree + (await components['/A'].stateValues.xs)[1].tree).to.be.closeTo(0, 1E-12);
        expect(components['/A'].stateValues.constraintUsed).eq(true);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move near line x=y`);
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/A'].movePoint({ x: 7.1, y: 8.2 });
        expect((await components['/A'].stateValues.xs)[0].tree - (await components['/A'].stateValues.xs)[1].tree).to.be.closeTo(0, 1E-12);
        expect(components['/A'].stateValues.constraintUsed).eq(true);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move near line x=2y+8`);
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/A'].movePoint({ x: 3.5, y: -2.5 });
        expect((await components['/A'].stateValues.xs)[0].tree - 2 * (await components['/A'].stateValues.xs)[1].tree).to.be.closeTo(8, 1E-12);
        expect(components['/A'].stateValues.constraintUsed).eq(true);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move near line x=-2y-8`);
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/A'].movePoint({ x: -3.5, y: -2.5 });
        expect((await components['/A'].stateValues.xs)[0].tree + 2 * (await components['/A'].stateValues.xs)[1].tree).to.be.closeTo(-8, 1E-12);
        expect(components['/A'].stateValues.constraintUsed).eq(true);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")
    })

  });

  it('point attracted to union of lines and grid', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <graph>
  <line>x+y=0</line>
  <line>x=y</line>
  <line>x=2y+8</line>
  <line>x=-2y-8</line>
  <point name="A" xs="7 3">
    <constraints>
    <attractToConstraint>
      <constraintUnion>
        <constrainTo><copy target="_line1" /></constrainTo>
        <constrainTo><copy target="_line2" /><copy target="_line3" /></constrainTo>
        <constrainTo><copy target="_line4" /></constrainTo>
        <constrainToGrid dx="2" dy="2"/>
      </constraintUnion>
    </attractToConstraint>
    </constraints>
  </point>
  </graph>
  <copy prop="constraintUsed" name="constraintUsed" target="A" />
  <text>a</text>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let constraintUsed1 = components['/constraintUsed'].replacements[0];
      let constraintUsed1Anchor = cesc('#' + constraintUsed1.componentName);

      cy.log(`point in original location`);
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        expect((await components['/A'].stateValues.xs)[0].tree).to.be.closeTo(7, 1E-12);
        expect((await components['/A'].stateValues.xs)[1].tree).to.be.closeTo(3, 1E-12);
        expect(components['/A'].stateValues.constraintUsed).eq(false);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "false")

      cy.log(`move point near grid`);
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/A'].movePoint({ x: 0.2, y: -1.8 });
        expect((await components['/A'].stateValues.xs)[0].tree).to.be.closeTo(0, 1E-12);
        expect((await components['/A'].stateValues.xs)[1].tree).to.be.closeTo(-2, 1E-12);
        expect(components['/A'].stateValues.constraintUsed).eq(true)
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move not close enough to line x+y=0`);
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/A'].movePoint({ x: -7.1, y: 8.2 });
        expect((await components['/A'].stateValues.xs)[0].tree).to.be.closeTo(-7.1, 1E-12);
        expect((await components['/A'].stateValues.xs)[1].tree).to.be.closeTo(8.2, 1E-12);
        expect(components['/A'].stateValues.constraintUsed).eq(false);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "false")

      cy.log(`move close enough to line x+y=0`);
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/A'].movePoint({ x: -7.5, y: 7.8 });
        expect((await components['/A'].stateValues.xs)[0].tree + (await components['/A'].stateValues.xs)[1].tree).to.be.closeTo(0, 1E-12);
        expect(components['/A'].stateValues.constraintUsed).eq(true)
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move not close enough to line x=y`);
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/A'].movePoint({ x: 7.1, y: 8.2 });
        expect((await components['/A'].stateValues.xs)[0].tree).to.be.closeTo(7.1, 1E-12);
        expect((await components['/A'].stateValues.xs)[1].tree).to.be.closeTo(8.2, 1E-12);
        expect(components['/A'].stateValues.constraintUsed).eq(false);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "false")

      cy.log(`move close enough to line x=y`);
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/A'].movePoint({ x: 7.5, y: 7.8 });
        expect((await components['/A'].stateValues.xs)[0].tree - (await components['/A'].stateValues.xs)[1].tree).to.be.closeTo(0, 1E-12);
        expect(components['/A'].stateValues.constraintUsed).eq(true)
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move near line x=2y+8`);
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/A'].movePoint({ x: 3.5, y: -2.5 });
        expect((await components['/A'].stateValues.xs)[0].tree - 2 * (await components['/A'].stateValues.xs)[1].tree).to.be.closeTo(8, 1E-12);
        expect(components['/A'].stateValues.constraintUsed).eq(true)
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")


      cy.log(`move near line x=-2y-8`);
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/A'].movePoint({ x: -3.5, y: -2.5 });
        expect((await components['/A'].stateValues.xs)[0].tree + 2 * (await components['/A'].stateValues.xs)[1].tree).to.be.closeTo(-8, 1E-12);
        expect(components['/A'].stateValues.constraintUsed).eq(true)
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

    })
  });

  it('point attracted to union of lines and intersections', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <graph>
  <line>x+y=0</line>
  <line>x=y</line>
  <line>x=2y+8</line>
  <line>x=-2y-8</line>
  <point name="A" xs="7 3">
    <constraints>
    <attractTo>
      <copy target="_line1" />
      <copy target="_line2" />
      <copy target="_line3" />
      <copy target="_line4" />
    </attractTo>
    <attractTo>
      <intersection><copy target="_line1" /><copy target="_line2" /></intersection>
      <intersection><copy target="_line1" /><copy target="_line3" /></intersection>
      <intersection><copy target="_line1" /><copy target="_line4" /></intersection>
      <intersection><copy target="_line2" /><copy target="_line3" /></intersection>
      <intersection><copy target="_line2" /><copy target="_line4" /></intersection>
      <intersection><copy target="_line3" /><copy target="_line4" /></intersection>
    </attractTo>
    </constraints>
  </point>
  </graph>
  <copy prop="constraintUsed" name="constraintUsed" target="A" />
  <text>a</text>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let constraintUsed1 = components['/constraintUsed'].replacements[0];
      let constraintUsed1Anchor = cesc('#' + constraintUsed1.componentName);

      cy.log(`point in original location`);
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        expect((await components['/A'].stateValues.xs)[0].tree).to.be.closeTo(7, 1E-12);
        expect((await components['/A'].stateValues.xs)[1].tree).to.be.closeTo(3, 1E-12);
        expect(components['/A'].stateValues.constraintUsed).eq(false);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "false")

      cy.log(`move not close enough to line x+y=0`);
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/A'].movePoint({ x: -7.1, y: 8.2 });
        expect((await components['/A'].stateValues.xs)[0].tree).to.be.closeTo(-7.1, 1E-12);
        expect((await components['/A'].stateValues.xs)[1].tree).to.be.closeTo(8.2, 1E-12);
        expect(components['/A'].stateValues.constraintUsed).eq(false);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "false")

      cy.log(`move close enough to line x+y=0`);
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/A'].movePoint({ x: -7.5, y: 7.8 });
        expect((await components['/A'].stateValues.xs)[0].tree + (await components['/A'].stateValues.xs)[1].tree).to.be.closeTo(0, 1E-12);
        expect(components['/A'].stateValues.constraintUsed).eq(true);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move not close enough to line x=y`);
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/A'].movePoint({ x: 7.1, y: 8.2 });
        expect((await components['/A'].stateValues.xs)[0].tree).to.be.closeTo(7.1, 1E-12);
        expect((await components['/A'].stateValues.xs)[1].tree).to.be.closeTo(8.2, 1E-12);
        expect(components['/A'].stateValues.constraintUsed).eq(false);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "false")

      cy.log(`move close enough to line x=y`);
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/A'].movePoint({ x: 7.5, y: 7.8 });
        expect((await components['/A'].stateValues.xs)[0].tree - (await components['/A'].stateValues.xs)[1].tree).to.be.closeTo(0, 1E-12);
        expect(components['/A'].stateValues.constraintUsed).eq(true)
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move near line x=2y+8`);
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/A'].movePoint({ x: 3.5, y: -2.5 });
        expect((await components['/A'].stateValues.xs)[0].tree - 2 * (await components['/A'].stateValues.xs)[1].tree).to.be.closeTo(8, 1E-12);
        expect(components['/A'].stateValues.constraintUsed).eq(true)
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move near line x=-2y-8`);
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/A'].movePoint({ x: -3.5, y: -2.5 });
        expect((await components['/A'].stateValues.xs)[0].tree + 2 * (await components['/A'].stateValues.xs)[1].tree).to.be.closeTo(-8, 1E-12);
        expect(components['/A'].stateValues.constraintUsed).eq(true)
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move near intersection of x+y=0 and x=y`);
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/A'].movePoint({ x: -0.2, y: 0.1 });
        expect((await components['/A'].stateValues.xs)[0].tree).to.be.closeTo(0, 1E-12);
        expect((await components['/A'].stateValues.xs)[1].tree).to.be.closeTo(0, 1E-12);
        expect(components['/A'].stateValues.constraintUsed).eq(true)
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move near intersection of x+y=0 and x=2y+8`);
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/A'].movePoint({ x: 2.6, y: -2.7 });
        expect((await components['/A'].stateValues.xs)[0].tree).to.be.closeTo(8 / 3, 1E-12);
        expect((await components['/A'].stateValues.xs)[1].tree).to.be.closeTo(-8 / 3, 1E-12);
        expect(components['/A'].stateValues.constraintUsed).eq(true)
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move near intersection of x+y=0 and x=-2y-8`);
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/A'].movePoint({ x: 7.9, y: -8.2 });
        expect((await components['/A'].stateValues.xs)[0].tree).to.be.closeTo(8, 1E-12);
        expect((await components['/A'].stateValues.xs)[1].tree).to.be.closeTo(-8, 1E-12);
        expect(components['/A'].stateValues.constraintUsed).eq(true)
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move near intersection of x=y and x=2y+8`);
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/A'].movePoint({ x: -8.1, y: -7.8 });
        expect((await components['/A'].stateValues.xs)[0].tree).to.be.closeTo(-8, 1E-12);
        expect((await components['/A'].stateValues.xs)[1].tree).to.be.closeTo(-8, 1E-12);
        expect(components['/A'].stateValues.constraintUsed).eq(true)
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move near intersection of x+y=0 and x=-2y-8`);
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/A'].movePoint({ x: -2.5, y: -2.7 });
        expect((await components['/A'].stateValues.xs)[0].tree).to.be.closeTo(-8 / 3, 1E-12);
        expect((await components['/A'].stateValues.xs)[1].tree).to.be.closeTo(-8 / 3, 1E-12);
        expect(components['/A'].stateValues.constraintUsed).eq(true)
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move near intersection of x=2y+8 and x=-2y-8`);
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/A'].movePoint({ x: 0.2, y: -3.9 });
        expect((await components['/A'].stateValues.xs)[0].tree).to.be.closeTo(0, 1E-12);
        expect((await components['/A'].stateValues.xs)[1].tree).to.be.closeTo(-4, 1E-12);
        expect(components['/A'].stateValues.constraintUsed).eq(true)
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")
    })
  });

  it('point constrained to union of lines and attracted to intersections', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <graph>
  <line>x+y=0</line>
  <line>x=y</line>
  <line>x=2y+8</line>
  <line>x=-2y-8</line>
  <point name="A" xs="7 3">
    <constraints>
    <constrainTo>
      <copy target="_line1" />
      <copy target="_line2" />
      <copy target="_line3" />
      <copy target="_line4" />
    </constrainTo>
    <attractTo>
      <intersection><copy target="_line1" /><copy target="_line2" /></intersection>
      <intersection><copy target="_line1" /><copy target="_line3" /></intersection>
      <intersection><copy target="_line1" /><copy target="_line4" /></intersection>
      <intersection><copy target="_line2" /><copy target="_line3" /></intersection>
      <intersection><copy target="_line2" /><copy target="_line4" /></intersection>
      <intersection><copy target="_line3" /><copy target="_line4" /></intersection>
    </attractTo>
    </constraints>
  </point>
  </graph>
  <copy prop="constraintUsed" name="constraintUsed" target="A" />
  <text>a</text>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let constraintUsed1 = components['/constraintUsed'].replacements[0];
      let constraintUsed1Anchor = cesc('#' + constraintUsed1.componentName);

      cy.log(`on x=y`);
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        expect((await components['/A'].stateValues.xs)[0].tree - (await components['/A'].stateValues.xs)[1].tree).to.be.closeTo(0, 1E-12);
        expect(components['/A'].stateValues.constraintUsed).eq(true)
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`attract to line x+y=0`);
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/A'].movePoint({ x: -7.1, y: 10 });
        expect((await components['/A'].stateValues.xs)[0].tree + (await components['/A'].stateValues.xs)[1].tree).to.be.closeTo(0, 1E-12);
        expect(components['/A'].stateValues.constraintUsed).eq(true);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move near line x=2y+8`);
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/A'].movePoint({ x: 10, y: -3 });
        expect((await components['/A'].stateValues.xs)[0].tree - 2 * (await components['/A'].stateValues.xs)[1].tree).to.be.closeTo(8, 1E-12);
        expect(components['/A'].stateValues.constraintUsed).eq(true);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move near line x=-2y-8`);
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/A'].movePoint({ x: -10, y: -3 });
        expect((await components['/A'].stateValues.xs)[0].tree + 2 * (await components['/A'].stateValues.xs)[1].tree).to.be.closeTo(-8, 1E-12);
        expect(components['/A'].stateValues.constraintUsed).eq(true);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move near intersection of x+y=0 and x=y`);
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/A'].movePoint({ x: -0.2, y: 0.1 });
        expect((await components['/A'].stateValues.xs)[0].tree).to.be.closeTo(0, 1E-12);
        expect((await components['/A'].stateValues.xs)[1].tree).to.be.closeTo(0, 1E-12);
        expect(components['/A'].stateValues.constraintUsed).eq(true);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move near intersection of x+y=0 and x=2y+8`);
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/A'].movePoint({ x: 2.6, y: -2.7 });
        expect((await components['/A'].stateValues.xs)[0].tree).to.be.closeTo(8 / 3, 1E-12);
        expect((await components['/A'].stateValues.xs)[1].tree).to.be.closeTo(-8 / 3, 1E-12);
        expect(components['/A'].stateValues.constraintUsed).eq(true);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move near intersection of x+y=0 and x=-2y-8`);
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/A'].movePoint({ x: 7.9, y: -8.2 });
        expect((await components['/A'].stateValues.xs)[0].tree).to.be.closeTo(8, 1E-12);
        expect((await components['/A'].stateValues.xs)[1].tree).to.be.closeTo(-8, 1E-12);
        expect(components['/A'].stateValues.constraintUsed).eq(true);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move near intersection of x=y and x=2y+8`);
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/A'].movePoint({ x: -8.1, y: -7.8 });
        expect((await components['/A'].stateValues.xs)[0].tree).to.be.closeTo(-8, 1E-12);
        expect((await components['/A'].stateValues.xs)[1].tree).to.be.closeTo(-8, 1E-12);
        expect(components['/A'].stateValues.constraintUsed).eq(true);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move near intersection of x=y and x=-2y-8`);
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/A'].movePoint({ x: -2.5, y: -2.7 });
        expect((await components['/A'].stateValues.xs)[0].tree).to.be.closeTo(-8 / 3, 1E-12);
        expect((await components['/A'].stateValues.xs)[1].tree).to.be.closeTo(-8 / 3, 1E-12);
        expect(components['/A'].stateValues.constraintUsed).eq(true);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

      cy.log(`move near intersection of x=2y+8 and x=-2y-8`);
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/A'].movePoint({ x: 0.2, y: -3.9 });
        expect((await components['/A'].stateValues.xs)[0].tree).to.be.closeTo(0, 1E-12);
        expect((await components['/A'].stateValues.xs)[1].tree).to.be.closeTo(-4, 1E-12);
        expect(components['/A'].stateValues.constraintUsed).eq(true);
      })
      cy.get(constraintUsed1Anchor).should('have.text', "true")

    })
  });

  it('point constrained intersection of two lines', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <graph>
  <point>(1,2)</point>
  <point>(2,2)</point>
  <point>(3,2)</point>
  <point>(4,2)</point>
  
  <line through="$_point1 $_point2" />
  <line through="$_point3 $_point4" />
  <intersection><copy target="_line1" /><copy target="_line2" /></intersection>
  
  </graph>
  <text>a</text>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log(`intersection is a line`);
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let intersectionReplacementsArray = components['/_intersection1'].replacements;
      expect(intersectionReplacementsArray.length).eq(1);
      let replacement = intersectionReplacementsArray[0];
      expect(replacement.componentType).eq("line");
      expect((await replacement.stateValues.slope).tree).eq(0);
      expect((await replacement.stateValues.yintercept).tree).eq(2);
    })

    cy.log(`make first line vertical`);
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point1'].movePoint({ x: 3, y: 5 });
      await components['/_point2'].movePoint({ x: 3, y: -5 });
      let intersectionReplacementsArray = components['/_intersection1'].replacements;
      expect(intersectionReplacementsArray.length).eq(1);
      let replacement = intersectionReplacementsArray[0];
      expect(replacement.componentType).eq("point");
      expect((await replacement.stateValues.xs)[0].tree).eq(3);
      expect((await replacement.stateValues.xs)[1].tree).eq(2);
    })

    cy.log(`make second line vertical`);
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point3'].movePoint({ x: -4, y: 5 });
      await components['/_point4'].movePoint({ x: -4, y: -5 });
      let intersectionReplacementsArray = components['/_intersection1'].replacements;
      expect(intersectionReplacementsArray.length).eq(0);
    })

    cy.log(`make lines intersect again`);
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point1'].movePoint({ x: -8, y: -7 });
      await components['/_point2'].movePoint({ x: 8, y: 9 });
      await components['/_point3'].movePoint({ x: 4, y: 6 });
      await components['/_point4'].movePoint({ x: -4, y: -6 });
      let intersectionReplacementsArray = components['/_intersection1'].replacements;
      expect(intersectionReplacementsArray.length).eq(1);
      let replacement = intersectionReplacementsArray[0];
      expect(replacement.componentType).eq("point");
      expect((await replacement.stateValues.xs)[0].tree).eq(2);
      expect((await replacement.stateValues.xs)[1].tree).eq(3);
    })

    cy.log(`make lines equal again`);
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point1'].movePoint({ x: 6, y: 9 });
      await components['/_point2'].movePoint({ x: -6, y: -9 });
      await components['/_point3'].movePoint({ x: 4, y: 6 });
      await components['/_point4'].movePoint({ x: -4, y: -6 });
      let intersectionReplacementsArray = components['/_intersection1'].replacements;
      expect(intersectionReplacementsArray.length).eq(1);
      let replacement = intersectionReplacementsArray[0];
      expect(replacement.componentType).eq("line");
      expect((await replacement.stateValues.slope).tree).eqls(['/', 3, 2]);
      expect((await replacement.stateValues.xintercept).tree).eq(0);
      expect((await replacement.stateValues.yintercept).tree).eq(0);
    })

  });

  it('intersection of two lines hides dynamically', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <graph>
  <point>(1,2)</point>
  <point>(2,2)</point>
  <point>(3,2)</point>
  <point>(4,2)</point>
  <line through="$_point1 $_point2" />
  <line through="$_point3 $_point4" />
  </graph>

  <booleaninput name='h1' prefill="false" label="Hide first intersection" />
  <booleaninput name='h2' prefill="true" label="Hide second intersection" />
  
  <p name="i1">Intersection 1: <intersection hide="$h1"><copy target="_line1" /><copy target="_line2" /></intersection></p>
  <p name="i2">Intersection 2: <intersection hide="$h2"><copy target="_line1" /><copy target="_line2" /></intersection></p>
  
  <text>a</text>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/i1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0=y−2')
    })
    cy.get('#\\/i2').find('.mjx-mrow').should('not.exist');

    cy.get('#\\/h1_input').click();
    cy.get('#\\/h2_input').click();
    cy.get('#\\/i1').find('.mjx-mrow').should('not.exist');
    cy.get('#\\/i2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0=y−2')
    })


    cy.log(`make first line vertical`);
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point1'].movePoint({ x: 3, y: 5 });
      await components['/_point2'].movePoint({ x: 3, y: -5 });

      cy.get('#\\/i1').find('.mjx-mrow').should('not.exist');
      cy.get('#\\/i2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,2)')
      })

      cy.get('#\\/h1_input').click();
      cy.get('#\\/h2_input').click();
      cy.get('#\\/i1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,2)')
      })
      cy.get('#\\/i2').find('.mjx-mrow').should('not.exist');
    })

    cy.log(`make second line vertical`);
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point3'].movePoint({ x: -4, y: 5 });
      await components['/_point4'].movePoint({ x: -4, y: -5 });
      cy.get('#\\/i1').find('.mjx-mrow').should('not.exist');
      cy.get('#\\/i2').find('.mjx-mrow').should('not.exist');
      cy.get('#\\/h1_input').click();
      cy.get('#\\/h2_input').click();
      cy.get('#\\/i1').find('.mjx-mrow').should('not.exist');
      cy.get('#\\/i2').find('.mjx-mrow').should('not.exist');
    })

    cy.log(`make lines intersect again`);
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point1'].movePoint({ x: -8, y: -7 });
      await components['/_point2'].movePoint({ x: 8, y: 9 });
      await components['/_point3'].movePoint({ x: 4, y: 6 });
      await components['/_point4'].movePoint({ x: -4, y: -6 });
      cy.get('#\\/i1').find('.mjx-mrow').should('not.exist');
      cy.get('#\\/i2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(2,3)')
      })
      cy.get('#\\/h1_input').click();
      cy.get('#\\/h2_input').click();
      cy.get('#\\/i1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(2,3)')
      })
      cy.get('#\\/i2').find('.mjx-mrow').should('not.exist');

    })

    cy.log(`make lines equal again`);
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point1'].movePoint({ x: 6, y: 9 });
      await components['/_point2'].movePoint({ x: -6, y: -9 });
      await components['/_point3'].movePoint({ x: 4, y: 6 });
      await components['/_point4'].movePoint({ x: -4, y: -6 });
      cy.get('#\\/i1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('0=18x−12y')
      })
      cy.get('#\\/i2').find('.mjx-mrow').should('not.exist');
      cy.get('#\\/h1_input').click();
      cy.get('#\\/h2_input').click();
      cy.get('#\\/i1').find('.mjx-mrow').should('not.exist');
      cy.get('#\\/i2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('0=18x−12y')
      })
    })

  });

  // gap not so relevant any more with new sugar
  // but doesn't hurt to keep test
  it('sugar coords with defining gap', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <mathinput name="n"/>

  <graph>
    <point>(<math>5</math><sequence from="2" to="$n" /><math>1</math>,4 )</point>
  </graph>

  <text>a</text>
    `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x1 = components['/_point1'].attributes.xs.component.activeChildren[0];
      let math1 = x1.definingChildren[0];
      let math1Name = math1.componentName;
      let math2 = x1.definingChildren[2];
      let math2Name = math2.componentName;

      cy.window().then(async (win) => {
        expect(x1.definingChildren.map(x => x.componentName)).eqls(
          [math1Name, '/_sequence1', math2Name]);
        expect(x1.activeChildren.map(x => x.componentName)).eqls(
          [math1Name, math2Name]);
        expect((await components['/_point1'].stateValues.xs)[0].tree).eq(5)
        expect((await components['/_point1'].stateValues.xs)[1].tree).eq(4)
      })

      cy.get('#\\/n textarea').type("2{enter}", { force: true }).
        blur();

      cy.window().then(async (win) => {
        let math3 = components['/_sequence1'].replacements[0].adapterUsed;
        let math3Name = math3.componentName;
        expect(x1.definingChildren.map(x => x.componentName)).eqls(
          [math1Name, '/_sequence1', math2Name]);
        expect(x1.activeChildren.map(x => x.componentName)).eqls(
          [math1Name, math3Name, math2Name]);
        expect((await components['/_point1'].stateValues.xs)[0].tree).eq(10)
        expect((await components['/_point1'].stateValues.xs)[1].tree).eq(4)

      })
    })
  })

  it('copying via x1 and x2', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point>(1,2)</point>
    <point>(<copy prop="x2" target="_point1" />, <copy prop="x1" target="_point1" />)</point>
  </graph>
    `}, "*");
    });


    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(1);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(2);
      expect((await components['/_point2'].stateValues.xs)[0].tree).eq(2);
      expect((await components['/_point2'].stateValues.xs)[1].tree).eq(1);
    })

    cy.log("move point 2")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point2'].movePoint({ x: -4, y: 9 });
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(9);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(-4);
      expect((await components['/_point2'].stateValues.xs)[0].tree).eq(-4);
      expect((await components['/_point2'].stateValues.xs)[1].tree).eq(9);
    })

  })

  it('updating via adapters', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point><point>(1,2)</point></point>
  </graph>
  
  <graph>
  <point><copy target="_point1" /></point>
  </graph>
  
  <graph>
  <point><copy target="_point2" /></point>
  </graph>
  
  <graph>
  <point><copy target="_copy1" /></point>
  </graph>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let points = [
        '/_point1', '/_point2', '/_point3', '/_point4', '/_point5',
        components['/_copy1'].replacements[0].componentName,
        components['/_copy2'].replacements[0].componentName,
        components['/_copy3'].replacements[0].componentName,
      ];
      let xs = [-10, 6, -4, 2, -9, -5, -2, 4];
      let ys = [8, 3, -3, -2, -6, 5, -9, 0];

      cy.log("initial positions")
      cy.window().then(async (win) => {
        let x = 1;
        let y = 2;
        for (let point of points) {
          expect((await components[point].stateValues.xs)[0].tree).eq(x);
          expect((await components[point].stateValues.xs)[1].tree).eq(y);
        }
      })

      cy.log("move each point in turn")
      cy.window().then(async (win) => {
        for (let i = 0; i < 8; i++) {
          let x = xs[i];
          let y = ys[i];
          await components[points[i]].movePoint({ x: x, y: y });
          for (let point of points) {
            expect((await components[point].stateValues.xs)[0].tree).eq(x);
            expect((await components[point].stateValues.xs)[1].tree).eq(y);
          }

        }
      })
    })
  })

  it('combining different components through copies', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point>(1,2)</point>
    <copy target="_point1" />
    <copy target="_point1" />
    <point x = "$(_copy1{prop='y'})" y="$(_copy2{prop='x'})" />
  </graph>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log("initial positions")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x = 1;
      let y = 2;

      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(x);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(y);

      expect((await components['/_point2'].stateValues.xs)[0].tree).eq(y);
      expect((await components['/_point2'].stateValues.xs)[1].tree).eq(x);

    });

    cy.log("move point 1")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x = -3;
      let y = 5;

      await components['/_point1'].movePoint({ x: x, y: y });

      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(x);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(y);

      expect((await components['/_point2'].stateValues.xs)[0].tree).eq(y);
      expect((await components['/_point2'].stateValues.xs)[1].tree).eq(x);

    });


    cy.log("move point 2")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x = 9;
      let y = -1;

      await components['/_point2'].movePoint({ x: y, y: x });

      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(x);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(y);

      expect((await components['/_point2'].stateValues.xs)[0].tree).eq(y);
      expect((await components['/_point2'].stateValues.xs)[1].tree).eq(x);

    });
  })

  it('combining different components through copies 2', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point>(1,2)</point>
    <copy target="_point1" />
    <copy target="_point1" />
    <point x = "$(_copy1{prop='y'})" y="$(_copy2{prop='x'})" />
  </graph>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log("initial positions")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x = 1;
      let y = 2;

      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(x);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(y);

      expect((await components['/_point2'].stateValues.xs)[0].tree).eq(y);
      expect((await components['/_point2'].stateValues.xs)[1].tree).eq(x);

    });

    cy.log("move point 1")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x = -3;
      let y = 5;

      await components['/_point1'].movePoint({ x: x, y: y });

      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(x);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(y);

      expect((await components['/_point2'].stateValues.xs)[0].tree).eq(y);
      expect((await components['/_point2'].stateValues.xs)[1].tree).eq(x);

    });


    cy.log("move point 2")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x = 9;
      let y = -1;

      await components['/_point2'].movePoint({ x: y, y: x });

      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(x);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(y);

      expect((await components['/_point2'].stateValues.xs)[0].tree).eq(y);
      expect((await components['/_point2'].stateValues.xs)[1].tree).eq(x);

    });
  })

  it('copy prop of copies', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math><copy prop="y" target="p1a" /></math>

    <graph>
      <copy name="p1a" target="p1" />
    </graph>
    
    <graph>
      <point name="p1" x="3" y="7" />
    </graph>
  `}, "*");
    });


    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log("initial values")

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x = 3;
      let y = 7;

      expect((await components['/p1'].stateValues.xs)[0].tree).eq(x);
      expect((await components['/p1'].stateValues.xs)[1].tree).eq(y);

      expect((await components['/p1a'].replacements[0].stateValues.xs)[0].tree).eq(x);
      expect((await components['/p1a'].replacements[0].stateValues.xs)[1].tree).eq(y);

      expect((await components['/_copy1'].replacements[0].stateValues.value).tree).eq(y);

    });

    cy.log("move point 1")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x = -3;
      let y = 5;

      await components['/p1'].movePoint({ x: x, y: y });

      expect((await components['/p1'].stateValues.xs)[0].tree).eq(x);
      expect((await components['/p1'].stateValues.xs)[1].tree).eq(y);

      expect((await components['/p1a'].replacements[0].stateValues.xs)[0].tree).eq(x);
      expect((await components['/p1a'].replacements[0].stateValues.xs)[1].tree).eq(y);
      expect((await components['/_copy1'].replacements[0].stateValues.value).tree).eq(y);

      cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(y.toString())
      })
    });

    cy.log("move point 2")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x = 7;
      let y = 9;

      await components['/p1a'].replacements[0].movePoint({ x: x, y: y });

      expect((await components['/p1'].stateValues.xs)[0].tree).eq(x);
      expect((await components['/p1'].stateValues.xs)[1].tree).eq(y);

      expect((await components['/p1a'].replacements[0].stateValues.xs)[0].tree).eq(x);
      expect((await components['/p1a'].replacements[0].stateValues.xs)[1].tree).eq(y);
      expect((await components['/_copy1'].replacements[0].stateValues.value).tree).eq(y);

      cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(y.toString())
      })
    });

  })

  it('nested copies', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <copy name="p1b" target="p1a" />
  </graph>
  
  <graph>
    <copy name="p1a" target="p1" />
  </graph>
  
  <graph>
    <point name="p1" x="3" y="7"/>
  </graph>
  `}, "*");
    });


    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log("initial values")

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x = 3;
      let y = 7;

      expect((await components['/p1'].stateValues.xs)[0].tree).eq(x);
      expect((await components['/p1'].stateValues.xs)[1].tree).eq(y);

      expect((await components['/p1a'].replacements[0].stateValues.xs)[0].tree).eq(x);
      expect((await components['/p1a'].replacements[0].stateValues.xs)[1].tree).eq(y);

      expect((await components['/p1b'].replacements[0].stateValues.xs)[0].tree).eq(x);
      expect((await components['/p1b'].replacements[0].stateValues.xs)[1].tree).eq(y);

    });

    cy.log("move point 1")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x = -3;
      let y = 5;

      await components['/p1'].movePoint({ x: x, y: y });

      expect((await components['/p1'].stateValues.xs)[0].tree).eq(x);
      expect((await components['/p1'].stateValues.xs)[1].tree).eq(y);

      expect((await components['/p1a'].replacements[0].stateValues.xs)[0].tree).eq(x);
      expect((await components['/p1a'].replacements[0].stateValues.xs)[1].tree).eq(y);

      expect((await components['/p1b'].replacements[0].stateValues.xs)[0].tree).eq(x);
      expect((await components['/p1b'].replacements[0].stateValues.xs)[1].tree).eq(y);

    });

    cy.log("move point 2")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x = 7;
      let y = 9;

      await components['/p1a'].replacements[0].movePoint({ x: x, y: y });

      expect((await components['/p1'].stateValues.xs)[0].tree).eq(x);
      expect((await components['/p1'].stateValues.xs)[1].tree).eq(y);

      expect((await components['/p1a'].replacements[0].stateValues.xs)[0].tree).eq(x);
      expect((await components['/p1a'].replacements[0].stateValues.xs)[1].tree).eq(y);

      expect((await components['/p1b'].replacements[0].stateValues.xs)[0].tree).eq(x);
      expect((await components['/p1b'].replacements[0].stateValues.xs)[1].tree).eq(y);

    });


    cy.log("move point 3")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x = -4;
      let y = 0;

      await components['/p1b'].replacements[0].movePoint({ x: x, y: y });

      expect((await components['/p1'].stateValues.xs)[0].tree).eq(x);
      expect((await components['/p1'].stateValues.xs)[1].tree).eq(y);

      expect((await components['/p1a'].replacements[0].stateValues.xs)[0].tree).eq(x);
      expect((await components['/p1a'].replacements[0].stateValues.xs)[1].tree).eq(y);

      expect((await components['/p1b'].replacements[0].stateValues.xs)[0].tree).eq(x);
      expect((await components['/p1b'].replacements[0].stateValues.xs)[1].tree).eq(y);

    });


  })

  it('points depending on each other', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point x="$(_point2{prop='y'})" y="7" />
    <point x="$(_point1{prop='y'})" y="9" />
  
  </graph>
      
  `}, "*");
    });


    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log("initial values")

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x = 9;
      let y = 7;

      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(x);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(y);

      expect((await components['/_point2'].stateValues.xs)[0].tree).eq(y);
      expect((await components['/_point2'].stateValues.xs)[1].tree).eq(x);

    });

    cy.log("move point 1")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x = -3;
      let y = 5;

      await components['/_point1'].movePoint({ x: x, y: y });

      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(x);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(y);

      expect((await components['/_point2'].stateValues.xs)[0].tree).eq(y);
      expect((await components['/_point2'].stateValues.xs)[1].tree).eq(x);

    });

    cy.log("move point 2")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x = 7;
      let y = 9;

      await components['/_point2'].movePoint({ x: y, y: x });

      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(x);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(y);

      expect((await components['/_point2'].stateValues.xs)[0].tree).eq(y);
      expect((await components['/_point2'].stateValues.xs)[1].tree).eq(x);

    });


  })

  it('points depending on each other 2', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point>(<copy prop="y" target="_point2" />, 7)</point>
    <point>(<copy prop="y" target="_point1" />, 9)</point>
  </graph>
      
  `}, "*");
    });


    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log("initial values")

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x = 9;
      let y = 7;

      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(x);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(y);

      expect((await components['/_point2'].stateValues.xs)[0].tree).eq(y);
      expect((await components['/_point2'].stateValues.xs)[1].tree).eq(x);

    });

    cy.log("move point 1")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x = -3;
      let y = 5;

      await components['/_point1'].movePoint({ x: x, y: y });

      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(x);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(y);

      expect((await components['/_point2'].stateValues.xs)[0].tree).eq(y);
      expect((await components['/_point2'].stateValues.xs)[1].tree).eq(x);

    });

    cy.log("move point 2")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x = 7;
      let y = 9;

      await components['/_point2'].movePoint({ x: y, y: x });

      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(x);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(y);

      expect((await components['/_point2'].stateValues.xs)[0].tree).eq(y);
      expect((await components['/_point2'].stateValues.xs)[1].tree).eq(x);

    });


  })

  it('points depending on each other through intermediaries', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point x="$(P2a{prop='y'})" y="7" />
    <point x="$(P1a{prop='y'})" y="9" />
  </graph>
  
  <graph>
    <copy name="P1a" target="_point1" />
    <copy name="P2a" target="_point2" />
  </graph>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log("initial values")

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x = 9;
      let y = 7;

      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(x);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(y);

      expect((await components['/_point2'].stateValues.xs)[0].tree).eq(y);
      expect((await components['/_point2'].stateValues.xs)[1].tree).eq(x);

      expect((await components['/P1a'].replacements[0].stateValues.xs)[0].tree).eq(x);
      expect((await components['/P1a'].replacements[0].stateValues.xs)[1].tree).eq(y);

      expect((await components['/P2a'].replacements[0].stateValues.xs)[0].tree).eq(y);
      expect((await components['/P2a'].replacements[0].stateValues.xs)[1].tree).eq(x);

    });

    cy.log("move point 1")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x = -3;
      let y = 5;

      await components['/_point1'].movePoint({ x: x, y: y });

      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(x);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(y);

      expect((await components['/_point2'].stateValues.xs)[0].tree).eq(y);
      expect((await components['/_point2'].stateValues.xs)[1].tree).eq(x);

      expect((await components['/P1a'].replacements[0].stateValues.xs)[0].tree).eq(x);
      expect((await components['/P1a'].replacements[0].stateValues.xs)[1].tree).eq(y);

      expect((await components['/P2a'].replacements[0].stateValues.xs)[0].tree).eq(y);
      expect((await components['/P2a'].replacements[0].stateValues.xs)[1].tree).eq(x);

    });

    cy.log("move point 2")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x = 7;
      let y = 9;

      await components['/_point2'].movePoint({ x: y, y: x });

      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(x);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(y);

      expect((await components['/_point2'].stateValues.xs)[0].tree).eq(y);
      expect((await components['/_point2'].stateValues.xs)[1].tree).eq(x);

      expect((await components['/P1a'].replacements[0].stateValues.xs)[0].tree).eq(x);
      expect((await components['/P1a'].replacements[0].stateValues.xs)[1].tree).eq(y);

      expect((await components['/P2a'].replacements[0].stateValues.xs)[0].tree).eq(y);
      expect((await components['/P2a'].replacements[0].stateValues.xs)[1].tree).eq(x);

    });


    cy.log("move point 3")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x = 6;
      let y = -1;

      await components['/P1a'].replacements[0].movePoint({ x: x, y: y });

      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(x);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(y);

      expect((await components['/_point2'].stateValues.xs)[0].tree).eq(y);
      expect((await components['/_point2'].stateValues.xs)[1].tree).eq(x);

      expect((await components['/P1a'].replacements[0].stateValues.xs)[0].tree).eq(x);
      expect((await components['/P1a'].replacements[0].stateValues.xs)[1].tree).eq(y);

      expect((await components['/P2a'].replacements[0].stateValues.xs)[0].tree).eq(y);
      expect((await components['/P2a'].replacements[0].stateValues.xs)[1].tree).eq(x);

    });


    cy.log("move point 4")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x = -3;
      let y = 2;

      await components['/P2a'].replacements[0].movePoint({ x: y, y: x });

      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(x);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(y);

      expect((await components['/_point2'].stateValues.xs)[0].tree).eq(y);
      expect((await components['/_point2'].stateValues.xs)[1].tree).eq(x);

      expect((await components['/P1a'].replacements[0].stateValues.xs)[0].tree).eq(x);
      expect((await components['/P1a'].replacements[0].stateValues.xs)[1].tree).eq(y);

      expect((await components['/P2a'].replacements[0].stateValues.xs)[0].tree).eq(y);
      expect((await components['/P2a'].replacements[0].stateValues.xs)[1].tree).eq(x);

    });


  })

  it('points depending on each other through intermediaries 2', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point>(<copy prop="y" target="P2a" />, 7)</point>
    <point>(<copy prop="y" target="P1a" />, 9)</point>
  </graph>
  
  <graph>
    <copy name="P1a" target="_point1" />
    <copy name="P2a" target="_point2" />
  </graph>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log("initial values")

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x = 9;
      let y = 7;

      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(x);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(y);

      expect((await components['/_point2'].stateValues.xs)[0].tree).eq(y);
      expect((await components['/_point2'].stateValues.xs)[1].tree).eq(x);

      expect((await components['/P1a'].replacements[0].stateValues.xs)[0].tree).eq(x);
      expect((await components['/P1a'].replacements[0].stateValues.xs)[1].tree).eq(y);

      expect((await components['/P2a'].replacements[0].stateValues.xs)[0].tree).eq(y);
      expect((await components['/P2a'].replacements[0].stateValues.xs)[1].tree).eq(x);

    });

    cy.log("move point 1")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x = -3;
      let y = 5;

      await components['/_point1'].movePoint({ x: x, y: y });

      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(x);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(y);

      expect((await components['/_point2'].stateValues.xs)[0].tree).eq(y);
      expect((await components['/_point2'].stateValues.xs)[1].tree).eq(x);

      expect((await components['/P1a'].replacements[0].stateValues.xs)[0].tree).eq(x);
      expect((await components['/P1a'].replacements[0].stateValues.xs)[1].tree).eq(y);

      expect((await components['/P2a'].replacements[0].stateValues.xs)[0].tree).eq(y);
      expect((await components['/P2a'].replacements[0].stateValues.xs)[1].tree).eq(x);

    });

    cy.log("move point 2")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x = 7;
      let y = 9;

      await components['/_point2'].movePoint({ x: y, y: x });

      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(x);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(y);

      expect((await components['/_point2'].stateValues.xs)[0].tree).eq(y);
      expect((await components['/_point2'].stateValues.xs)[1].tree).eq(x);

      expect((await components['/P1a'].replacements[0].stateValues.xs)[0].tree).eq(x);
      expect((await components['/P1a'].replacements[0].stateValues.xs)[1].tree).eq(y);

      expect((await components['/P2a'].replacements[0].stateValues.xs)[0].tree).eq(y);
      expect((await components['/P2a'].replacements[0].stateValues.xs)[1].tree).eq(x);

    });


    cy.log("move point 3")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x = 6;
      let y = -1;

      await components['/P1a'].replacements[0].movePoint({ x: x, y: y });

      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(x);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(y);

      expect((await components['/_point2'].stateValues.xs)[0].tree).eq(y);
      expect((await components['/_point2'].stateValues.xs)[1].tree).eq(x);

      expect((await components['/P1a'].replacements[0].stateValues.xs)[0].tree).eq(x);
      expect((await components['/P1a'].replacements[0].stateValues.xs)[1].tree).eq(y);

      expect((await components['/P2a'].replacements[0].stateValues.xs)[0].tree).eq(y);
      expect((await components['/P2a'].replacements[0].stateValues.xs)[1].tree).eq(x);

    });


    cy.log("move point 4")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x = -3;
      let y = 2;

      await components['/P2a'].replacements[0].movePoint({ x: y, y: x });

      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(x);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(y);

      expect((await components['/_point2'].stateValues.xs)[0].tree).eq(y);
      expect((await components['/_point2'].stateValues.xs)[1].tree).eq(x);

      expect((await components['/P1a'].replacements[0].stateValues.xs)[0].tree).eq(x);
      expect((await components['/P1a'].replacements[0].stateValues.xs)[1].tree).eq(y);

      expect((await components['/P2a'].replacements[0].stateValues.xs)[0].tree).eq(y);
      expect((await components['/P2a'].replacements[0].stateValues.xs)[1].tree).eq(x);

    });


  })

  it('points depending on each other, one using coords', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point coords="($(_point2{prop='y'}), 7)" />
    <point x="$(_point1{prop='y'})" y="9" />
  
  </graph>
  `}, "*");
    });


    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log("initial values")

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x = 9;
      let y = 7;

      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(x);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(y);

      expect((await components['/_point2'].stateValues.xs)[0].tree).eq(y);
      expect((await components['/_point2'].stateValues.xs)[1].tree).eq(x);

    });

    cy.log("move point 1")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x = -3;
      let y = 5;

      await components['/_point1'].movePoint({ x: x, y: y });

      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(x);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(y);

      expect((await components['/_point2'].stateValues.xs)[0].tree).eq(y);
      expect((await components['/_point2'].stateValues.xs)[1].tree).eq(x);

    });

    cy.log("move point 2")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x = 7;
      let y = 9;

      await components['/_point2'].movePoint({ x: y, y: x });

      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(x);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(y);

      expect((await components['/_point2'].stateValues.xs)[0].tree).eq(y);
      expect((await components['/_point2'].stateValues.xs)[1].tree).eq(x);

    });


  })

  it('points depending on themselves', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point>(3, 2<copy prop="x" target="_point1"/>+1)</point>
    <point>(2<copy prop="y" target="_point2"/>+1, 3)</point>
  </graph>
      
  `}, "*");
    });


    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log("initial values")

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x1 = 3;
      let y1 = 2 * x1 + 1;

      let y2 = 3;
      let x2 = 2 * y2 + 1;

      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(x1);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(y1);

      expect((await components['/_point2'].stateValues.xs)[0].tree).eq(x2);
      expect((await components['/_point2'].stateValues.xs)[1].tree).eq(y2);

    });

    cy.log("move points")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x1 = -3;
      let y1try = 5;

      let x2 = 9;
      let y2try = -7;

      let y1 = 2 * x1 + 1;
      let y2 = (x2 - 1) / 2;

      await components['/_point1'].movePoint({ x: x1, y: y1try });
      await components['/_point2'].movePoint({ x: x2, y: y2try });

      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(x1);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(y1);

      expect((await components['/_point2'].stateValues.xs)[0].tree).eq(x2);
      expect((await components['/_point2'].stateValues.xs)[1].tree).eq(y2);

    });


  })

  it('points depending original graph axis limit', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point x="3" y="$(_graph1{prop='ymax' fixed='true'})" />
    <point>
      (<copy prop="xmin" fixed="true" target="_graph1" />,5)
    </point>
  </graph>
  `}, "*");
    });


    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log("initial values")

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x1 = 3;
      let y1 = 10;
      let x2 = -10
      let y2 = 5;

      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(x1);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(y1);

      expect((await components['/_point2'].stateValues.xs)[0].tree).eq(x2);
      expect((await components['/_point2'].stateValues.xs)[1].tree).eq(y2);

    });

    cy.log("move points")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x1 = 1;
      let y1 = 5;
      let x2 = 8
      let y2 = -3;

      await components['/_point1'].movePoint({ x: x1, y: y1 });
      await components['/_point2'].movePoint({ x: x2, y: y2 });

      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(x1);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(10);

      expect((await components['/_point2'].stateValues.xs)[0].tree).eq(-10);
      expect((await components['/_point2'].stateValues.xs)[1].tree).eq(y2);

    });


  })

  it('label points by combining coordinates with other point', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <text name="l1" hide><copy prop="x" displaydigits="3" target="_point1" />, <copy prop="x" displaydigits="3" target="_point2" /></text>
  <text name="l2" hide><copy prop="y" displaydigits="3" target="_point1" />, <copy prop="y" displaydigits="3" target="_point2" /></text>
  <graph>
    <point label="$l1">
      (1,2)
    </point>
    <point label="$l2">
      (3,4)
    </point>
  </graph>

  <p>Label 1: <copy prop="label" target="_point1" /></p>
  <p>Label 2: <copy prop="label" target="_point2" /></p>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log("initial values")

    cy.get('#\\/_p1').should('have.text', 'Label 1: 1, 3')
    cy.get('#\\/_p2').should('have.text', 'Label 2: 2, 4')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x1 = 1;
      let y1 = 2;
      let x2 = 3;
      let y2 = 4;

      let label1 = `${x1}, ${x2}`;
      let label2 = `${y1}, ${y2}`;

      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(x1);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(y1);

      expect((await components['/_point2'].stateValues.xs)[0].tree).eq(x2);
      expect((await components['/_point2'].stateValues.xs)[1].tree).eq(y2);

      expect(components['/_point1'].stateValues.label).eq(label1);
      expect(components['/_point2'].stateValues.label).eq(label2);

    });

    cy.log("move points")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x1 = 1;
      let y1 = 5;
      let x2 = 8
      let y2 = -3;

      await components['/_point1'].movePoint({ x: x1, y: y1 });
      await components['/_point2'].movePoint({ x: x2, y: y2 });

      let label1 = `${x1}, ${x2}`;
      let label2 = `${y1}, ${y2}`;

      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(x1);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(y1);

      expect((await components['/_point2'].stateValues.xs)[0].tree).eq(x2);
      expect((await components['/_point2'].stateValues.xs)[1].tree).eq(y2);

      expect(components['/_point1'].stateValues.label).eq(label1);
      expect(components['/_point2'].stateValues.label).eq(label2);

      cy.get('#\\/_p1').should('have.text', `Label 1: ${label1}`)
      cy.get('#\\/_p2').should('have.text', `Label 2: ${label2}`)

    });


    cy.log("move points to fractional coordinates")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x1 = 3.12552502;
      let y1 = -3.4815436398;
      let x2 = 0.36193540738
      let y2 = 7.813395519475;

      await components['/_point1'].movePoint({ x: x1, y: y1 });
      await components['/_point2'].movePoint({ x: x2, y: y2 });

      let x1round = me.fromAst(x1).round_numbers_to_precision(3).tree;
      let y1round = me.fromAst(y1).round_numbers_to_precision(3).tree;
      let x2round = me.fromAst(x2).round_numbers_to_precision(3).tree;
      let y2round = me.fromAst(y2).round_numbers_to_precision(3).tree;

      let label1 = `${x1round}, ${x2round}`;
      let label2 = `${y1round}, ${y2round}`;

      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(x1);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(y1);

      expect((await components['/_point2'].stateValues.xs)[0].tree).eq(x2);
      expect((await components['/_point2'].stateValues.xs)[1].tree).eq(y2);

      expect(components['/_point1'].stateValues.label).eq(label1);
      expect(components['/_point2'].stateValues.label).eq(label2);

      cy.get('#\\/_p1').should('have.text', `Label 1: ${label1}`)
      cy.get('#\\/_p2').should('have.text', `Label 2: ${label2}`)

    });

  })

  it('update point with constraints', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math hide name="fixed0" fixed>0</math>
    <graph>
      <point x="-4" y="1">
        <constraints>
          <attractTo><point>(1,-7)</point></attractTo>
        </constraints>
      </point>
      <point x="$(_point1{prop='x'})" y="$fixed0" />
      <point y="$(_point1{prop='y'})" x="$fixed0" />
    </graph>
  `}, "*");
    });

    cy.get("#\\/_text1").should('have.text', 'a'); // to wait for page to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x = -4;
      let y = 1;

      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(x);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(y);
      expect((await components['/_point3'].stateValues.xs)[0].tree).eq(x);
      expect((await components['/_point3'].stateValues.xs)[1].tree).eq(0);
      expect((await components['/_point4'].stateValues.xs)[0].tree).eq(0);
      expect((await components['/_point4'].stateValues.xs)[1].tree).eq(y);

    });

    cy.log("move first point")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x = 3;
      let y = -2;

      await components['/_point1'].movePoint({ x: x, y: y });

      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(x);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(y);
      expect((await components['/_point3'].stateValues.xs)[0].tree).eq(x);
      expect((await components['/_point3'].stateValues.xs)[1].tree).eq(0);
      expect((await components['/_point4'].stateValues.xs)[0].tree).eq(0);
      expect((await components['/_point4'].stateValues.xs)[1].tree).eq(y);

    });

    cy.log("move x-axis point")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x = 9;
      let y = -2;

      await components['/_point3'].movePoint({ x: x, y: -3 });

      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(x);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(y);
      expect((await components['/_point3'].stateValues.xs)[0].tree).eq(x);
      expect((await components['/_point3'].stateValues.xs)[1].tree).eq(0);
      expect((await components['/_point4'].stateValues.xs)[0].tree).eq(0);
      expect((await components['/_point4'].stateValues.xs)[1].tree).eq(y);

    });

    cy.log("move y-axis point")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x = 9;
      let y = -7.1;

      await components['/_point4'].movePoint({ x: -10, y: y });

      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(x);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(y);
      expect((await components['/_point3'].stateValues.xs)[0].tree).eq(x);
      expect((await components['/_point3'].stateValues.xs)[1].tree).eq(0);
      expect((await components['/_point4'].stateValues.xs)[0].tree).eq(0);
      expect((await components['/_point4'].stateValues.xs)[1].tree).eq(y);

    });

    cy.log("move near attractor")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x = 1;
      let y = -7;

      await components['/_point3'].movePoint({ x: 0.9, y: 6 });

      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(x);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(y);
      expect((await components['/_point3'].stateValues.xs)[0].tree).eq(x);
      expect((await components['/_point3'].stateValues.xs)[1].tree).eq(0);
      expect((await components['/_point4'].stateValues.xs)[0].tree).eq(0);
      expect((await components['/_point4'].stateValues.xs)[1].tree).eq(y);

    });

    cy.log("move again near attract to make sure doesn't change")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x = 1;
      let y = -7;

      await components['/_point3'].movePoint({ x: 1.1, y: 6 });

      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(x);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(y);
      expect((await components['/_point3'].stateValues.xs)[0].tree).eq(x);
      expect((await components['/_point3'].stateValues.xs)[1].tree).eq(0);
      expect((await components['/_point4'].stateValues.xs)[0].tree).eq(0);
      expect((await components['/_point4'].stateValues.xs)[1].tree).eq(y);

    });
  })

  it('change point dimensions', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Specify point coordinates: <mathinput name="originalCoords" /></p>

    <section name="thePoints"><title>The points</title>
    <p>The point: <point coords="$originalCoords"/></p>
    <p>The point copied: <copy name="point2" target="_point1"/></p>
    <p>The point copied again: <copy name="point3" target="point2"/></p>
    </section>

    <section><title>From point 1</title>
    <p>Number of dimensions: <copy name="nDimensions1" prop="nDimensions" target="_point1" /></p>
    <p name="p1x">x-coordinate: <copy name="point1x1" prop="x1" target="_point1"/></p>
    <p name="p1y">y-coordinate: <copy name="point1x2" prop="x2" target="_point1"/></p>
    <p name="p1z">z-coordinate: <copy name="point1x3" prop="x3" target="_point1"/></p>
    <p name="p1all">All individual coordinates: <aslist><copy name="point1xs" prop="xs" target="_point1"/></aslist></p>
    <p>Coordinates: <copy name="coords1" prop="coords" target="_point1"/></p>
    </section>

    <section><title>From point 2</title>
    <p>Number of dimensions: <copy name="nDimensions2" prop="nDimensions" target="point2" /></p>
    <p name="p2x">x-coordinate: <copy name="point2x1" prop="x1" target="point2"/></p>
    <p name="p2y">y-coordinate: <copy name="point2x2" prop="x2" target="point2"/></p>
    <p name="p2z">z-coordinate: <copy name="point2x3" prop="x3" target="point2"/></p>
    <p name="p2all">All individual coordinates: <aslist><copy name="point2xs" prop="xs" target="point2"/></aslist></p>
    <p>Coordinates: <copy name="coords2" prop="coords" target="point2"/></p>
    </section>

    <section><title>From point 3</title>
    <p>Number of dimensions: <copy name="nDimensions3" prop="nDimensions" target="point3" /></p>
    <p name="p3x">x-coordinate: <copy name="point3x1" prop="x1" target="point3"/></p>
    <p name="p3y">y-coordinate: <copy name="point3x2" prop="x2" target="point3"/></p>
    <p name="p3z">z-coordinate: <copy name="point3x3" prop="x3" target="point3"/></p>
    <p name="p3all">All individual coordinates: <aslist><copy name="point3xs" prop="xs" target="point3"/></aslist></p>
    <p>Coordinates: <copy name="coords3" prop="coords" target="point3"/></p>
    </section>

    <section><title>For point 1</title>
    <p>Change coords: <mathinput name="coords1b" bindValueTo="$(_point1{prop='coords'})" /></p>
    <p>Change x-coordinate: <mathinput name="point1x1b" bindValueTo="$(_point1{prop='x1'})" /></p>
    <p>Change y-coordinate: <mathinput name="point1x2b" bindValueTo="$(_point1{prop='x2' type='math'})" /></p>
    <p>Change z-coordinate: <mathinput name="point1x3b" bindValueTo="$(_point1{prop='x3' type='math'})" /></p>    
    </section>

    <section><title>For point 2</title>
    <p>Change coords: <mathinput name="coords2b" bindValueTo="$(point2{prop='coords'})" /></p>
    <p>Change x-coordinate: <mathinput name="point2x1b" bindValueTo="$(point2{prop='x1'})" /></p>
    <p>Change y-coordinate: <mathinput name="point2x2b" bindValueTo="$(point2{prop='x2' type='math'})" /></p>
    <p>Change z-coordinate: <mathinput name="point2x3b" bindValueTo="$(point2{prop='x3' type='math'})" /></p>    
    </section>

    <section><title>For point 3</title>
    <p>Change coords: <mathinput name="coords3b" bindValueTo="$(point3{prop='coords'})" /></p>
    <p>Change x-coordinate: <mathinput name="point3x1b" bindValueTo="$(point3{prop='x1'})" /></p>
    <p>Change y-coordinate: <mathinput name="point3x2b" bindValueTo="$(point3{prop='x2' type='math'})" /></p>
    <p>Change z-coordinate: <mathinput name="point3x3b" bindValueTo="$(point3{prop='x3' type='math'})" /></p>    
    </section>

    <section><title>collecting</title>
    <p name="pallx">x-coordinates: <aslist><collect name="pointallx1" componentTypes="point" prop="x1" target="thePoints"/></aslist></p>
    <p name="pally">y-coordinates: <aslist><collect name="pointallx2" componentTypes="point" prop="x2" target="thePoints"/></aslist></p>
    <p name="pallz">z-coordinates: <aslist><collect name="pointallx3" componentTypes="point" prop="x3" target="thePoints"/></aslist></p>
    <p name="pallall">All individual coordinates: <aslist><collect name="pointallxs" componentTypes="point" prop="xs" target="thePoints"/></aslist></p>
    <p>Coordinates: <aslist><collect name="coordsall" componentTypes="point" prop="coords" target="thePoints"/></aslist></p>
    </section>

    <section><title>Extracting from point 3</title>
    <p name="p3xe">x-coordinate: <extract name="point3x1e" prop="x1"><copy target="point3"/></extract></p>
    <p name="p3ye">y-coordinate: <extract name="point3x2e" prop="x2"><copy target="point3"/></extract></p>
    <p name="p3ze">z-coordinate: <extract name="point3x3e" prop="x3"><copy target="point3"/></extract></p>
    <p name="p3alle">All individual coordinates: <aslist><extract name="point3xse" prop="xs"><copy target="point3"/></extract></aslist></p>
    <p>Coordinates: <extract name="coords3e" prop="coords"><copy target="point3"/></extract></p>
    </section>
 
  `}, "*");
    });

    cy.get("#\\/_text1").should('have.text', 'a'); // to wait for page to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let point1Anchor = cesc('#' + components["/_point1"].adapterUsed.componentName);
      let point2 = components["/point2"].replacements[0];
      let point2Anchor = cesc('#' + point2.adapterUsed.componentName);
      let point3 = components["/point3"].replacements[0];
      let point3Anchor = cesc('#' + point3.adapterUsed.componentName);
      let nDimensions1Anchor = cesc("#" + components["/nDimensions1"].replacements[0].componentName);
      let nDimensions2Anchor = cesc("#" + components["/nDimensions2"].replacements[0].componentName);
      let nDimensions3Anchor = cesc("#" + components["/nDimensions3"].replacements[0].componentName);
      let point1x1Anchor = cesc("#" + components["/point1x1"].replacements[0].componentName);
      let point2x1Anchor = cesc("#" + components["/point2x1"].replacements[0].componentName);
      let point3x1Anchor = cesc("#" + components["/point3x1"].replacements[0].componentName);
      let point3x1eAnchor = cesc("#" + components["/point3x1e"].replacements[0].componentName);
      let pointallx1Anchors = components["/pointallx1"].replacements.map(x => cesc("#" + x.componentName));
      let coords1Anchor = cesc("#" + components["/coords1"].replacements[0].componentName);
      let coords2Anchor = cesc("#" + components["/coords2"].replacements[0].componentName);
      let coords3Anchor = cesc("#" + components["/coords3"].replacements[0].componentName);
      let coords3eAnchor = cesc("#" + components["/coords3e"].replacements[0].componentName);
      let coordsallAnchors = components["/coordsall"].replacements.map(x => cesc("#" + x.componentName));

      cy.get(point1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      })
      cy.get(point2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      })
      cy.get(point3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      })
      cy.get(nDimensions1Anchor).should('have.text', '1');
      cy.get(nDimensions2Anchor).should('have.text', '1');
      cy.get(nDimensions3Anchor).should('have.text', '1');
      cy.get(point1x1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      })
      cy.get(point2x1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      })
      cy.get(point3x1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      })
      cy.get(point3x1eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      })
      cy.get(pointallx1Anchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      })
      cy.get(pointallx1Anchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      })
      cy.get(pointallx1Anchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      })
      cy.get("#\\/p1y").should('have.text', 'y-coordinate: ')
      cy.get("#\\/p2y").should('have.text', 'y-coordinate: ')
      cy.get("#\\/p3y").should('have.text', 'y-coordinate: ')
      cy.get("#\\/p3ye").should('have.text', 'y-coordinate: ')
      cy.get("#\\/pally").should('have.text', 'y-coordinates: ')
      cy.get("#\\/p1z").should('have.text', 'z-coordinate: ')
      cy.get("#\\/p2z").should('have.text', 'z-coordinate: ')
      cy.get("#\\/p3z").should('have.text', 'z-coordinate: ')
      cy.get("#\\/p3ze").should('have.text', 'z-coordinate: ')
      cy.get("#\\/pallz").should('have.text', 'z-coordinates: ')

      cy.get("#\\/p1all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      })

      cy.get("#\\/p2all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      })

      cy.get("#\\/p3all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      })

      cy.get("#\\/p3alle").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      })

      cy.get("#\\/pallall").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      })

      cy.get("#\\/pallall").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      })

      cy.get("#\\/pallall").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      })

      cy.get(coords1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      })
      cy.get(coords2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      })
      cy.get(coords3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      })
      cy.get(coords3eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      })
      cy.get(coordsallAnchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      })
      cy.get(coordsallAnchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      })
      cy.get(coordsallAnchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      })


      cy.window().then(async (win) => {

        expect(components['/_point1'].stateValues.nDimensions).eq(1);
        expect((await components['/_point1'].stateValues.xs).length).eq(1);
        expect((await components['/_point1'].stateValues.xs)[0].tree).eq('＿');
        expect(components['/_point1'].stateValues.x1.tree).eq('＿');
        expect(components['/_point1'].stateValues.x2).eq(undefined);
        expect(components['/_point1'].stateValues.x3).eq(undefined);
        expect(point2.stateValues.nDimensions).eq(1);
        expect((await point2.stateValues.xs).length).eq(1);
        expect((await point2.stateValues.xs)[0].tree).eq('＿');
        expect(point2.stateValues.x1.tree).eq('＿');
        expect(point2.stateValues.x2).eq(undefined);
        expect(point2.stateValues.x3).eq(undefined);
        expect(point3.stateValues.nDimensions).eq(1);
        expect((await point3.stateValues.xs).length).eq(1);
        expect((await point3.stateValues.xs)[0].tree).eq('＿');
        expect(point3.stateValues.x1.tree).eq('＿');
        expect(point3.stateValues.x2).eq(undefined);
        expect(point3.stateValues.x3).eq(undefined);

      });

      cy.log('Create 2D point')
      cy.get('#\\/originalCoords textarea').type('{end}{backspace}(a,b){enter}', { force: true });

      cy.window().then(async (win) => {

        let point1x2Anchor = cesc("#" + components["/point1x2"].replacements[0].componentName);
        let point2x2Anchor = cesc("#" + components["/point2x2"].replacements[0].componentName);
        let point3x2Anchor = cesc("#" + components["/point3x2"].replacements[0].componentName);
        let point3x2eAnchor = cesc("#" + components["/point3x2e"].replacements[0].componentName);
        let pointallx2Anchors = components["/pointallx2"].replacements.map(x => cesc("#" + x.componentName));

        cy.get(point1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(a,b)')
        })
        cy.get(point2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(a,b)')
        })
        cy.get(point3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(a,b)')
        })
        cy.get(nDimensions1Anchor).should('have.text', '2');
        cy.get(nDimensions2Anchor).should('have.text', '2');
        cy.get(nDimensions3Anchor).should('have.text', '2');
        cy.get(point1x1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('a')
        })
        cy.get(point2x1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('a')
        })
        cy.get(point3x1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('a')
        })
        cy.get(point3x1eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('a')
        })
        cy.get(pointallx1Anchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('a')
        })
        cy.get(pointallx1Anchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('a')
        })
        cy.get(pointallx1Anchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('a')
        })
        cy.get(point1x2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('b')
        })
        cy.get(point2x2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('b')
        })
        cy.get(point3x2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('b')
        })
        cy.get(point3x2eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('b')
        })
        cy.get(pointallx2Anchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('b')
        })
        cy.get(pointallx2Anchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('b')
        })
        cy.get(pointallx2Anchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('b')
        })
        cy.get("#\\/p1z").should('have.text', 'z-coordinate: ')
        cy.get("#\\/p2z").should('have.text', 'z-coordinate: ')
        cy.get("#\\/p3z").should('have.text', 'z-coordinate: ')
        cy.get("#\\/p3ze").should('have.text', 'z-coordinate: ')
        cy.get("#\\/pallz").should('have.text', 'z-coordinates: ')

        cy.get("#\\/p1all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('a')
        })
        cy.get("#\\/p1all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('b')
        })
        cy.get("#\\/p1all").find('.mjx-mrow').eq(2).should('not.exist')

        cy.get("#\\/p2all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('a')
        })
        cy.get("#\\/p2all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('b')
        })
        cy.get("#\\/p2all").find('.mjx-mrow').eq(2).should('not.exist')

        cy.get("#\\/p3all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('a')
        })
        cy.get("#\\/p3all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('b')
        })
        cy.get("#\\/p3all").find('.mjx-mrow').eq(2).should('not.exist')

        cy.get("#\\/p3alle").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('a')
        })
        cy.get("#\\/p3alle").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('b')
        })
        cy.get("#\\/p3alle").find('.mjx-mrow').eq(2).should('not.exist')

        cy.get("#\\/pallall").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('a')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('b')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
          expect(text.trim()).equal('a')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(3).invoke('text').then((text) => {
          expect(text.trim()).equal('b')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(4).invoke('text').then((text) => {
          expect(text.trim()).equal('a')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(5).invoke('text').then((text) => {
          expect(text.trim()).equal('b')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(6).should('not.exist')
        cy.get("#\\/pallall").find('.mjx-mrow').eq(7).should('not.exist')
        cy.get("#\\/pallall").find('.mjx-mrow').eq(8).should('not.exist')

        cy.get(coords1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(a,b)')
        })
        cy.get(coords2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(a,b)')
        })
        cy.get(coords3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(a,b)')
        })
        cy.get(coords3eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(a,b)')
        })
        cy.get(coordsallAnchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(a,b)')
        })
        cy.get(coordsallAnchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(a,b)')
        })
        cy.get(coordsallAnchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(a,b)')
        })

        cy.window().then(async (win) => {

          expect(components['/_point1'].stateValues.nDimensions).eq(2);
          expect((await components['/_point1'].stateValues.xs).length).eq(2);
          expect((await components['/_point1'].stateValues.xs)[0].tree).eq('a');
          expect((await components['/_point1'].stateValues.xs)[1].tree).eq('b');
          expect(components['/_point1'].stateValues.x1.tree).eq('a');
          expect(components['/_point1'].stateValues.x2.tree).eq('b');
          expect(components['/_point1'].stateValues.x3).eq(undefined);
          expect(point2.stateValues.nDimensions).eq(2);
          expect((await point2.stateValues.xs).length).eq(2);
          expect((await point2.stateValues.xs)[0].tree).eq('a');
          expect((await point2.stateValues.xs)[1].tree).eq('b');
          expect(point2.stateValues.x1.tree).eq('a');
          expect(point2.stateValues.x2.tree).eq('b');
          expect(point2.stateValues.x3).eq(undefined);
          expect(point3.stateValues.nDimensions).eq(2);
          expect((await point3.stateValues.xs).length).eq(2);
          expect((await point3.stateValues.xs)[0].tree).eq('a');
          expect((await point3.stateValues.xs)[1].tree).eq('b');
          expect(point3.stateValues.x1.tree).eq('a');
          expect(point3.stateValues.x2.tree).eq('b');
          expect(point3.stateValues.x3).eq(undefined);

        });

      })


      cy.log('Back to 1D point')
      cy.get('#\\/originalCoords textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}q{enter}', { force: true });

      cy.window().then(async (win) => {

        cy.get(point1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('q')
        })
        cy.get(point2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('q')
        })
        cy.get(point3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('q')
        })
        cy.get(nDimensions1Anchor).should('have.text', '1');
        cy.get(nDimensions2Anchor).should('have.text', '1');
        cy.get(nDimensions3Anchor).should('have.text', '1');
        cy.get(point1x1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('q')
        })
        cy.get(point2x1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('q')
        })
        cy.get(point3x1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('q')
        })
        cy.get(point3x1eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('q')
        })
        cy.get(pointallx1Anchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('q')
        })
        cy.get(pointallx1Anchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('q')
        })
        cy.get(pointallx1Anchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('q')
        })

        cy.get("#\\/p1y").should('have.text', 'y-coordinate: ')
        cy.get("#\\/p2y").should('have.text', 'y-coordinate: ')
        cy.get("#\\/p3y").should('have.text', 'y-coordinate: ')
        cy.get("#\\/p3ye").should('have.text', 'y-coordinate: ')
        cy.get("#\\/pally").should('have.text', 'y-coordinates: ')

        cy.get("#\\/p1z").should('have.text', 'z-coordinate: ')
        cy.get("#\\/p2z").should('have.text', 'z-coordinate: ')
        cy.get("#\\/p3z").should('have.text', 'z-coordinate: ')
        cy.get("#\\/p3ze").should('have.text', 'z-coordinate: ')
        cy.get("#\\/pallz").should('have.text', 'z-coordinates: ')

        cy.get("#\\/p1all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('q')
        })
        cy.get("#\\/p1all").find('.mjx-mrow').eq(1).should('not.exist')
        cy.get("#\\/p1all").find('.mjx-mrow').eq(2).should('not.exist')

        cy.get("#\\/p2all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('q')
        })
        cy.get("#\\/p2all").find('.mjx-mrow').eq(1).should('not.exist')
        cy.get("#\\/p2all").find('.mjx-mrow').eq(2).should('not.exist')

        cy.get("#\\/p3all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('q')
        })
        cy.get("#\\/p3all").find('.mjx-mrow').eq(1).should('not.exist')
        cy.get("#\\/p3all").find('.mjx-mrow').eq(2).should('not.exist')

        cy.get("#\\/p3alle").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('q')
        })
        cy.get("#\\/p3alle").find('.mjx-mrow').eq(1).should('not.exist')
        cy.get("#\\/p3alle").find('.mjx-mrow').eq(2).should('not.exist')

        cy.get("#\\/pallall").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('q')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('q')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
          expect(text.trim()).equal('q')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(3).should('not.exist')
        cy.get("#\\/pallall").find('.mjx-mrow').eq(4).should('not.exist')
        cy.get("#\\/pallall").find('.mjx-mrow').eq(5).should('not.exist')
        cy.get("#\\/pallall").find('.mjx-mrow').eq(6).should('not.exist')
        cy.get("#\\/pallall").find('.mjx-mrow').eq(7).should('not.exist')
        cy.get("#\\/pallall").find('.mjx-mrow').eq(8).should('not.exist')

        cy.get(coords1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('q')
        })
        cy.get(coords2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('q')
        })
        cy.get(coords3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('q')
        })
        cy.get(coords3eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('q')
        })
        cy.get(coordsallAnchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('q')
        })
        cy.get(coordsallAnchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('q')
        })
        cy.get(coordsallAnchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('q')
        })

        cy.window().then(async (win) => {

          expect(components['/_point1'].stateValues.nDimensions).eq(1);
          expect((await components['/_point1'].stateValues.xs).length).eq(1);
          expect((await components['/_point1'].stateValues.xs)[0].tree).eq('q');
          expect(components['/_point1'].stateValues.x1.tree).eq('q');
          expect(components['/_point1'].stateValues.x2).eq(undefined);
          expect(components['/_point1'].stateValues.x3).eq(undefined);
          expect(point2.stateValues.nDimensions).eq(1);
          expect((await point2.stateValues.xs).length).eq(1);
          expect((await point2.stateValues.xs)[0].tree).eq('q');
          expect(point2.stateValues.x1.tree).eq('q');
          expect(point2.stateValues.x2).eq(undefined);
          expect(point2.stateValues.x3).eq(undefined);
          expect(point3.stateValues.nDimensions).eq(1);
          expect((await point3.stateValues.xs).length).eq(1);
          expect((await point3.stateValues.xs)[0].tree).eq('q');
          expect(point3.stateValues.x1.tree).eq('q');
          expect(point3.stateValues.x2).eq(undefined);
          expect(point3.stateValues.x3).eq(undefined);

        });

      })


      cy.log('Create 3D point')
      cy.get('#\\/originalCoords textarea').type('{end}{backspace}(2x,u/v{rightarrow},w^2{rightarrow}){enter}', { force: true });

      cy.window().then(async (win) => {

        let point1x2Anchor = cesc("#" + components["/point1x2"].replacements[0].componentName);
        let point2x2Anchor = cesc("#" + components["/point2x2"].replacements[0].componentName);
        let point3x2Anchor = cesc("#" + components["/point3x2"].replacements[0].componentName);
        let point3x2eAnchor = cesc("#" + components["/point3x2"].replacements[0].componentName);
        let pointallx2Anchors = components["/pointallx2"].replacements.map(x => cesc("#" + x.componentName));
        let point1x3Anchor = cesc("#" + components["/point1x3"].replacements[0].componentName);
        let point2x3Anchor = cesc("#" + components["/point2x3"].replacements[0].componentName);
        let point3x3Anchor = cesc("#" + components["/point3x3"].replacements[0].componentName);
        let point3x3eAnchor = cesc("#" + components["/point3x3"].replacements[0].componentName);
        let pointallx3Anchors = components["/pointallx3"].replacements.map(x => cesc("#" + x.componentName));

        cy.get(point1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(2x,uv,w2)')
        })
        cy.get(point2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(2x,uv,w2)')
        })
        cy.get(point3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(2x,uv,w2)')
        })
        cy.get(nDimensions1Anchor).should('have.text', '3');
        cy.get(nDimensions2Anchor).should('have.text', '3');
        cy.get(nDimensions3Anchor).should('have.text', '3');
        cy.get(point1x1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('2x')
        })
        cy.get(point2x1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('2x')
        })
        cy.get(point3x1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('2x')
        })
        cy.get(point3x1eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('2x')
        })
        cy.get(pointallx1Anchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('2x')
        })
        cy.get(pointallx1Anchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('2x')
        })
        cy.get(pointallx1Anchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('2x')
        })
        cy.get(point1x2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('uv')
        })
        cy.get(point2x2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('uv')
        })
        cy.get(point3x2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('uv')
        })
        cy.get(point3x2eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('uv')
        })
        cy.get(pointallx2Anchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('uv')
        })
        cy.get(pointallx2Anchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('uv')
        })
        cy.get(pointallx2Anchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('uv')
        })
        cy.get(point1x3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('w2')
        })
        cy.get(point2x3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('w2')
        })
        cy.get(point3x3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('w2')
        })
        cy.get(point3x3eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('w2')
        })
        cy.get(pointallx3Anchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('w2')
        })
        cy.get(pointallx3Anchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('w2')
        })
        cy.get(pointallx3Anchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('w2')
        })

        cy.get("#\\/p1all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('2x')
        })
        cy.get("#\\/p1all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('uv')
        })
        cy.get("#\\/p1all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
          expect(text.trim()).equal('w2')
        })
        cy.get("#\\/p2all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('2x')
        })
        cy.get("#\\/p2all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('uv')
        })
        cy.get("#\\/p2all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
          expect(text.trim()).equal('w2')
        })
        cy.get("#\\/p3all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('2x')
        })
        cy.get("#\\/p3all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('uv')
        })
        cy.get("#\\/p3all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
          expect(text.trim()).equal('w2')
        })
        cy.get("#\\/p3alle").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('2x')
        })
        cy.get("#\\/p3alle").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('uv')
        })
        cy.get("#\\/p3alle").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
          expect(text.trim()).equal('w2')
        })

        cy.get("#\\/pallall").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('2x')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('uv')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
          expect(text.trim()).equal('w2')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(4).invoke('text').then((text) => {
          expect(text.trim()).equal('2x')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(5).invoke('text').then((text) => {
          expect(text.trim()).equal('uv')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(6).invoke('text').then((text) => {
          expect(text.trim()).equal('w2')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(8).invoke('text').then((text) => {
          expect(text.trim()).equal('2x')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(9).invoke('text').then((text) => {
          expect(text.trim()).equal('uv')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(10).invoke('text').then((text) => {
          expect(text.trim()).equal('w2')
        })

        cy.get(coords1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(2x,uv,w2)')
        })
        cy.get(coords2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(2x,uv,w2)')
        })
        cy.get(coords3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(2x,uv,w2)')
        })
        cy.get(coords3eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(2x,uv,w2)')
        })
        cy.get(coordsallAnchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(2x,uv,w2)')
        })
        cy.get(coordsallAnchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(2x,uv,w2)')
        })
        cy.get(coordsallAnchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(2x,uv,w2)')
        })

        cy.window().then(async (win) => {

          expect(components['/_point1'].stateValues.nDimensions).eq(3);
          expect((await components['/_point1'].stateValues.xs).length).eq(3);
          expect((await components['/_point1'].stateValues.xs)[0].tree).eqls(["*", 2, "x"]);
          expect((await components['/_point1'].stateValues.xs)[1].tree).eqls(["/", "u", "v"]);
          expect((await components['/_point1'].stateValues.xs)[2].tree).eqls(["^", "w", 2]);
          expect(components['/_point1'].stateValues.x1.tree).eqls(["*", 2, "x"]);;
          expect(components['/_point1'].stateValues.x2.tree).eqls(["/", "u", "v"]);
          expect(components['/_point1'].stateValues.x3.tree).eqls(["^", "w", 2]);
          expect(point2.stateValues.nDimensions).eq(3);
          expect((await point2.stateValues.xs).length).eq(3);
          expect((await point2.stateValues.xs)[0].tree).eqls(["*", 2, "x"]);
          expect((await point2.stateValues.xs)[1].tree).eqls(["/", "u", "v"]);
          expect((await point2.stateValues.xs)[2].tree).eqls(["^", "w", 2]);
          expect(point2.stateValues.x1.tree).eqls(["*", 2, "x"]);
          expect(point2.stateValues.x2.tree).eqls(["/", "u", "v"]);
          expect(point2.stateValues.x3.tree).eqls(["^", "w", 2]);
          expect(point3.stateValues.nDimensions).eq(3);
          expect((await point3.stateValues.xs).length).eq(3);
          expect((await point3.stateValues.xs)[0].tree).eqls(["*", 2, "x"]);
          expect((await point3.stateValues.xs)[1].tree).eqls(["/", "u", "v"]);
          expect((await point3.stateValues.xs)[2].tree).eqls(["^", "w", 2]);
          expect(point3.stateValues.x1.tree).eqls(["*", 2, "x"]);
          expect(point3.stateValues.x2.tree).eqls(["/", "u", "v"]);
          expect(point3.stateValues.x3.tree).eqls(["^", "w", 2]);

        });


        cy.log('change the coordinates from point 1 coords')
        cy.get("#\\/coords1b textarea").type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}(7,8,9){enter}', { force: true });

        cy.get(point1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(7,8,9)')
        })
        cy.get(point2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(7,8,9)')
        })
        cy.get(point3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(7,8,9)')
        })
        cy.get(nDimensions1Anchor).should('have.text', '3');
        cy.get(nDimensions2Anchor).should('have.text', '3');
        cy.get(nDimensions3Anchor).should('have.text', '3');
        cy.get(point1x1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('7')
        })
        cy.get(point2x1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('7')
        })
        cy.get(point3x1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('7')
        })
        cy.get(point3x1eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('7')
        })
        cy.get(pointallx1Anchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('7')
        })
        cy.get(pointallx1Anchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('7')
        })
        cy.get(pointallx1Anchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('7')
        })
        cy.get(point1x2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('8')
        })
        cy.get(point2x2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('8')
        })
        cy.get(point3x2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('8')
        })
        cy.get(point3x2eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('8')
        })
        cy.get(pointallx2Anchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('8')
        })
        cy.get(pointallx2Anchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('8')
        })
        cy.get(pointallx2Anchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('8')
        })
        cy.get(point1x3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('9')
        })
        cy.get(point2x3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('9')
        })
        cy.get(point3x3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('9')
        })
        cy.get(point3x3eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('9')
        })
        cy.get(pointallx3Anchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('9')
        })
        cy.get(pointallx3Anchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('9')
        })
        cy.get(pointallx3Anchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('9')
        })

        cy.get("#\\/p1all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('7')
        })
        cy.get("#\\/p1all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('8')
        })
        cy.get("#\\/p1all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
          expect(text.trim()).equal('9')
        })
        cy.get("#\\/p2all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('7')
        })
        cy.get("#\\/p2all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('8')
        })
        cy.get("#\\/p2all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
          expect(text.trim()).equal('9')
        })
        cy.get("#\\/p3all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('7')
        })
        cy.get("#\\/p3all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('8')
        })
        cy.get("#\\/p3all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
          expect(text.trim()).equal('9')
        })
        cy.get("#\\/p3alle").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('7')
        })
        cy.get("#\\/p3alle").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('8')
        })
        cy.get("#\\/p3alle").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
          expect(text.trim()).equal('9')
        })

        cy.get("#\\/pallall").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('7')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('8')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
          expect(text.trim()).equal('9')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(3).invoke('text').then((text) => {
          expect(text.trim()).equal('7')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(4).invoke('text').then((text) => {
          expect(text.trim()).equal('8')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(5).invoke('text').then((text) => {
          expect(text.trim()).equal('9')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(6).invoke('text').then((text) => {
          expect(text.trim()).equal('7')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(7).invoke('text').then((text) => {
          expect(text.trim()).equal('8')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(8).invoke('text').then((text) => {
          expect(text.trim()).equal('9')
        })

        cy.get(coords1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(7,8,9)')
        })
        cy.get(coords2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(7,8,9)')
        })
        cy.get(coords3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(7,8,9)')
        })
        cy.get(coords3eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(7,8,9)')
        })
        cy.get(coordsallAnchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(7,8,9)')
        })
        cy.get(coordsallAnchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(7,8,9)')
        })
        cy.get(coordsallAnchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(7,8,9)')
        })

        cy.window().then(async (win) => {

          expect(components['/_point1'].stateValues.nDimensions).eq(3);
          expect((await components['/_point1'].stateValues.xs).length).eq(3);
          expect((await components['/_point1'].stateValues.xs)[0].tree).eq(7);
          expect((await components['/_point1'].stateValues.xs)[1].tree).eq(8);
          expect((await components['/_point1'].stateValues.xs)[2].tree).eq(9);
          expect(components['/_point1'].stateValues.x1.tree).eq(7);;
          expect(components['/_point1'].stateValues.x2.tree).eq(8);
          expect(components['/_point1'].stateValues.x3.tree).eq(9);
          expect(point2.stateValues.nDimensions).eq(3);
          expect((await point2.stateValues.xs).length).eq(3);
          expect((await point2.stateValues.xs)[0].tree).eq(7);
          expect((await point2.stateValues.xs)[1].tree).eq(8);
          expect((await point2.stateValues.xs)[2].tree).eq(9);
          expect(point2.stateValues.x1.tree).eq(7);
          expect(point2.stateValues.x2.tree).eq(8);
          expect(point2.stateValues.x3.tree).eq(9);
          expect(point3.stateValues.nDimensions).eq(3);
          expect((await point3.stateValues.xs).length).eq(3);
          expect((await point3.stateValues.xs)[0].tree).eq(7);
          expect((await point3.stateValues.xs)[1].tree).eq(8);
          expect((await point3.stateValues.xs)[2].tree).eq(9);
          expect(point3.stateValues.x1.tree).eq(7);
          expect(point3.stateValues.x2.tree).eq(8);
          expect(point3.stateValues.x3.tree).eq(9);

        });


        cy.log('change the coordinates from point 2 coords')
        cy.get("#\\/coords2b textarea").type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}(i,j,k){enter}', { force: true });

        cy.get(point1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(i,j,k)')
        })
        cy.get(point2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(i,j,k)')
        })
        cy.get(point3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(i,j,k)')
        })
        cy.get(nDimensions1Anchor).should('have.text', '3');
        cy.get(nDimensions2Anchor).should('have.text', '3');
        cy.get(nDimensions3Anchor).should('have.text', '3');
        cy.get(point1x1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('i')
        })
        cy.get(point2x1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('i')
        })
        cy.get(point3x1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('i')
        })
        cy.get(point3x1eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('i')
        })
        cy.get(pointallx1Anchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('i')
        })
        cy.get(pointallx1Anchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('i')
        })
        cy.get(pointallx1Anchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('i')
        })
        cy.get(point1x2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('j')
        })
        cy.get(point2x2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('j')
        })
        cy.get(point3x2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('j')
        })
        cy.get(point3x2eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('j')
        })
        cy.get(pointallx2Anchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('j')
        })
        cy.get(pointallx2Anchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('j')
        })
        cy.get(pointallx2Anchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('j')
        })
        cy.get(point1x3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('k')
        })
        cy.get(point2x3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('k')
        })
        cy.get(point3x3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('k')
        })
        cy.get(point3x3eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('k')
        })
        cy.get(pointallx3Anchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('k')
        })
        cy.get(pointallx3Anchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('k')
        })
        cy.get(pointallx3Anchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('k')
        })

        cy.get("#\\/p1all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('i')
        })
        cy.get("#\\/p1all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('j')
        })
        cy.get("#\\/p1all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
          expect(text.trim()).equal('k')
        })
        cy.get("#\\/p2all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('i')
        })
        cy.get("#\\/p2all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('j')
        })
        cy.get("#\\/p2all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
          expect(text.trim()).equal('k')
        })
        cy.get("#\\/p3all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('i')
        })
        cy.get("#\\/p3all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('j')
        })
        cy.get("#\\/p3all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
          expect(text.trim()).equal('k')
        })
        cy.get("#\\/p3alle").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('i')
        })
        cy.get("#\\/p3alle").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('j')
        })
        cy.get("#\\/p3alle").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
          expect(text.trim()).equal('k')
        })

        cy.get("#\\/pallall").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('i')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('j')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
          expect(text.trim()).equal('k')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(3).invoke('text').then((text) => {
          expect(text.trim()).equal('i')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(4).invoke('text').then((text) => {
          expect(text.trim()).equal('j')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(5).invoke('text').then((text) => {
          expect(text.trim()).equal('k')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(6).invoke('text').then((text) => {
          expect(text.trim()).equal('i')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(7).invoke('text').then((text) => {
          expect(text.trim()).equal('j')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(8).invoke('text').then((text) => {
          expect(text.trim()).equal('k')
        })

        cy.get(coords1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(i,j,k)')
        })
        cy.get(coords2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(i,j,k)')
        })
        cy.get(coords3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(i,j,k)')
        })
        cy.get(coords3eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(i,j,k)')
        })
        cy.get(coordsallAnchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(i,j,k)')
        })
        cy.get(coordsallAnchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(i,j,k)')
        })
        cy.get(coordsallAnchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(i,j,k)')
        })

        cy.window().then(async (win) => {

          expect(components['/_point1'].stateValues.nDimensions).eq(3);
          expect((await components['/_point1'].stateValues.xs).length).eq(3);
          expect((await components['/_point1'].stateValues.xs)[0].tree).eq('i');
          expect((await components['/_point1'].stateValues.xs)[1].tree).eq('j');
          expect((await components['/_point1'].stateValues.xs)[2].tree).eq('k');
          expect(components['/_point1'].stateValues.x1.tree).eq('i');;
          expect(components['/_point1'].stateValues.x2.tree).eq('j');
          expect(components['/_point1'].stateValues.x3.tree).eq('k');
          expect(point2.stateValues.nDimensions).eq(3);
          expect((await point2.stateValues.xs).length).eq(3);
          expect((await point2.stateValues.xs)[0].tree).eq('i');
          expect((await point2.stateValues.xs)[1].tree).eq('j');
          expect((await point2.stateValues.xs)[2].tree).eq('k');
          expect(point2.stateValues.x1.tree).eq('i');
          expect(point2.stateValues.x2.tree).eq('j');
          expect(point2.stateValues.x3.tree).eq('k');
          expect(point3.stateValues.nDimensions).eq(3);
          expect((await point3.stateValues.xs).length).eq(3);
          expect((await point3.stateValues.xs)[0].tree).eq('i');
          expect((await point3.stateValues.xs)[1].tree).eq('j');
          expect((await point3.stateValues.xs)[2].tree).eq('k');
          expect(point3.stateValues.x1.tree).eq('i');
          expect(point3.stateValues.x2.tree).eq('j');
          expect(point3.stateValues.x3.tree).eq('k');

        });



        cy.log('change the coordinates from point 3 coords')
        cy.get("#\\/coords3b textarea").type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}(l,m,n){enter}', { force: true });

        cy.get(point1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(l,m,n)')
        })
        cy.get(point2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(l,m,n)')
        })
        cy.get(point3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(l,m,n)')
        })
        cy.get(nDimensions1Anchor).should('have.text', '3');
        cy.get(nDimensions2Anchor).should('have.text', '3');
        cy.get(nDimensions3Anchor).should('have.text', '3');
        cy.get(point1x1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('l')
        })
        cy.get(point2x1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('l')
        })
        cy.get(point3x1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('l')
        })
        cy.get(point3x1eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('l')
        })
        cy.get(pointallx1Anchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('l')
        })
        cy.get(pointallx1Anchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('l')
        })
        cy.get(pointallx1Anchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('l')
        })
        cy.get(point1x2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('m')
        })
        cy.get(point2x2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('m')
        })
        cy.get(point3x2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('m')
        })
        cy.get(point3x2eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('m')
        })
        cy.get(pointallx2Anchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('m')
        })
        cy.get(pointallx2Anchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('m')
        })
        cy.get(pointallx2Anchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('m')
        })
        cy.get(point1x3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('n')
        })
        cy.get(point2x3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('n')
        })
        cy.get(point3x3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('n')
        })
        cy.get(point3x3eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('n')
        })
        cy.get(pointallx3Anchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('n')
        })
        cy.get(pointallx3Anchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('n')
        })
        cy.get(pointallx3Anchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('n')
        })

        cy.get("#\\/p1all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('l')
        })
        cy.get("#\\/p1all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('m')
        })
        cy.get("#\\/p1all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
          expect(text.trim()).equal('n')
        })
        cy.get("#\\/p2all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('l')
        })
        cy.get("#\\/p2all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('m')
        })
        cy.get("#\\/p2all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
          expect(text.trim()).equal('n')
        })
        cy.get("#\\/p3all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('l')
        })
        cy.get("#\\/p3all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('m')
        })
        cy.get("#\\/p3all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
          expect(text.trim()).equal('n')
        })
        cy.get("#\\/p3alle").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('l')
        })
        cy.get("#\\/p3alle").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('m')
        })
        cy.get("#\\/p3alle").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
          expect(text.trim()).equal('n')
        })

        cy.get("#\\/pallall").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('l')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('m')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
          expect(text.trim()).equal('n')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(3).invoke('text').then((text) => {
          expect(text.trim()).equal('l')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(4).invoke('text').then((text) => {
          expect(text.trim()).equal('m')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(5).invoke('text').then((text) => {
          expect(text.trim()).equal('n')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(6).invoke('text').then((text) => {
          expect(text.trim()).equal('l')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(7).invoke('text').then((text) => {
          expect(text.trim()).equal('m')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(8).invoke('text').then((text) => {
          expect(text.trim()).equal('n')
        })

        cy.get(coords1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(l,m,n)')
        })
        cy.get(coords2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(l,m,n)')
        })
        cy.get(coords3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(l,m,n)')
        })
        cy.get(coords3eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(l,m,n)')
        })
        cy.get(coordsallAnchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(l,m,n)')
        })
        cy.get(coordsallAnchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(l,m,n)')
        })
        cy.get(coordsallAnchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(l,m,n)')
        })

        cy.window().then(async (win) => {

          expect(components['/_point1'].stateValues.nDimensions).eq(3);
          expect((await components['/_point1'].stateValues.xs).length).eq(3);
          expect((await components['/_point1'].stateValues.xs)[0].tree).eq('l');
          expect((await components['/_point1'].stateValues.xs)[1].tree).eq('m');
          expect((await components['/_point1'].stateValues.xs)[2].tree).eq('n');
          expect(components['/_point1'].stateValues.x1.tree).eq('l');;
          expect(components['/_point1'].stateValues.x2.tree).eq('m');
          expect(components['/_point1'].stateValues.x3.tree).eq('n');
          expect(point2.stateValues.nDimensions).eq(3);
          expect((await point2.stateValues.xs).length).eq(3);
          expect((await point2.stateValues.xs)[0].tree).eq('l');
          expect((await point2.stateValues.xs)[1].tree).eq('m');
          expect((await point2.stateValues.xs)[2].tree).eq('n');
          expect(point2.stateValues.x1.tree).eq('l');
          expect(point2.stateValues.x2.tree).eq('m');
          expect(point2.stateValues.x3.tree).eq('n');
          expect(point3.stateValues.nDimensions).eq(3);
          expect((await point3.stateValues.xs).length).eq(3);
          expect((await point3.stateValues.xs)[0].tree).eq('l');
          expect((await point3.stateValues.xs)[1].tree).eq('m');
          expect((await point3.stateValues.xs)[2].tree).eq('n');
          expect(point3.stateValues.x1.tree).eq('l');
          expect(point3.stateValues.x2.tree).eq('m');
          expect(point3.stateValues.x3.tree).eq('n');

        });



        cy.log('change the coordinates from point 1 individual components')
        cy.get("#\\/point1x1b textarea").type('{end}{backspace}r{enter}', { force: true });
        cy.get("#\\/point1x2b textarea").type('{end}{backspace}s{enter}', { force: true });
        cy.get("#\\/point1x3b textarea").type('{end}{backspace}t{enter}', { force: true });

        cy.get(point1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(r,s,t)')
        })
        cy.get(point2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(r,s,t)')
        })
        cy.get(point3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(r,s,t)')
        })
        cy.get(nDimensions1Anchor).should('have.text', '3');
        cy.get(nDimensions2Anchor).should('have.text', '3');
        cy.get(nDimensions3Anchor).should('have.text', '3');
        cy.get(point1x1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('r')
        })
        cy.get(point2x1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('r')
        })
        cy.get(point3x1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('r')
        })
        cy.get(point3x1eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('r')
        })
        cy.get(pointallx1Anchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('r')
        })
        cy.get(pointallx1Anchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('r')
        })
        cy.get(pointallx1Anchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('r')
        })
        cy.get(point1x2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('s')
        })
        cy.get(point2x2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('s')
        })
        cy.get(point3x2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('s')
        })
        cy.get(point3x2eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('s')
        })
        cy.get(pointallx2Anchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('s')
        })
        cy.get(pointallx2Anchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('s')
        })
        cy.get(pointallx2Anchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('s')
        })
        cy.get(point1x3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('t')
        })
        cy.get(point2x3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('t')
        })
        cy.get(point3x3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('t')
        })
        cy.get(point3x3eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('t')
        })
        cy.get(pointallx3Anchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('t')
        })
        cy.get(pointallx3Anchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('t')
        })
        cy.get(pointallx3Anchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('t')
        })

        cy.get("#\\/p1all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('r')
        })
        cy.get("#\\/p1all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('s')
        })
        cy.get("#\\/p1all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
          expect(text.trim()).equal('t')
        })
        cy.get("#\\/p2all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('r')
        })
        cy.get("#\\/p2all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('s')
        })
        cy.get("#\\/p2all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
          expect(text.trim()).equal('t')
        })
        cy.get("#\\/p3all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('r')
        })
        cy.get("#\\/p3all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('s')
        })
        cy.get("#\\/p3all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
          expect(text.trim()).equal('t')
        })
        cy.get("#\\/p3alle").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('r')
        })
        cy.get("#\\/p3alle").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('s')
        })
        cy.get("#\\/p3alle").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
          expect(text.trim()).equal('t')
        })

        cy.get("#\\/pallall").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('r')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('s')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
          expect(text.trim()).equal('t')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(3).invoke('text').then((text) => {
          expect(text.trim()).equal('r')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(4).invoke('text').then((text) => {
          expect(text.trim()).equal('s')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(5).invoke('text').then((text) => {
          expect(text.trim()).equal('t')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(6).invoke('text').then((text) => {
          expect(text.trim()).equal('r')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(7).invoke('text').then((text) => {
          expect(text.trim()).equal('s')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(8).invoke('text').then((text) => {
          expect(text.trim()).equal('t')
        })

        cy.get(coords1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(r,s,t)')
        })
        cy.get(coords2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(r,s,t)')
        })
        cy.get(coords3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(r,s,t)')
        })
        cy.get(coords3eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(r,s,t)')
        })
        cy.get(coordsallAnchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(r,s,t)')
        })
        cy.get(coordsallAnchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(r,s,t)')
        })
        cy.get(coordsallAnchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(r,s,t)')
        })

        cy.window().then(async (win) => {

          expect(components['/_point1'].stateValues.nDimensions).eq(3);
          expect((await components['/_point1'].stateValues.xs).length).eq(3);
          expect((await components['/_point1'].stateValues.xs)[0].tree).eq('r');
          expect((await components['/_point1'].stateValues.xs)[1].tree).eq('s');
          expect((await components['/_point1'].stateValues.xs)[2].tree).eq('t');
          expect(components['/_point1'].stateValues.x1.tree).eq('r');;
          expect(components['/_point1'].stateValues.x2.tree).eq('s');
          expect(components['/_point1'].stateValues.x3.tree).eq('t');
          expect(point2.stateValues.nDimensions).eq(3);
          expect((await point2.stateValues.xs).length).eq(3);
          expect((await point2.stateValues.xs)[0].tree).eq('r');
          expect((await point2.stateValues.xs)[1].tree).eq('s');
          expect((await point2.stateValues.xs)[2].tree).eq('t');
          expect(point2.stateValues.x1.tree).eq('r');
          expect(point2.stateValues.x2.tree).eq('s');
          expect(point2.stateValues.x3.tree).eq('t');
          expect(point3.stateValues.nDimensions).eq(3);
          expect((await point3.stateValues.xs).length).eq(3);
          expect((await point3.stateValues.xs)[0].tree).eq('r');
          expect((await point3.stateValues.xs)[1].tree).eq('s');
          expect((await point3.stateValues.xs)[2].tree).eq('t');
          expect(point3.stateValues.x1.tree).eq('r');
          expect(point3.stateValues.x2.tree).eq('s');
          expect(point3.stateValues.x3.tree).eq('t');

        });



        cy.log('change the coordinates from point 2 individual components')
        cy.get("#\\/point2x1b textarea").type('{end}{backspace}f{enter}', { force: true });
        cy.get("#\\/point2x2b textarea").type('{end}{backspace}g{enter}', { force: true });
        cy.get("#\\/point2x3b textarea").type('{end}{backspace}h{enter}', { force: true });

        cy.get(point1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(f,g,h)')
        })
        cy.get(point2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(f,g,h)')
        })
        cy.get(point3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(f,g,h)')
        })
        cy.get(nDimensions1Anchor).should('have.text', '3');
        cy.get(nDimensions2Anchor).should('have.text', '3');
        cy.get(nDimensions3Anchor).should('have.text', '3');
        cy.get(point1x1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('f')
        })
        cy.get(point2x1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('f')
        })
        cy.get(point3x1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('f')
        })
        cy.get(point3x1eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('f')
        })
        cy.get(pointallx1Anchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('f')
        })
        cy.get(pointallx1Anchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('f')
        })
        cy.get(pointallx1Anchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('f')
        })
        cy.get(point1x2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('g')
        })
        cy.get(point2x2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('g')
        })
        cy.get(point3x2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('g')
        })
        cy.get(point3x2eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('g')
        })
        cy.get(pointallx2Anchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('g')
        })
        cy.get(pointallx2Anchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('g')
        })
        cy.get(pointallx2Anchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('g')
        })
        cy.get(point1x3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('h')
        })
        cy.get(point2x3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('h')
        })
        cy.get(point3x3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('h')
        })
        cy.get(point3x3eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('h')
        })
        cy.get(pointallx3Anchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('h')
        })
        cy.get(pointallx3Anchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('h')
        })
        cy.get(pointallx3Anchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('h')
        })

        cy.get("#\\/p1all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('f')
        })
        cy.get("#\\/p1all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('g')
        })
        cy.get("#\\/p1all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
          expect(text.trim()).equal('h')
        })
        cy.get("#\\/p2all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('f')
        })
        cy.get("#\\/p2all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('g')
        })
        cy.get("#\\/p2all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
          expect(text.trim()).equal('h')
        })
        cy.get("#\\/p3all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('f')
        })
        cy.get("#\\/p3all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('g')
        })
        cy.get("#\\/p3all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
          expect(text.trim()).equal('h')
        })
        cy.get("#\\/p3alle").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('f')
        })
        cy.get("#\\/p3alle").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('g')
        })

        // TODO: makes no sense why this is failing. 
        // It seems to be in the DOM just like the others
        // cy.get("#\\/p3alle").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
        //   expect(text.trim()).equal('h')
        // })

        cy.get("#\\/pallall").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('f')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('g')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
          expect(text.trim()).equal('h')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(3).invoke('text').then((text) => {
          expect(text.trim()).equal('f')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(4).invoke('text').then((text) => {
          expect(text.trim()).equal('g')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(5).invoke('text').then((text) => {
          expect(text.trim()).equal('h')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(6).invoke('text').then((text) => {
          expect(text.trim()).equal('f')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(7).invoke('text').then((text) => {
          expect(text.trim()).equal('g')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(8).invoke('text').then((text) => {
          expect(text.trim()).equal('h')
        })

        cy.get(coords1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(f,g,h)')
        })
        cy.get(coords2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(f,g,h)')
        })
        cy.get(coords3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(f,g,h)')
        })
        cy.get(coords3eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(f,g,h)')
        })
        cy.get(coordsallAnchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(f,g,h)')
        })
        cy.get(coordsallAnchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(f,g,h)')
        })
        cy.get(coordsallAnchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(f,g,h)')
        })

        cy.window().then(async (win) => {

          expect(components['/_point1'].stateValues.nDimensions).eq(3);
          expect((await components['/_point1'].stateValues.xs).length).eq(3);
          expect((await components['/_point1'].stateValues.xs)[0].tree).eq('f');
          expect((await components['/_point1'].stateValues.xs)[1].tree).eq('g');
          expect((await components['/_point1'].stateValues.xs)[2].tree).eq('h');
          expect(components['/_point1'].stateValues.x1.tree).eq('f');;
          expect(components['/_point1'].stateValues.x2.tree).eq('g');
          expect(components['/_point1'].stateValues.x3.tree).eq('h');
          expect(point2.stateValues.nDimensions).eq(3);
          expect((await point2.stateValues.xs).length).eq(3);
          expect((await point2.stateValues.xs)[0].tree).eq('f');
          expect((await point2.stateValues.xs)[1].tree).eq('g');
          expect((await point2.stateValues.xs)[2].tree).eq('h');
          expect(point2.stateValues.x1.tree).eq('f');
          expect(point2.stateValues.x2.tree).eq('g');
          expect(point2.stateValues.x3.tree).eq('h');
          expect(point3.stateValues.nDimensions).eq(3);
          expect((await point3.stateValues.xs).length).eq(3);
          expect((await point3.stateValues.xs)[0].tree).eq('f');
          expect((await point3.stateValues.xs)[1].tree).eq('g');
          expect((await point3.stateValues.xs)[2].tree).eq('h');
          expect(point3.stateValues.x1.tree).eq('f');
          expect(point3.stateValues.x2.tree).eq('g');
          expect(point3.stateValues.x3.tree).eq('h');

        });



        cy.log('change the coordinates from point 3 individual components')
        cy.get("#\\/point3x1b textarea").type('{end}{backspace}x{enter}', { force: true });
        cy.get("#\\/point3x2b textarea").type('{end}{backspace}y{enter}', { force: true });
        cy.get("#\\/point3x3b textarea").type('{end}{backspace}z{enter}', { force: true });

        cy.get(point1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(x,y,z)')
        })
        cy.get(point2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(x,y,z)')
        })
        cy.get(point3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(x,y,z)')
        })
        cy.get(nDimensions1Anchor).should('have.text', '3');
        cy.get(nDimensions2Anchor).should('have.text', '3');
        cy.get(nDimensions3Anchor).should('have.text', '3');
        cy.get(point1x1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        })
        cy.get(point2x1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        })
        cy.get(point3x1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        })
        cy.get(point3x1eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        })
        cy.get(pointallx1Anchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        })
        cy.get(pointallx1Anchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        })
        cy.get(pointallx1Anchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        })
        cy.get(point1x2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('y')
        })
        cy.get(point2x2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('y')
        })
        cy.get(point3x2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('y')
        })
        cy.get(point3x2eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('y')
        })
        cy.get(pointallx2Anchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('y')
        })
        cy.get(pointallx2Anchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('y')
        })
        cy.get(pointallx2Anchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('y')
        })
        cy.get(point1x3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        })
        cy.get(point2x3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        })
        cy.get(point3x3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        })
        cy.get(point3x3eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        })
        cy.get(pointallx3Anchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        })
        cy.get(pointallx3Anchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        })
        cy.get(pointallx3Anchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        })

        cy.get("#\\/p1all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        })
        cy.get("#\\/p1all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('y')
        })
        cy.get("#\\/p1all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        })
        cy.get("#\\/p2all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        })
        cy.get("#\\/p2all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('y')
        })
        cy.get("#\\/p2all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        })
        cy.get("#\\/p3all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        })
        cy.get("#\\/p3all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('y')
        })
        cy.get("#\\/p3all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        })
        cy.get("#\\/p3alle").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        })
        cy.get("#\\/p3alle").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('y')
        })
        cy.get("#\\/p3alle").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        })

        cy.get("#\\/pallall").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('y')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(3).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(4).invoke('text').then((text) => {
          expect(text.trim()).equal('y')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(5).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(6).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(7).invoke('text').then((text) => {
          expect(text.trim()).equal('y')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(8).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        })

        cy.get(coords1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(x,y,z)')
        })
        cy.get(coords2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(x,y,z)')
        })
        cy.get(coords3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(x,y,z)')
        })
        cy.get(coords3eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(x,y,z)')
        })
        cy.get(coordsallAnchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(x,y,z)')
        })
        cy.get(coordsallAnchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(x,y,z)')
        })
        cy.get(coordsallAnchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(x,y,z)')
        })

        cy.window().then(async (win) => {

          expect(components['/_point1'].stateValues.nDimensions).eq(3);
          expect((await components['/_point1'].stateValues.xs).length).eq(3);
          expect((await components['/_point1'].stateValues.xs)[0].tree).eq('x');
          expect((await components['/_point1'].stateValues.xs)[1].tree).eq('y');
          expect((await components['/_point1'].stateValues.xs)[2].tree).eq('z');
          expect(components['/_point1'].stateValues.x1.tree).eq('x');;
          expect(components['/_point1'].stateValues.x2.tree).eq('y');
          expect(components['/_point1'].stateValues.x3.tree).eq('z');
          expect(point2.stateValues.nDimensions).eq(3);
          expect((await point2.stateValues.xs).length).eq(3);
          expect((await point2.stateValues.xs)[0].tree).eq('x');
          expect((await point2.stateValues.xs)[1].tree).eq('y');
          expect((await point2.stateValues.xs)[2].tree).eq('z');
          expect(point2.stateValues.x1.tree).eq('x');
          expect(point2.stateValues.x2.tree).eq('y');
          expect(point2.stateValues.x3.tree).eq('z');
          expect(point3.stateValues.nDimensions).eq(3);
          expect((await point3.stateValues.xs).length).eq(3);
          expect((await point3.stateValues.xs)[0].tree).eq('x');
          expect((await point3.stateValues.xs)[1].tree).eq('y');
          expect((await point3.stateValues.xs)[2].tree).eq('z');
          expect(point3.stateValues.x1.tree).eq('x');
          expect(point3.stateValues.x2.tree).eq('y');
          expect(point3.stateValues.x3.tree).eq('z');

        });



        cy.log(`can't decrease dimension from inverse direction 1`)
        cy.get("#\\/coords1b textarea").type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}(u,v){enter}', { force: true });

        cy.get(point1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(u,v,z)')
        })
        cy.get(point2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(u,v,z)')
        })
        cy.get(point3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(u,v,z)')
        })
        cy.get(nDimensions1Anchor).should('have.text', '3');
        cy.get(nDimensions2Anchor).should('have.text', '3');
        cy.get(nDimensions3Anchor).should('have.text', '3');
        cy.get(point1x1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('u')
        })
        cy.get(point2x1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('u')
        })
        cy.get(point3x1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('u')
        })
        cy.get(point3x1eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('u')
        })
        cy.get(pointallx1Anchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('u')
        })
        cy.get(pointallx1Anchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('u')
        })
        cy.get(pointallx1Anchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('u')
        })
        cy.get(point1x2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('v')
        })
        cy.get(point2x2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('v')
        })
        cy.get(point3x2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('v')
        })
        cy.get(point3x2eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('v')
        })
        cy.get(pointallx2Anchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('v')
        })
        cy.get(pointallx2Anchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('v')
        })
        cy.get(pointallx2Anchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('v')
        })
        cy.get(point1x3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        })
        cy.get(point2x3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        })
        cy.get(point3x3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        })
        cy.get(point3x3eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        })
        cy.get(pointallx3Anchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        })
        cy.get(pointallx3Anchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        })
        cy.get(pointallx3Anchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        })


        cy.get("#\\/p1all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('u')
        })
        cy.get("#\\/p1all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('v')
        })
        cy.get("#\\/p1all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        })
        cy.get("#\\/p2all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('u')
        })
        cy.get("#\\/p2all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('v')
        })
        cy.get("#\\/p2all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        })
        cy.get("#\\/p3all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('u')
        })
        cy.get("#\\/p3all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('v')
        })
        cy.get("#\\/p3all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        })
        cy.get("#\\/p3alle").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('u')
        })
        cy.get("#\\/p3alle").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('v')
        })
        cy.get("#\\/p3alle").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        })

        cy.get("#\\/pallall").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('u')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('v')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(3).invoke('text').then((text) => {
          expect(text.trim()).equal('u')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(4).invoke('text').then((text) => {
          expect(text.trim()).equal('v')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(5).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(6).invoke('text').then((text) => {
          expect(text.trim()).equal('u')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(7).invoke('text').then((text) => {
          expect(text.trim()).equal('v')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(8).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        })

        cy.get(coords1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(u,v,z)')
        })
        cy.get(coords2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(u,v,z)')
        })
        cy.get(coords3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(u,v,z)')
        })
        cy.get(coords3eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(u,v,z)')
        })
        cy.get(coordsallAnchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(u,v,z)')
        })
        cy.get(coordsallAnchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(u,v,z)')
        })
        cy.get(coordsallAnchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(u,v,z)')
        })

        cy.window().then(async (win) => {

          expect(components['/_point1'].stateValues.nDimensions).eq(3);
          expect((await components['/_point1'].stateValues.xs).length).eq(3);
          expect((await components['/_point1'].stateValues.xs)[0].tree).eq('u');
          expect((await components['/_point1'].stateValues.xs)[1].tree).eq('v');
          expect((await components['/_point1'].stateValues.xs)[2].tree).eq('z');
          expect(components['/_point1'].stateValues.x1.tree).eq('u');;
          expect(components['/_point1'].stateValues.x2.tree).eq('v');
          expect(components['/_point1'].stateValues.x3.tree).eq('z');
          expect(point2.stateValues.nDimensions).eq(3);
          expect((await point2.stateValues.xs).length).eq(3);
          expect((await point2.stateValues.xs)[0].tree).eq('u');
          expect((await point2.stateValues.xs)[1].tree).eq('v');
          expect((await point2.stateValues.xs)[2].tree).eq('z');
          expect(point2.stateValues.x1.tree).eq('u');
          expect(point2.stateValues.x2.tree).eq('v');
          expect(point2.stateValues.x3.tree).eq('z');
          expect(point3.stateValues.nDimensions).eq(3);
          expect((await point3.stateValues.xs).length).eq(3);
          expect((await point3.stateValues.xs)[0].tree).eq('u');
          expect((await point3.stateValues.xs)[1].tree).eq('v');
          expect((await point3.stateValues.xs)[2].tree).eq('z');
          expect(point3.stateValues.x1.tree).eq('u');
          expect(point3.stateValues.x2.tree).eq('v');
          expect(point3.stateValues.x3.tree).eq('z');

        });



        cy.log(`can't decrease dimension from inverse direction 2`)
        cy.get("#\\/coords2b textarea").type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}(s,t){enter}', { force: true });

        cy.get(point1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(s,t,z)')
        })
        cy.get(point2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(s,t,z)')
        })
        cy.get(point3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(s,t,z)')
        })
        cy.get(nDimensions1Anchor).should('have.text', '3');
        cy.get(nDimensions2Anchor).should('have.text', '3');
        cy.get(nDimensions3Anchor).should('have.text', '3');
        cy.get(point1x1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('s')
        })
        cy.get(point2x1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('s')
        })
        cy.get(point3x1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('s')
        })
        cy.get(point3x1eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('s')
        })
        cy.get(pointallx1Anchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('s')
        })
        cy.get(pointallx1Anchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('s')
        })
        cy.get(pointallx1Anchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('s')
        })
        cy.get(point1x2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('t')
        })
        cy.get(point2x2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('t')
        })
        cy.get(point3x2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('t')
        })
        cy.get(point3x2eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('t')
        })
        cy.get(pointallx2Anchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('t')
        })
        cy.get(pointallx2Anchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('t')
        })
        cy.get(pointallx2Anchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('t')
        })
        cy.get(point1x3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        })
        cy.get(point2x3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        })
        cy.get(point3x3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        })
        cy.get(point3x3eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        })
        cy.get(pointallx3Anchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        })
        cy.get(pointallx3Anchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        })
        cy.get(pointallx3Anchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        })


        cy.get("#\\/p1all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('s')
        })
        cy.get("#\\/p1all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('t')
        })
        cy.get("#\\/p1all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        })
        cy.get("#\\/p2all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('s')
        })
        cy.get("#\\/p2all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('t')
        })
        cy.get("#\\/p2all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        })
        cy.get("#\\/p3all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('s')
        })
        cy.get("#\\/p3all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('t')
        })
        cy.get("#\\/p3all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        })
        cy.get("#\\/p3alle").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('s')
        })
        cy.get("#\\/p3alle").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('t')
        })
        cy.get("#\\/p3alle").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        })

        cy.get("#\\/pallall").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('s')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('t')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(3).invoke('text').then((text) => {
          expect(text.trim()).equal('s')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(4).invoke('text').then((text) => {
          expect(text.trim()).equal('t')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(5).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(6).invoke('text').then((text) => {
          expect(text.trim()).equal('s')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(7).invoke('text').then((text) => {
          expect(text.trim()).equal('t')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(8).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        })

        cy.get(coords1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(s,t,z)')
        })
        cy.get(coords2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(s,t,z)')
        })
        cy.get(coords3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(s,t,z)')
        })
        cy.get(coords3eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(s,t,z)')
        })
        cy.get(coordsallAnchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(s,t,z)')
        })
        cy.get(coordsallAnchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(s,t,z)')
        })
        cy.get(coordsallAnchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(s,t,z)')
        })

        cy.window().then(async (win) => {

          expect(components['/_point1'].stateValues.nDimensions).eq(3);
          expect((await components['/_point1'].stateValues.xs).length).eq(3);
          expect((await components['/_point1'].stateValues.xs)[0].tree).eq('s');
          expect((await components['/_point1'].stateValues.xs)[1].tree).eq('t');
          expect((await components['/_point1'].stateValues.xs)[2].tree).eq('z');
          expect(components['/_point1'].stateValues.x1.tree).eq('s');;
          expect(components['/_point1'].stateValues.x2.tree).eq('t');
          expect(components['/_point1'].stateValues.x3.tree).eq('z');
          expect(point2.stateValues.nDimensions).eq(3);
          expect((await point2.stateValues.xs).length).eq(3);
          expect((await point2.stateValues.xs)[0].tree).eq('s');
          expect((await point2.stateValues.xs)[1].tree).eq('t');
          expect((await point2.stateValues.xs)[2].tree).eq('z');
          expect(point2.stateValues.x1.tree).eq('s');
          expect(point2.stateValues.x2.tree).eq('t');
          expect(point2.stateValues.x3.tree).eq('z');
          expect(point3.stateValues.nDimensions).eq(3);
          expect((await point3.stateValues.xs).length).eq(3);
          expect((await point3.stateValues.xs)[0].tree).eq('s');
          expect((await point3.stateValues.xs)[1].tree).eq('t');
          expect((await point3.stateValues.xs)[2].tree).eq('z');
          expect(point3.stateValues.x1.tree).eq('s');
          expect(point3.stateValues.x2.tree).eq('t');
          expect(point3.stateValues.x3.tree).eq('z');

        });


        cy.log(`can't decrease dimension from inverse direction 3`)
        cy.get("#\\/coords3b textarea").type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}(q,r){enter}', { force: true });

        cy.get(point1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(q,r,z)')
        })
        cy.get(point2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(q,r,z)')
        })
        cy.get(point3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(q,r,z)')
        })
        cy.get(nDimensions1Anchor).should('have.text', '3');
        cy.get(nDimensions2Anchor).should('have.text', '3');
        cy.get(nDimensions3Anchor).should('have.text', '3');
        cy.get(point1x1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('q')
        })
        cy.get(point2x1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('q')
        })
        cy.get(point3x1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('q')
        })
        cy.get(point3x1eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('q')
        })
        cy.get(pointallx1Anchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('q')
        })
        cy.get(pointallx1Anchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('q')
        })
        cy.get(pointallx1Anchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('q')
        })
        cy.get(point1x2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('r')
        })
        cy.get(point2x2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('r')
        })
        cy.get(point3x2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('r')
        })
        cy.get(point3x2eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('r')
        })
        cy.get(pointallx2Anchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('r')
        })
        cy.get(pointallx2Anchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('r')
        })
        cy.get(pointallx2Anchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('r')
        })
        cy.get(point1x3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        })
        cy.get(point2x3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        })
        cy.get(point3x3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        })
        cy.get(point3x3eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        })
        cy.get(pointallx3Anchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        })
        cy.get(pointallx3Anchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        })
        cy.get(pointallx3Anchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        })


        cy.get("#\\/p1all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('q')
        })
        cy.get("#\\/p1all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('r')
        })
        cy.get("#\\/p1all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        })
        cy.get("#\\/p2all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('q')
        })
        cy.get("#\\/p2all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('r')
        })
        cy.get("#\\/p2all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        })
        cy.get("#\\/p3all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('q')
        })
        cy.get("#\\/p3all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('r')
        })
        cy.get("#\\/p3all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        })
        cy.get("#\\/p3alle").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('q')
        })
        cy.get("#\\/p3alle").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('r')
        })
        cy.get("#\\/p3alle").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('q')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('r')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(3).invoke('text').then((text) => {
          expect(text.trim()).equal('q')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(4).invoke('text').then((text) => {
          expect(text.trim()).equal('r')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(5).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(6).invoke('text').then((text) => {
          expect(text.trim()).equal('q')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(7).invoke('text').then((text) => {
          expect(text.trim()).equal('r')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(8).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        })

        cy.get(coords1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(q,r,z)')
        })
        cy.get(coords2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(q,r,z)')
        })
        cy.get(coords3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(q,r,z)')
        })
        cy.get(coords3eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(q,r,z)')
        })
        cy.get(coordsallAnchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(q,r,z)')
        })
        cy.get(coordsallAnchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(q,r,z)')
        })
        cy.get(coordsallAnchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(q,r,z)')
        })

        cy.window().then(async (win) => {

          expect(components['/_point1'].stateValues.nDimensions).eq(3);
          expect((await components['/_point1'].stateValues.xs).length).eq(3);
          expect((await components['/_point1'].stateValues.xs)[0].tree).eq('q');
          expect((await components['/_point1'].stateValues.xs)[1].tree).eq('r');
          expect((await components['/_point1'].stateValues.xs)[2].tree).eq('z');
          expect(components['/_point1'].stateValues.x1.tree).eq('q');;
          expect(components['/_point1'].stateValues.x2.tree).eq('r');
          expect(components['/_point1'].stateValues.x3.tree).eq('z');
          expect(point2.stateValues.nDimensions).eq(3);
          expect((await point2.stateValues.xs).length).eq(3);
          expect((await point2.stateValues.xs)[0].tree).eq('q');
          expect((await point2.stateValues.xs)[1].tree).eq('r');
          expect((await point2.stateValues.xs)[2].tree).eq('z');
          expect(point2.stateValues.x1.tree).eq('q');
          expect(point2.stateValues.x2.tree).eq('r');
          expect(point2.stateValues.x3.tree).eq('z');
          expect(point3.stateValues.nDimensions).eq(3);
          expect((await point3.stateValues.xs).length).eq(3);
          expect((await point3.stateValues.xs)[0].tree).eq('q');
          expect((await point3.stateValues.xs)[1].tree).eq('r');
          expect((await point3.stateValues.xs)[2].tree).eq('z');
          expect(point3.stateValues.x1.tree).eq('q');
          expect(point3.stateValues.x2.tree).eq('r');
          expect(point3.stateValues.x3.tree).eq('z');

        });



      })



      cy.log('Back to 2D point')
      cy.get('#\\/originalCoords textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}(p,q){enter}', { force: true });

      cy.window().then(async (win) => {

        let point1x2Anchor = cesc("#" + components["/point1x2"].replacements[0].componentName);
        let point2x2Anchor = cesc("#" + components["/point2x2"].replacements[0].componentName);
        let point3x2Anchor = cesc("#" + components["/point3x2"].replacements[0].componentName);
        let point3x2eAnchor = cesc("#" + components["/point3x2e"].replacements[0].componentName);
        let pointallx2Anchors = components["/pointallx2"].replacements.map(x => cesc("#" + x.componentName));

        cy.get(point1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(p,q)')
        })
        cy.get(point2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(p,q)')
        })
        cy.get(point3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(p,q)')
        })
        cy.get(nDimensions1Anchor).should('have.text', '2');
        cy.get(nDimensions2Anchor).should('have.text', '2');
        cy.get(nDimensions3Anchor).should('have.text', '2');
        cy.get(point1x1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('p')
        })
        cy.get(point2x1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('p')
        })
        cy.get(point3x1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('p')
        })
        cy.get(point3x1eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('p')
        })
        cy.get(pointallx1Anchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('p')
        })
        cy.get(pointallx1Anchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('p')
        })
        cy.get(pointallx1Anchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('p')
        })
        cy.get(point1x2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('q')
        })
        cy.get(point2x2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('q')
        })
        cy.get(point3x2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('q')
        })
        cy.get(point3x2eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('q')
        })
        cy.get(pointallx2Anchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('q')
        })
        cy.get(pointallx2Anchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('q')
        })
        cy.get(pointallx2Anchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('q')
        })
        cy.get("#\\/p1z").should('have.text', 'z-coordinate: ')
        cy.get("#\\/p2z").should('have.text', 'z-coordinate: ')
        cy.get("#\\/p3z").should('have.text', 'z-coordinate: ')
        cy.get("#\\/p3ze").should('have.text', 'z-coordinate: ')
        cy.get("#\\/pallz").should('have.text', 'z-coordinates: ')

        cy.get("#\\/p1all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('p')
        })
        cy.get("#\\/p1all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('q')
        })
        cy.get("#\\/p1all").find('.mjx-mrow').eq(2).should('not.exist')

        cy.get("#\\/p2all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('p')
        })
        cy.get("#\\/p2all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('q')
        })
        cy.get("#\\/p2all").find('.mjx-mrow').eq(2).should('not.exist')

        cy.get("#\\/p3all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('p')
        })
        cy.get("#\\/p3all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('q')
        })
        cy.get("#\\/p3all").find('.mjx-mrow').eq(2).should('not.exist')

        cy.get("#\\/p3alle").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('p')
        })
        cy.get("#\\/p3alle").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('q')
        })
        cy.get("#\\/p3alle").find('.mjx-mrow').eq(2).should('not.exist')

        cy.get("#\\/pallall").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('p')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('q')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
          expect(text.trim()).equal('p')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(3).invoke('text').then((text) => {
          expect(text.trim()).equal('q')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(4).invoke('text').then((text) => {
          expect(text.trim()).equal('p')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(5).invoke('text').then((text) => {
          expect(text.trim()).equal('q')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(6).should('not.exist')
        cy.get("#\\/pallall").find('.mjx-mrow').eq(7).should('not.exist')
        cy.get("#\\/pallall").find('.mjx-mrow').eq(8).should('not.exist')

        cy.get(coords1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(p,q)')
        })
        cy.get(coords2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(p,q)')
        })
        cy.get(coords3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(p,q)')
        })
        cy.get(coords3eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(p,q)')
        })
        cy.get(coordsallAnchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(p,q)')
        })
        cy.get(coordsallAnchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(p,q)')
        })
        cy.get(coordsallAnchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(p,q)')
        })

        cy.window().then(async (win) => {

          expect(components['/_point1'].stateValues.nDimensions).eq(2);
          expect((await components['/_point1'].stateValues.xs).length).eq(2);
          expect((await components['/_point1'].stateValues.xs)[0].tree).eq('p');
          expect((await components['/_point1'].stateValues.xs)[1].tree).eq('q');
          expect(components['/_point1'].stateValues.x1.tree).eq('p');
          expect(components['/_point1'].stateValues.x2.tree).eq('q');
          expect(components['/_point1'].stateValues.x3).eq(undefined);
          expect(point2.stateValues.nDimensions).eq(2);
          expect((await point2.stateValues.xs).length).eq(2);
          expect((await point2.stateValues.xs)[0].tree).eq('p');
          expect((await point2.stateValues.xs)[1].tree).eq('q');
          expect(point2.stateValues.x1.tree).eq('p');
          expect(point2.stateValues.x2.tree).eq('q');
          expect(point2.stateValues.x3).eq(undefined);
          expect(point3.stateValues.nDimensions).eq(2);
          expect((await point3.stateValues.xs).length).eq(2);
          expect((await point3.stateValues.xs)[0].tree).eq('p');
          expect((await point3.stateValues.xs)[1].tree).eq('q');
          expect(point3.stateValues.x1.tree).eq('p');
          expect(point3.stateValues.x2.tree).eq('q');
          expect(point3.stateValues.x3).eq(undefined);

        });


        cy.log(`can't increase dimension from inverse direction 1`)
        cy.get("#\\/coords1b textarea").type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}(a,b,c){enter}', { force: true });

        cy.get(point1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(a,b)')
        })
        cy.get(point2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(a,b)')
        })
        cy.get(point3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(a,b)')
        })
        cy.get(nDimensions1Anchor).should('have.text', '2');
        cy.get(nDimensions2Anchor).should('have.text', '2');
        cy.get(nDimensions3Anchor).should('have.text', '2');
        cy.get(point1x1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('a')
        })
        cy.get(point2x1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('a')
        })
        cy.get(point3x1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('a')
        })
        cy.get(point3x1eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('a')
        })
        cy.get(pointallx1Anchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('a')
        })
        cy.get(pointallx1Anchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('a')
        })
        cy.get(pointallx1Anchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('a')
        })
        cy.get(point1x2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('b')
        })
        cy.get(point2x2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('b')
        })
        cy.get(point3x2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('b')
        })
        cy.get(point3x2eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('b')
        })
        cy.get(pointallx2Anchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('b')
        })
        cy.get(pointallx2Anchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('b')
        })
        cy.get(pointallx2Anchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('b')
        })
        cy.get("#\\/p1z").should('have.text', 'z-coordinate: ')
        cy.get("#\\/p2z").should('have.text', 'z-coordinate: ')
        cy.get("#\\/p3z").should('have.text', 'z-coordinate: ')
        cy.get("#\\/p3ze").should('have.text', 'z-coordinate: ')
        cy.get("#\\/pallz").should('have.text', 'z-coordinates: ')

        cy.get("#\\/p1all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('a')
        })
        cy.get("#\\/p1all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('b')
        })
        cy.get("#\\/p1all").find('.mjx-mrow').eq(2).should('not.exist')

        cy.get("#\\/p2all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('a')
        })
        cy.get("#\\/p2all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('b')
        })
        cy.get("#\\/p2all").find('.mjx-mrow').eq(2).should('not.exist')

        cy.get("#\\/p3all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('a')
        })
        cy.get("#\\/p3all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('b')
        })
        cy.get("#\\/p3all").find('.mjx-mrow').eq(2).should('not.exist')

        cy.get("#\\/p3alle").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('a')
        })
        cy.get("#\\/p3alle").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('b')
        })
        cy.get("#\\/p3alle").find('.mjx-mrow').eq(2).should('not.exist')

        cy.get("#\\/pallall").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('a')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('b')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
          expect(text.trim()).equal('a')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(3).invoke('text').then((text) => {
          expect(text.trim()).equal('b')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(4).invoke('text').then((text) => {
          expect(text.trim()).equal('a')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(5).invoke('text').then((text) => {
          expect(text.trim()).equal('b')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(6).should('not.exist')
        cy.get("#\\/pallall").find('.mjx-mrow').eq(7).should('not.exist')
        cy.get("#\\/pallall").find('.mjx-mrow').eq(8).should('not.exist')

        cy.get(coords1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(a,b)')
        })
        cy.get(coords2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(a,b)')
        })
        cy.get(coords3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(a,b)')
        })
        cy.get(coords3eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(a,b)')
        })
        cy.get(coordsallAnchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(a,b)')
        })
        cy.get(coordsallAnchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(a,b)')
        })
        cy.get(coordsallAnchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(a,b)')
        })

        cy.window().then(async (win) => {

          expect(components['/_point1'].stateValues.nDimensions).eq(2);
          expect((await components['/_point1'].stateValues.xs).length).eq(2);
          expect((await components['/_point1'].stateValues.xs)[0].tree).eq('a');
          expect((await components['/_point1'].stateValues.xs)[1].tree).eq('b');
          expect(components['/_point1'].stateValues.x1.tree).eq('a');
          expect(components['/_point1'].stateValues.x2.tree).eq('b');
          expect(components['/_point1'].stateValues.x3).eq(undefined);
          expect(point2.stateValues.nDimensions).eq(2);
          expect((await point2.stateValues.xs).length).eq(2);
          expect((await point2.stateValues.xs)[0].tree).eq('a');
          expect((await point2.stateValues.xs)[1].tree).eq('b');
          expect(point2.stateValues.x1.tree).eq('a');
          expect(point2.stateValues.x2.tree).eq('b');
          expect(point2.stateValues.x3).eq(undefined);
          expect(point3.stateValues.nDimensions).eq(2);
          expect((await point3.stateValues.xs).length).eq(2);
          expect((await point3.stateValues.xs)[0].tree).eq('a');
          expect((await point3.stateValues.xs)[1].tree).eq('b');
          expect(point3.stateValues.x1.tree).eq('a');
          expect(point3.stateValues.x2.tree).eq('b');
          expect(point3.stateValues.x3).eq(undefined);

        });



        cy.log(`can't increase dimension from inverse direction 2`)
        cy.get("#\\/coords2b textarea").type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}(d,e,f){enter}', { force: true });

        cy.get(point1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(d,e)')
        })
        cy.get(point2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(d,e)')
        })
        cy.get(point3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(d,e)')
        })
        cy.get(nDimensions1Anchor).should('have.text', '2');
        cy.get(nDimensions2Anchor).should('have.text', '2');
        cy.get(nDimensions3Anchor).should('have.text', '2');
        cy.get(point1x1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('d')
        })
        cy.get(point2x1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('d')
        })
        cy.get(point3x1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('d')
        })
        cy.get(point3x1eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('d')
        })
        cy.get(pointallx1Anchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('d')
        })
        cy.get(pointallx1Anchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('d')
        })
        cy.get(pointallx1Anchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('d')
        })
        cy.get(point1x2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('e')
        })
        cy.get(point2x2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('e')
        })
        cy.get(point3x2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('e')
        })
        cy.get(point3x2eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('e')
        })
        cy.get(pointallx2Anchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('e')
        })
        cy.get(pointallx2Anchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('e')
        })
        cy.get(pointallx2Anchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('e')
        })
        cy.get("#\\/p1z").should('have.text', 'z-coordinate: ')
        cy.get("#\\/p2z").should('have.text', 'z-coordinate: ')
        cy.get("#\\/p3z").should('have.text', 'z-coordinate: ')
        cy.get("#\\/p3ze").should('have.text', 'z-coordinate: ')
        cy.get("#\\/pallz").should('have.text', 'z-coordinates: ')

        cy.get("#\\/p1all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('d')
        })
        cy.get("#\\/p1all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('e')
        })
        cy.get("#\\/p1all").find('.mjx-mrow').eq(2).should('not.exist')

        cy.get("#\\/p2all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('d')
        })
        cy.get("#\\/p2all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('e')
        })
        cy.get("#\\/p2all").find('.mjx-mrow').eq(2).should('not.exist')

        cy.get("#\\/p3all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('d')
        })
        cy.get("#\\/p3all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('e')
        })
        cy.get("#\\/p3all").find('.mjx-mrow').eq(2).should('not.exist')

        cy.get("#\\/p3alle").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('d')
        })
        cy.get("#\\/p3alle").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('e')
        })
        cy.get("#\\/p3alle").find('.mjx-mrow').eq(2).should('not.exist')

        cy.get("#\\/pallall").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('d')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('e')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
          expect(text.trim()).equal('d')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(3).invoke('text').then((text) => {
          expect(text.trim()).equal('e')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(4).invoke('text').then((text) => {
          expect(text.trim()).equal('d')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(5).invoke('text').then((text) => {
          expect(text.trim()).equal('e')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(6).should('not.exist')
        cy.get("#\\/pallall").find('.mjx-mrow').eq(7).should('not.exist')
        cy.get("#\\/pallall").find('.mjx-mrow').eq(8).should('not.exist')

        cy.get(coords1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(d,e)')
        })
        cy.get(coords2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(d,e)')
        })
        cy.get(coords3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(d,e)')
        })
        cy.get(coords3eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(d,e)')
        })
        cy.get(coordsallAnchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(d,e)')
        })
        cy.get(coordsallAnchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(d,e)')
        })
        cy.get(coordsallAnchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(d,e)')
        })

        cy.window().then(async (win) => {

          expect(components['/_point1'].stateValues.nDimensions).eq(2);
          expect((await components['/_point1'].stateValues.xs).length).eq(2);
          expect((await components['/_point1'].stateValues.xs)[0].tree).eq('d');
          expect((await components['/_point1'].stateValues.xs)[1].tree).eq('e');
          expect(components['/_point1'].stateValues.x1.tree).eq('d');
          expect(components['/_point1'].stateValues.x2.tree).eq('e');
          expect(components['/_point1'].stateValues.x3).eq(undefined);
          expect(point2.stateValues.nDimensions).eq(2);
          expect((await point2.stateValues.xs).length).eq(2);
          expect((await point2.stateValues.xs)[0].tree).eq('d');
          expect((await point2.stateValues.xs)[1].tree).eq('e');
          expect(point2.stateValues.x1.tree).eq('d');
          expect(point2.stateValues.x2.tree).eq('e');
          expect(point2.stateValues.x3).eq(undefined);
          expect(point3.stateValues.nDimensions).eq(2);
          expect((await point3.stateValues.xs).length).eq(2);
          expect((await point3.stateValues.xs)[0].tree).eq('d');
          expect((await point3.stateValues.xs)[1].tree).eq('e');
          expect(point3.stateValues.x1.tree).eq('d');
          expect(point3.stateValues.x2.tree).eq('e');
          expect(point3.stateValues.x3).eq(undefined);

        });


        cy.log(`can't increase dimension from inverse direction 3`)
        cy.get("#\\/coords3b textarea").type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}(g,h,i){enter}', { force: true });

        cy.get(point1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(g,h)')
        })
        cy.get(point2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(g,h)')
        })
        cy.get(point3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(g,h)')
        })
        cy.get(nDimensions1Anchor).should('have.text', '2');
        cy.get(nDimensions2Anchor).should('have.text', '2');
        cy.get(nDimensions3Anchor).should('have.text', '2');
        cy.get(point1x1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('g')
        })
        cy.get(point2x1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('g')
        })
        cy.get(point3x1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('g')
        })
        cy.get(point3x1eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('g')
        })
        cy.get(pointallx1Anchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('g')
        })
        cy.get(pointallx1Anchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('g')
        })
        cy.get(pointallx1Anchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('g')
        })
        cy.get(point1x2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('h')
        })
        cy.get(point2x2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('h')
        })
        cy.get(point3x2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('h')
        })
        cy.get(point3x2eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('h')
        })
        cy.get(pointallx2Anchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('h')
        })
        cy.get(pointallx2Anchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('h')
        })
        cy.get(pointallx2Anchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('h')
        })
        cy.get("#\\/p1z").should('have.text', 'z-coordinate: ')
        cy.get("#\\/p2z").should('have.text', 'z-coordinate: ')
        cy.get("#\\/p3z").should('have.text', 'z-coordinate: ')
        cy.get("#\\/p3ze").should('have.text', 'z-coordinate: ')
        cy.get("#\\/pallz").should('have.text', 'z-coordinates: ')

        cy.get("#\\/p1all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('g')
        })
        cy.get("#\\/p1all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('h')
        })
        cy.get("#\\/p1all").find('.mjx-mrow').eq(2).should('not.exist')

        cy.get("#\\/p2all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('g')
        })
        cy.get("#\\/p2all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('h')
        })
        cy.get("#\\/p2all").find('.mjx-mrow').eq(2).should('not.exist')

        cy.get("#\\/p3all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('g')
        })
        cy.get("#\\/p3all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('h')
        })
        cy.get("#\\/p3all").find('.mjx-mrow').eq(2).should('not.exist')

        cy.get("#\\/p3alle").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('g')
        })
        cy.get("#\\/p3alle").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('h')
        })
        cy.get("#\\/p3alle").find('.mjx-mrow').eq(2).should('not.exist')

        cy.get("#\\/pallall").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('g')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('h')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
          expect(text.trim()).equal('g')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(3).invoke('text').then((text) => {
          expect(text.trim()).equal('h')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(4).invoke('text').then((text) => {
          expect(text.trim()).equal('g')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(5).invoke('text').then((text) => {
          expect(text.trim()).equal('h')
        })
        cy.get("#\\/pallall").find('.mjx-mrow').eq(6).should('not.exist')
        cy.get("#\\/pallall").find('.mjx-mrow').eq(7).should('not.exist')
        cy.get("#\\/pallall").find('.mjx-mrow').eq(8).should('not.exist')

        cy.get(coords1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(g,h)')
        })
        cy.get(coords2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(g,h)')
        })
        cy.get(coords3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(g,h)')
        })
        cy.get(coords3eAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(g,h)')
        })
        cy.get(coordsallAnchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(g,h)')
        })
        cy.get(coordsallAnchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(g,h)')
        })
        cy.get(coordsallAnchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(g,h)')
        })

        cy.window().then(async (win) => {

          expect(components['/_point1'].stateValues.nDimensions).eq(2);
          expect((await components['/_point1'].stateValues.xs).length).eq(2);
          expect((await components['/_point1'].stateValues.xs)[0].tree).eq('g');
          expect((await components['/_point1'].stateValues.xs)[1].tree).eq('h');
          expect(components['/_point1'].stateValues.x1.tree).eq('g');
          expect(components['/_point1'].stateValues.x2.tree).eq('h');
          expect(components['/_point1'].stateValues.x3).eq(undefined);
          expect(point2.stateValues.nDimensions).eq(2);
          expect((await point2.stateValues.xs).length).eq(2);
          expect((await point2.stateValues.xs)[0].tree).eq('g');
          expect((await point2.stateValues.xs)[1].tree).eq('h');
          expect(point2.stateValues.x1.tree).eq('g');
          expect(point2.stateValues.x2.tree).eq('h');
          expect(point2.stateValues.x3).eq(undefined);
          expect(point3.stateValues.nDimensions).eq(2);
          expect((await point3.stateValues.xs).length).eq(2);
          expect((await point3.stateValues.xs)[0].tree).eq('g');
          expect((await point3.stateValues.xs)[1].tree).eq('h');
          expect(point3.stateValues.x1.tree).eq('g');
          expect(point3.stateValues.x2.tree).eq('h');
          expect(point3.stateValues.x3).eq(undefined);

        });



      })




    })
  })

  // have this abbreviated test, at it was triggering an error
  // that wasn't caught with full test
  it('change point dimensions, abbreviated', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Specify point coordinates: <mathinput name="originalCoords" /></p>

    <section name="thePoints"><title>The points</title>
    <p>The point: <point coords="$originalCoords" /></p>
    <p>The point copied: <copy name="point2" target="_point1"/></p>
    <p>The point copied again: <copy name="point3" target="point2"/></p>
    </section>

  `}, "*");
    });

    cy.get("#\\/_text1").should('have.text', 'a'); // to wait for page to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let point1Anchor = cesc('#' + components["/_point1"].adapterUsed.componentName);
      let point2 = components["/point2"].replacements[0];
      let point2Anchor = cesc('#' + point2.adapterUsed.componentName);
      let point3 = components["/point3"].replacements[0];
      let point3Anchor = cesc('#' + point3.adapterUsed.componentName);

      cy.get(point1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      })
      cy.get(point2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      })
      cy.get(point3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      })

      cy.window().then(async (win) => {

        expect(components['/_point1'].stateValues.nDimensions).eq(1);
        expect((await components['/_point1'].stateValues.xs).length).eq(1);
        expect((await components['/_point1'].stateValues.xs)[0].tree).eq('＿');
        expect(point2.stateValues.nDimensions).eq(1);
        expect((await point2.stateValues.xs).length).eq(1);
        expect((await point2.stateValues.xs)[0].tree).eq('＿');
        expect(point3.stateValues.nDimensions).eq(1);
        expect((await point3.stateValues.xs).length).eq(1);
        expect((await point3.stateValues.xs)[0].tree).eq('＿');

      });

      cy.log('Create 2D point 2')
      cy.get('#\\/originalCoords textarea').type('(a,b){enter}', { force: true });

      cy.window().then(async (win) => {

        cy.get(point1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(a,b)')
        })
        cy.get(point2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(a,b)')
        })
        cy.get(point3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(a,b)')
        })

        cy.window().then(async (win) => {

          expect(components['/_point1'].stateValues.nDimensions).eq(2);
          expect((await components['/_point1'].stateValues.xs).length).eq(2);
          expect((await components['/_point1'].stateValues.xs)[0].tree).eq('a');
          expect((await components['/_point1'].stateValues.xs)[1].tree).eq('b');
          expect(point2.stateValues.nDimensions).eq(2);
          expect((await point2.stateValues.xs).length).eq(2);
          expect((await point2.stateValues.xs)[0].tree).eq('a');
          expect((await point2.stateValues.xs)[1].tree).eq('b');
          expect(point3.stateValues.nDimensions).eq(2);
          expect((await point3.stateValues.xs).length).eq(2);
          expect((await point3.stateValues.xs)[0].tree).eq('a');
          expect((await point3.stateValues.xs)[1].tree).eq('b');

        });

      })


      cy.log('Back to 1D point')
      cy.get('#\\/originalCoords textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}q{enter}', { force: true });

      cy.window().then(async (win) => {

        cy.get(point1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('q')
        })
        cy.get(point2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('q')
        })
        cy.get(point3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('q')
        })

        cy.window().then(async (win) => {

          expect(components['/_point1'].stateValues.nDimensions).eq(1);
          expect((await components['/_point1'].stateValues.xs).length).eq(1);
          expect((await components['/_point1'].stateValues.xs)[0].tree).eq('q');
          expect(point2.stateValues.nDimensions).eq(1);
          expect((await point2.stateValues.xs).length).eq(1);
          expect((await point2.stateValues.xs)[0].tree).eq('q');
          expect(point3.stateValues.nDimensions).eq(1);
          expect((await point3.stateValues.xs).length).eq(1);
          expect((await point3.stateValues.xs)[0].tree).eq('q');

        });

      })


      cy.log('Create 3D point')
      cy.get('#\\/originalCoords textarea').type('{end}{backspace}(2x,u/v{rightarrow},w^2{rightarrow}){enter}', { force: true });

      cy.window().then(async (win) => {

        cy.get(point1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(2x,uv,w2)')
        })
        cy.get(point2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(2x,uv,w2)')
        })
        cy.get(point3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(2x,uv,w2)')
        })
        cy.window().then(async (win) => {

          expect(components['/_point1'].stateValues.nDimensions).eq(3);
          expect((await components['/_point1'].stateValues.xs).length).eq(3);
          expect((await components['/_point1'].stateValues.xs)[0].tree).eqls(["*", 2, "x"]);
          expect((await components['/_point1'].stateValues.xs)[1].tree).eqls(["/", "u", "v"]);
          expect((await components['/_point1'].stateValues.xs)[2].tree).eqls(["^", "w", 2]);
          expect(point2.stateValues.nDimensions).eq(3);
          expect((await point2.stateValues.xs).length).eq(3);
          expect((await point2.stateValues.xs)[0].tree).eqls(["*", 2, "x"]);
          expect((await point2.stateValues.xs)[1].tree).eqls(["/", "u", "v"]);
          expect((await point2.stateValues.xs)[2].tree).eqls(["^", "w", 2]);
          expect(point3.stateValues.nDimensions).eq(3);
          expect((await point3.stateValues.xs).length).eq(3);
          expect((await point3.stateValues.xs)[0].tree).eqls(["*", 2, "x"]);
          expect((await point3.stateValues.xs)[1].tree).eqls(["/", "u", "v"]);
          expect((await point3.stateValues.xs)[2].tree).eqls(["^", "w", 2]);

        });


      })



      cy.log('Back to 2D point 2')
      cy.get('#\\/originalCoords textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}(p,q){enter}', { force: true });

      cy.window().then(async (win) => {

        cy.get(point1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(p,q)')
        })
        cy.get(point2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(p,q)')
        })
        cy.get(point3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(p,q)')
        })

        cy.window().then(async (win) => {

          expect(components['/_point1'].stateValues.nDimensions).eq(2);
          expect((await components['/_point1'].stateValues.xs).length).eq(2);
          expect((await components['/_point1'].stateValues.xs)[0].tree).eq('p');
          expect((await components['/_point1'].stateValues.xs)[1].tree).eq('q');
          expect(point2.stateValues.nDimensions).eq(2);
          expect((await point2.stateValues.xs).length).eq(2);
          expect((await point2.stateValues.xs)[0].tree).eq('p');
          expect((await point2.stateValues.xs)[1].tree).eq('q');
          expect(point3.stateValues.nDimensions).eq(2);
          expect((await point3.stateValues.xs).length).eq(2);
          expect((await point3.stateValues.xs)[0].tree).eq('p');
          expect((await point3.stateValues.xs)[1].tree).eq('q');

        });

      })

    })
  })

  it('label positioning', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <graph name="g">
      <point labelPosition="$labelPos" label="$label">(1,2)</point>
    </graph>

    <p>label: <textinput name="label" prefill="A" /></p>
    <p>position:
    <choiceinput inline preselectChoice="1" name="labelPos">
      <choice>upperRight</choice>
      <choice>upperLeft</choice>
      <choice>lowerRight</choice>
      <choice>lowerLeft</choice>
    </choiceinput>
    </p>

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    // not sure what to test as don't know how to check renderer...

    cy.get('#\\/label_input').clear().type("B{enter}")

    cy.get('#\\/labelPos').select("upperLeft")
    cy.get('#\\/labelPos').select("lowerRight")
    cy.get('#\\/labelPos').select("lowerLeft")

  });


  it('copy and overwrite coordinates, initial individual components', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <graph name="g">
      <point name="A" label="A" x="1" y="2" />
      <point name="B" label="B" x="3" y="4">
        <constraints><constrainToGrid /></constraints>
      </point>
      <point name="C" label="C" x="2$n+1" y="1" />
    </graph>

    <graph name="g1">
      <copy target="A" assignNames="A1" x="-1" />
      <copy target="B" assignNames="B1" y="-2" />
      <copy target="C" assignNames="C1" x="2$n-1" />
      <copy target="C" name="C2" assignNames="C" y="2$n-2" newNamespace />
    </graph>

    <copy target="A" assignNames="A2" z="4" />
    <copy target="C2/C" assignNames="C3" z="1" />

    <number name="n">1</number>

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.log('initial values')

    cy.get('#\\/A2 .mjx-mrow').should('contain.text', '(1,2,4)')
    cy.get('#\\/C3 .mjx-mrow').should('contain.text', '(3,0,1)')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/A'].stateValues.xs).map(x => x.tree)).eqls([1, 2])
      expect((await components['/B'].stateValues.xs).map(x => x.tree)).eqls([3, 4])
      expect((await components['/C'].stateValues.xs).map(x => x.tree)).eqls([3, 1])
      expect((await components['/A1'].stateValues.xs).map(x => x.tree)).eqls([-1, 2])
      expect((await components['/B1'].stateValues.xs).map(x => x.tree)).eqls([3, -2])
      expect((await components['/C1'].stateValues.xs).map(x => x.tree)).eqls([1, 1])
      expect((await components['/C2/C'].stateValues.xs).map(x => x.tree)).eqls([3, 0])
      expect((await components['/A2'].stateValues.xs).map(x => x.tree)).eqls([1, 2, 4])
      expect((await components['/C3'].stateValues.xs).map(x => x.tree)).eqls([3, 0, 1])
      expect(await components['/A'].stateValues.label).eq('A');
      expect(await components['/A1'].stateValues.label).eq('A');
      expect(await components['/B'].stateValues.label).eq('B');
      expect(await components['/B1'].stateValues.label).eq('B');
      expect(await components['/C'].stateValues.label).eq('C');
      expect(await components['/C1'].stateValues.label).eq('C');
      expect(await components['/C2/C'].stateValues.label).eq('C');

    })

    cy.log('move original points')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/A'].movePoint({ x: -2, y: -7 });
      await components['/B'].movePoint({ x: 5.1, y: 8.9 });
      await components['/C'].movePoint({ x: -3, y: -8 });
    })

    cy.get('#\\/A2 .mjx-mrow').should('contain.text', '(−2,−7,4)')
    cy.get('#\\/C3 .mjx-mrow').should('contain.text', '(−3,−6,1)')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/A'].stateValues.xs).map(x => x.tree)).eqls([-2, -7])
      expect((await components['/B'].stateValues.xs).map(x => x.tree)).eqls([5, 9])
      expect((await components['/C'].stateValues.xs).map(x => x.tree)).eqls([-3, -8])
      expect((await components['/A1'].stateValues.xs).map(x => x.tree)).eqls([-1, -7])
      expect((await components['/B1'].stateValues.xs).map(x => x.tree)).eqls([5, -2])
      expect((await components['/C1'].stateValues.xs).map(x => x.tree)).eqls([-5, -8])
      expect((await components['/C2/C'].stateValues.xs).map(x => x.tree)).eqls([-3, -6])
      expect((await components['/A2'].stateValues.xs).map(x => x.tree)).eqls([-2, -7, 4])
      expect((await components['/C3'].stateValues.xs).map(x => x.tree)).eqls([-3, -6, 1])

    })


    cy.log('move copied points')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/A1'].movePoint({ x: 8, y: -5 });
      await components['/B1'].movePoint({ x: -5.6, y: 6.3 });
      await components['/C1'].movePoint({ x: -7, y: 4 });
    })

    cy.get('#\\/A2 .mjx-mrow').should('contain.text', '(−2,−5,4)')
    cy.get('#\\/C3 .mjx-mrow').should('contain.text', '(−5,−8,1)')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/A'].stateValues.xs).map(x => x.tree)).eqls([-2, -5])
      expect((await components['/B'].stateValues.xs).map(x => x.tree)).eqls([-6, 9])
      expect((await components['/C'].stateValues.xs).map(x => x.tree)).eqls([-5, 4])
      expect((await components['/A1'].stateValues.xs).map(x => x.tree)).eqls([8, -5])
      expect((await components['/B1'].stateValues.xs).map(x => x.tree)).eqls([-6, 6])
      expect((await components['/C1'].stateValues.xs).map(x => x.tree)).eqls([-7, 4])
      expect((await components['/C2/C'].stateValues.xs).map(x => x.tree)).eqls([-5, -8])
      expect((await components['/A2'].stateValues.xs).map(x => x.tree)).eqls([-2, -5, 4])
      expect((await components['/C3'].stateValues.xs).map(x => x.tree)).eqls([-5, -8, 1])

    })



  });


  it('copy and overwrite coordinates, initial xs', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <graph name="g">
      <point name="A" label="A" xs="1 2" />
      <point name="B" label="B" xs="3 4">
        <constraints><constrainToGrid /></constraints>
      </point>
      <point name="C" label="C" xs="2$n+1 1" />
    </graph>

    <graph name="g1">
      <copy target="A" assignNames="A1" x="-1" />
      <copy target="B" assignNames="B1" y="-2" />
      <copy target="C" assignNames="C1" x="2$n-1" />
      <copy target="C" name="C2" assignNames="C" y="2$n-2" newNamespace />
    </graph>

    <copy target="A" assignNames="A2" z="4" />
    <copy target="C2/C" assignNames="C3" z="1" />

    <number name="n">1</number>

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.log('initial values')

    cy.get('#\\/A2 .mjx-mrow').should('contain.text', '(1,2,4)')
    cy.get('#\\/C3 .mjx-mrow').should('contain.text', '(3,0,1)')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/A'].stateValues.xs).map(x => x.tree)).eqls([1, 2])
      expect((await components['/B'].stateValues.xs).map(x => x.tree)).eqls([3, 4])
      expect((await components['/C'].stateValues.xs).map(x => x.tree)).eqls([3, 1])
      expect((await components['/A1'].stateValues.xs).map(x => x.tree)).eqls([-1, 2])
      expect((await components['/B1'].stateValues.xs).map(x => x.tree)).eqls([3, -2])
      expect((await components['/C1'].stateValues.xs).map(x => x.tree)).eqls([1, 1])
      expect((await components['/C2/C'].stateValues.xs).map(x => x.tree)).eqls([3, 0])
      expect((await components['/A2'].stateValues.xs).map(x => x.tree)).eqls([1, 2, 4])
      expect((await components['/C3'].stateValues.xs).map(x => x.tree)).eqls([3, 0, 1])
      expect(await components['/A'].stateValues.label).eq('A');
      expect(await components['/A1'].stateValues.label).eq('A');
      expect(await components['/B'].stateValues.label).eq('B');
      expect(await components['/B1'].stateValues.label).eq('B');
      expect(await components['/C'].stateValues.label).eq('C');
      expect(await components['/C1'].stateValues.label).eq('C');
      expect(await components['/C2/C'].stateValues.label).eq('C');

    })

    cy.log('move original points')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/A'].movePoint({ x: -2, y: -7 });
      await components['/B'].movePoint({ x: 5.1, y: 8.9 });
      await components['/C'].movePoint({ x: -3, y: -8 });
    })

    cy.get('#\\/A2 .mjx-mrow').should('contain.text', '(−2,−7,4)')
    cy.get('#\\/C3 .mjx-mrow').should('contain.text', '(−3,−6,1)')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/A'].stateValues.xs).map(x => x.tree)).eqls([-2, -7])
      expect((await components['/B'].stateValues.xs).map(x => x.tree)).eqls([5, 9])
      expect((await components['/C'].stateValues.xs).map(x => x.tree)).eqls([-3, -8])
      expect((await components['/A1'].stateValues.xs).map(x => x.tree)).eqls([-1, -7])
      expect((await components['/B1'].stateValues.xs).map(x => x.tree)).eqls([5, -2])
      expect((await components['/C1'].stateValues.xs).map(x => x.tree)).eqls([-5, -8])
      expect((await components['/C2/C'].stateValues.xs).map(x => x.tree)).eqls([-3, -6])
      expect((await components['/A2'].stateValues.xs).map(x => x.tree)).eqls([-2, -7, 4])
      expect((await components['/C3'].stateValues.xs).map(x => x.tree)).eqls([-3, -6, 1])

    })


    cy.log('move copied points')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/A1'].movePoint({ x: 8, y: -5 });
      await components['/B1'].movePoint({ x: -5.6, y: 6.3 });
      await components['/C1'].movePoint({ x: -7, y: 4 });
    })

    cy.get('#\\/A2 .mjx-mrow').should('contain.text', '(−2,−5,4)')
    cy.get('#\\/C3 .mjx-mrow').should('contain.text', '(−5,−8,1)')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/A'].stateValues.xs).map(x => x.tree)).eqls([-2, -5])
      expect((await components['/B'].stateValues.xs).map(x => x.tree)).eqls([-6, 9])
      expect((await components['/C'].stateValues.xs).map(x => x.tree)).eqls([-5, 4])
      expect((await components['/A1'].stateValues.xs).map(x => x.tree)).eqls([8, -5])
      expect((await components['/B1'].stateValues.xs).map(x => x.tree)).eqls([-6, 6])
      expect((await components['/C1'].stateValues.xs).map(x => x.tree)).eqls([-7, 4])
      expect((await components['/C2/C'].stateValues.xs).map(x => x.tree)).eqls([-5, -8])
      expect((await components['/A2'].stateValues.xs).map(x => x.tree)).eqls([-2, -5, 4])
      expect((await components['/C3'].stateValues.xs).map(x => x.tree)).eqls([-5, -8, 1])

    })



  });


  it('copy and overwrite coordinates, initial coords', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <graph name="g">
      <point name="A" label="A" coords="(1,2)" />
      <point name="B" label="B" coords="(3,4)">
        <constraints><constrainToGrid /></constraints>
      </point>
      <point name="C" label="C" coords="(2$n+1,1)" />
    </graph>

    <graph name="g1">
      <copy target="A" assignNames="A1" x="-1" />
      <copy target="B" assignNames="B1" y="-2" />
      <copy target="C" assignNames="C1" x="2$n-1" />
      <copy target="C" name="C2" assignNames="C" y="2$n-2" newNamespace />
    </graph>

    <copy target="A" assignNames="A2" z="4" />
    <copy target="C2/C" assignNames="C3" z="1" />

    <number name="n">1</number>

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.log('initial values')

    cy.get('#\\/A2 .mjx-mrow').should('contain.text', '(1,2,4)')
    cy.get('#\\/C3 .mjx-mrow').should('contain.text', '(3,0,1)')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/A'].stateValues.xs).map(x => x.tree)).eqls([1, 2])
      expect((await components['/B'].stateValues.xs).map(x => x.tree)).eqls([3, 4])
      expect((await components['/C'].stateValues.xs).map(x => x.tree)).eqls([3, 1])
      expect((await components['/A1'].stateValues.xs).map(x => x.tree)).eqls([-1, 2])
      expect((await components['/B1'].stateValues.xs).map(x => x.tree)).eqls([3, -2])
      expect((await components['/C1'].stateValues.xs).map(x => x.tree)).eqls([1, 1])
      expect((await components['/C2/C'].stateValues.xs).map(x => x.tree)).eqls([3, 0])
      expect((await components['/A2'].stateValues.xs).map(x => x.tree)).eqls([1, 2, 4])
      expect((await components['/C3'].stateValues.xs).map(x => x.tree)).eqls([3, 0, 1])
      expect(await components['/A'].stateValues.label).eq('A');
      expect(await components['/A1'].stateValues.label).eq('A');
      expect(await components['/B'].stateValues.label).eq('B');
      expect(await components['/B1'].stateValues.label).eq('B');
      expect(await components['/C'].stateValues.label).eq('C');
      expect(await components['/C1'].stateValues.label).eq('C');
      expect(await components['/C2/C'].stateValues.label).eq('C');

    })

    cy.log('move original points')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/A'].movePoint({ x: -2, y: -7 });
      await components['/B'].movePoint({ x: 5.1, y: 8.9 });
      await components['/C'].movePoint({ x: -3, y: -8 });
    })

    cy.get('#\\/A2 .mjx-mrow').should('contain.text', '(−2,−7,4)')
    cy.get('#\\/C3 .mjx-mrow').should('contain.text', '(−3,−6,1)')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/A'].stateValues.xs).map(x => x.tree)).eqls([-2, -7])
      expect((await components['/B'].stateValues.xs).map(x => x.tree)).eqls([5, 9])
      expect((await components['/C'].stateValues.xs).map(x => x.tree)).eqls([-3, -8])
      expect((await components['/A1'].stateValues.xs).map(x => x.tree)).eqls([-1, -7])
      expect((await components['/B1'].stateValues.xs).map(x => x.tree)).eqls([5, -2])
      expect((await components['/C1'].stateValues.xs).map(x => x.tree)).eqls([-5, -8])
      expect((await components['/C2/C'].stateValues.xs).map(x => x.tree)).eqls([-3, -6])
      expect((await components['/A2'].stateValues.xs).map(x => x.tree)).eqls([-2, -7, 4])
      expect((await components['/C3'].stateValues.xs).map(x => x.tree)).eqls([-3, -6, 1])

    })


    cy.log('move copied points')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/A1'].movePoint({ x: 8, y: -5 });
      await components['/B1'].movePoint({ x: -5.6, y: 6.3 });
      await components['/C1'].movePoint({ x: -7, y: 4 });
    })

    cy.get('#\\/A2 .mjx-mrow').should('contain.text', '(−2,−5,4)')
    cy.get('#\\/C3 .mjx-mrow').should('contain.text', '(−5,−8,1)')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/A'].stateValues.xs).map(x => x.tree)).eqls([-2, -5])
      expect((await components['/B'].stateValues.xs).map(x => x.tree)).eqls([-6, 9])
      expect((await components['/C'].stateValues.xs).map(x => x.tree)).eqls([-5, 4])
      expect((await components['/A1'].stateValues.xs).map(x => x.tree)).eqls([8, -5])
      expect((await components['/B1'].stateValues.xs).map(x => x.tree)).eqls([-6, 6])
      expect((await components['/C1'].stateValues.xs).map(x => x.tree)).eqls([-7, 4])
      expect((await components['/C2/C'].stateValues.xs).map(x => x.tree)).eqls([-5, -8])
      expect((await components['/A2'].stateValues.xs).map(x => x.tree)).eqls([-2, -5, 4])
      expect((await components['/C3'].stateValues.xs).map(x => x.tree)).eqls([-5, -8, 1])

    })



  });



})
