describe('Function curve Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')
  })

  it('a function of x', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve>
      <function>x^3-x</function>
    </curve>
    </graph>
    `}, "*");
    });

    //to wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].stateValues.curveType).eq("function");
      expect(components['/_curve1'].stateValues.flipFunction).eq(false);
      expect(components['/_curve1'].stateValues.fs[0](-2)).eq(-8 + 2);
      expect(components['/_curve1'].stateValues.fs[0](3)).eq(27 - 3);
    })

  });

  it('sugar a function of x', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve>
      x^3-x
    </curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].stateValues.variableForChild.tree).eq("x");
      expect(components['/_curve1'].stateValues.flipFunction).eq(false);
      expect(components['/_curve1'].stateValues.fs[0](-2)).eq(-8 + 2);
      expect(components['/_curve1'].stateValues.fs[0](3)).eq(27 - 3);
    })

  });

  it('sugar a function of x, with strings and macros', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve>
      x^$a-x
    </curve>
    </graph>
    <number name="a">3</number>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].stateValues.variableForChild.tree).eq("x");
      expect(components['/_curve1'].stateValues.flipFunction).eq(false);
      expect(components['/_curve1'].stateValues.fs[0](-2)).eq(-8 + 2);
      expect(components['/_curve1'].stateValues.fs[0](3)).eq(27 - 3);
    })

  });

  it.skip('x = a function of y', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve>
    y^3-y = x
    </curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let functionCurve = components[components['/_curve1'].stateValues.curveChild];
      // expect(components['/_curve1'].stateValues.curveType).eq("function");
      expect(components['/_curve1'].stateValues.variables[0].tree).eq("x");
      expect(components['/_curve1'].stateValues.variables[1].tree).eq("y");
      expect(functionCurve.stateValues.flipFunction).eq(true);
      expect(functionCurve.stateValues.variables[0].tree).eq("x");
      expect(functionCurve.stateValues.variables[1].tree).eq("y");
      expect(functionCurve.stateValues.f(-2)).eq(-8 + 2);
      expect(functionCurve.stateValues.f(3)).eq(27 - 3);
    })

  });

  it.skip('x = a function of y, switching variables', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve variables="y,x">
    y^3-y = x
    </curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let functionCurve = components[components['/_curve1'].stateValues.curveChild];
      // expect(components['/_curve1'].stateValues.curveType).eq("function");
      expect(components['/_curve1'].stateValues.variables[0].tree).eq("y");
      expect(components['/_curve1'].stateValues.variables[1].tree).eq("x");
      expect(functionCurve.stateValues.flipFunction).eq(false);
      expect(functionCurve.stateValues.variables[0].tree).eq("y");
      expect(functionCurve.stateValues.variables[1].tree).eq("x");
      expect(functionCurve.stateValues.f(-2)).eq(-8 + 2);
      expect(functionCurve.stateValues.f(3)).eq(27 - 3);
    })

  });

  it.skip('q = a function of p', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve variables="p,q">
    p^3-p = q
    </curve>
    </graph>
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let functionCurve = components[components['/_curve1'].stateValues.curveChild];
      // expect(components['/_curve1'].stateValues.curveType).eq("function");
      expect(components['/_curve1'].stateValues.variables[0].tree).eq("p");
      expect(components['/_curve1'].stateValues.variables[1].tree).eq("q");
      expect(functionCurve.stateValues.flipFunction).eq(false);
      expect(functionCurve.stateValues.variables[0].tree).eq("p");
      expect(functionCurve.stateValues.variables[1].tree).eq("q");
      expect(functionCurve.stateValues.f(-2)).eq(-8 + 2);
      expect(functionCurve.stateValues.f(3)).eq(27 - 3);
    })

  });

  it.skip('q = a function of p, switching variables', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve variables="q,p">
    p^3-p = q
    </curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let functionCurve = components[components['/_curve1'].stateValues.curveChild];
      // expect(components['/_curve1'].stateValues.curveType).eq("function");
      expect(components['/_curve1'].stateValues.variables[0].tree).eq("q");
      expect(components['/_curve1'].stateValues.variables[1].tree).eq("p");
      expect(functionCurve.stateValues.flipFunction).eq(true);
      expect(functionCurve.stateValues.variables[0].tree).eq("q");
      expect(functionCurve.stateValues.variables[1].tree).eq("p");
      expect(functionCurve.stateValues.f(-2)).eq(-8 + 2);
      expect(functionCurve.stateValues.f(3)).eq(27 - 3);
    })

  });

  it('sugar a function of r', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve variable="r">
    r^3-r
    </curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].stateValues.curveType).eq("function");
      expect(components['/_curve1'].stateValues.variableForChild.tree).eq("r");
      expect(components['/_curve1'].stateValues.flipFunction).eq(false);
      expect(components['/_curve1'].stateValues.fs[0](-2)).eq(-8 + 2);
      expect(components['/_curve1'].stateValues.fs[0](3)).eq(27 - 3);
    })

  });

  it('sugar a function of r, with strings and macro', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve variable="r">
    r^$b-r
    </curve>
    </graph>
    <math name="b">3</math>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].stateValues.curveType).eq("function");
      expect(components['/_curve1'].stateValues.variableForChild.tree).eq("r");
      expect(components['/_curve1'].stateValues.flipFunction).eq(false);
      expect(components['/_curve1'].stateValues.fs[0](-2)).eq(-8 + 2);
      expect(components['/_curve1'].stateValues.fs[0](3)).eq(27 - 3);
    })

  });

  it('a function of a', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve>
    <function variables="a">a^3-a</function>
    </curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].stateValues.curveType).eq("function");
      expect(components['/_curve1'].stateValues.flipFunction).eq(false);
      expect(components['/_curve1'].stateValues.fs[0](-2)).eq(-8 + 2);
      expect(components['/_curve1'].stateValues.fs[0](3)).eq(27 - 3);
    })

  });

  it('a function with copy', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput prefill="1" name="a" />
    <graph>
    <curve><function>x^3-x$a</function></curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].stateValues.curveType).eq("function");
      expect(components['/_curve1'].stateValues.flipFunction).eq(false);
      expect(components['/_curve1'].stateValues.fs[0](-2)).eq(-8 + 2);
      expect(components['/_curve1'].stateValues.fs[0](3)).eq(27 - 3);
    })

    cy.get("#\\/a textarea").type("{end}{backspace}-2{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].stateValues.curveType).eq("function");
      expect(components['/_curve1'].stateValues.flipFunction).eq(false);
      expect(components['/_curve1'].stateValues.fs[0](-2)).eq(-8 + 2 * (-2));
      expect(components['/_curve1'].stateValues.fs[0](3)).eq(27 - 3 * (-2));
    })

  });

  it('a function manually flipped', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve flipfunction>
    <function variables="a">a^3-a</function>
    </curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].stateValues.flipFunction).eq(true);
      expect(components['/_curve1'].stateValues.fs[0](-2)).eq(-8 + 2);
      expect(components['/_curve1'].stateValues.fs[0](3)).eq(27 - 3);
    })

  });

  it('constrain to function', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve>
      <function variables="u">
        u^4-5u^2
      </function>
    </curve>
    
    <point x='3' y='5'>
    <constraints>
      <constrainTo><copy tname="_curve1" /></constrainTo>
    </constraints>
    </point>
    
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].stateValues.flipFunction).eq(false);
      let x = components['/_point1'].stateValues.xs[0].tree;
      let y = components['/_point1'].stateValues.xs[1].tree;
      expect(x).eq(3);
      expect(y).closeTo(x * x * x * x - 5 * x * x, 1E-5);
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: 1.5, y: -1.5 })
      let x = components['/_point1'].stateValues.xs[0].tree;
      let y = components['/_point1'].stateValues.xs[1].tree;
      expect(x).eq(1.5);
      expect(y).closeTo(x * x * x * x - 5 * x * x, 1E-5);
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: 0.1, y: -10 })
      let x = components['/_point1'].stateValues.xs[0].tree;
      let y = components['/_point1'].stateValues.xs[1].tree;
      expect(x).eq(0.1);
      expect(y).closeTo(x * x * x * x - 5 * x * x, 1E-5);
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: -0.1, y: -10 })
      let x = components['/_point1'].stateValues.xs[0].tree;
      let y = components['/_point1'].stateValues.xs[1].tree;
      expect(x).eq(-0.1);
      expect(y).closeTo(x * x * x * x - 5 * x * x, 1E-5);
    })

  });

  it('constrain to function, nearest point as curve', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve nearestPointAsCurve>
      <function variables="u">
        u^4-5u^2
      </function>
    </curve>
    
    <point x='3' y='5'>
    <constraints>
      <constrainTo><copy tname="_curve1" /></constrainTo>
    </constraints>
    </point>
    
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].stateValues.flipFunction).eq(false);
      let x = components['/_point1'].stateValues.xs[0].tree;
      let y = components['/_point1'].stateValues.xs[1].tree;
      expect(y).closeTo(5, 0.1);
      expect(x).greaterThan(2);
      expect(y).closeTo(x * x * x * x - 5 * x * x, 1E-5);
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: 1.5, y: -1.5 })
      let x = components['/_point1'].stateValues.xs[0].tree;
      let y = components['/_point1'].stateValues.xs[1].tree;
      expect(y).closeTo(-1.5, 0.1);
      expect(x).greaterThan(1.5);
      expect(y).closeTo(x * x * x * x - 5 * x * x, 1E-5);
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: 0.1, y: -10 })
      let x = components['/_point1'].stateValues.xs[0].tree;
      let y = components['/_point1'].stateValues.xs[1].tree;
      let minimum2 = components["/_function1"].stateValues.minima[1];

      expect(x).closeTo(minimum2[0], 0.1);
      expect(y).closeTo(minimum2[1], 0.1);
      expect(y).closeTo(x * x * x * x - 5 * x * x, 1E-5);
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: -0.1, y: -10 })
      let x = components['/_point1'].stateValues.xs[0].tree;
      let y = components['/_point1'].stateValues.xs[1].tree;
      let minimum1 = components["/_function1"].stateValues.minima[0];

      expect(x).closeTo(minimum1[0], 0.1);
      expect(y).closeTo(minimum1[1], 0.1);
      expect(y).closeTo(x * x * x * x - 5 * x * x, 1E-5);
    })


    // try a bunch of points at right to make sure stay on right branch
    // which fails with nDiscretizationPoints too low (e.g., at 100) 
    for (let v = -5; v <= -1; v += 0.1) {
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        components['/_point1'].movePoint({ x: 5, y: v })
        let x = components['/_point1'].stateValues.xs[0].tree;
        let y = components['/_point1'].stateValues.xs[1].tree;
        expect(x).greaterThan(1.7)
        expect(y).greaterThan(v);
        expect(y).lessThan(v + 0.5)
        expect(y).closeTo(x * x * x * x - 5 * x * x, 1E-5);
      })
    }
  });

  it('constrain to function, different scales from graph', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph ymax="120" ymin="-45" xmin="-1" xmax="5.5">
      <curve name="c">
        <function name='g' variables='t' domain="(0,5)">(60 t - 106 t^2 + 59*t^3 - 13 t^4 + t^5)4</function>
      </curve>
      <point x="1.5" y="2" name="A">
        <constraints>
          <constrainTo>$c</constrainTo>
        </constraints>
      </point>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    let f = t => (60 * t - 106 * t ** 2 + 59 * t ** 3 - 13 * t ** 4 + t ** 5) * 4;

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x = components['/A'].stateValues.xs[0].tree;
      let y = components['/A'].stateValues.xs[1].tree;
      expect(x).closeTo(1.5, 1E-10);
      expect(y).closeTo(f(1.5), 1E-10);
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/A'].movePoint({ x: 5, y: -60 })
      let x = components['/A'].stateValues.xs[0].tree;
      let y = components['/A'].stateValues.xs[1].tree;
      expect(x).closeTo(5, 1E-10);
      expect(y).closeTo(f(5), 1E-10);
    })

  });

  it('constrain to function, different scales from graph 2 ', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph xmax="120" xmin="-45" ymin="-1" ymax="5.5">
      <curve name="c">
        <function name='g' variables='t' domain="(-20,100)">sin(t/10)+t/50+2</function>
      </curve>
      <point x="1.5" y="2" name="A">
        <constraints>
          <constrainTo>$c</constrainTo>
        </constraints>
      </point>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    let f = t => Math.sin(t / 10) + t / 50 + 2;

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x = components['/A'].stateValues.xs[0].tree;
      let y = components['/A'].stateValues.xs[1].tree;
      expect(x).closeTo(1.5, 1E-10);
      expect(y).closeTo(f(1.5), 1E-10);
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/A'].movePoint({ x: 90, y: 5 })
      let x = components['/A'].stateValues.xs[0].tree;
      let y = components['/A'].stateValues.xs[1].tree;
      expect(x).closeTo(90, 1E-10);
      expect(y).closeTo(f(90), 1E-10);
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/A'].movePoint({ x: 120, y: -5 })
      let x = components['/A'].stateValues.xs[0].tree;
      let y = components['/A'].stateValues.xs[1].tree;
      expect(x).closeTo(100, 1E-10);
      expect(y).closeTo(f(100), 1E-10);
    })


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/A'].movePoint({ x: -10, y: 10 })
      let x = components['/A'].stateValues.xs[0].tree;
      let y = components['/A'].stateValues.xs[1].tree;
      expect(x).closeTo(-10, 1E-10);
      expect(y).closeTo(f(-10), 1E-10);
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/A'].movePoint({ x: -50, y: -100 })
      let x = components['/A'].stateValues.xs[0].tree;
      let y = components['/A'].stateValues.xs[1].tree;
      expect(x).closeTo(-20, 1E-10);
      expect(y).closeTo(f(-20), 1E-10);
    })


  });

  it('constrain to inverse function', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve flipFunction>
      <function variables="u">
        u^4-5u^2
      </function>
    </curve>
    
    <point x='5' y='3'>
    <constraints>
      <constrainTo><copy tname="_curve1" /></constrainTo>
    </constraints>
    </point>
    
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].stateValues.flipFunction).eq(true);
      let x = components['/_point1'].stateValues.xs[0].tree;
      let y = components['/_point1'].stateValues.xs[1].tree;
      expect(y).eq(3);
      expect(x).closeTo(y * y * y * y - 5 * y * y, 1E-5);
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ y: 1.5, x: -1.5 })
      let x = components['/_point1'].stateValues.xs[0].tree;
      let y = components['/_point1'].stateValues.xs[1].tree;
      expect(y).eq(1.5);
      expect(x).closeTo(y * y * y * y - 5 * y * y, 1E-5);
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ y: 0.1, x: -10 })
      let x = components['/_point1'].stateValues.xs[0].tree;
      let y = components['/_point1'].stateValues.xs[1].tree;
      expect(y).eq(0.1);
      expect(x).closeTo(y * y * y * y - 5 * y * y, 1E-5);
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ y: -0.1, x: -10 })
      let x = components['/_point1'].stateValues.xs[0].tree;
      let y = components['/_point1'].stateValues.xs[1].tree;
      expect(y).eq(-0.1);
      expect(x).closeTo(y * y * y * y - 5 * y * y, 1E-5);
    })

  });

  it('constrain to inverse function, nearest point as curve', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve flipFunction nearestPointAsCurve>
      <function variables="u">
        u^4-5u^2
      </function>
    </curve>
    
    <point x='5' y='3'>
    <constraints>
      <constrainTo><copy tname="_curve1" /></constrainTo>
    </constraints>
    </point>
    
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].stateValues.flipFunction).eq(true);
      let x = components['/_point1'].stateValues.xs[0].tree;
      let y = components['/_point1'].stateValues.xs[1].tree;
      expect(x).closeTo(5, 0.1);
      expect(y).greaterThan(2);
      expect(x).closeTo(y * y * y * y - 5 * y * y, 1E-5);
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: -1.5, y: 1.5 })
      let x = components['/_point1'].stateValues.xs[0].tree;
      let y = components['/_point1'].stateValues.xs[1].tree;
      expect(x).closeTo(-1.5, 0.1);
      expect(y).greaterThan(1.5);
      expect(x).closeTo(y * y * y * y - 5 * y * y, 1E-5);
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: -10, y: 0.1 })
      let x = components['/_point1'].stateValues.xs[0].tree;
      let y = components['/_point1'].stateValues.xs[1].tree;
      let minimum2 = components["/_function1"].stateValues.minima[1];

      expect(y).closeTo(minimum2[0], 0.1);
      expect(x).closeTo(minimum2[1], 0.1);
      expect(x).closeTo(y * y * y * y - 5 * y * y, 1E-5);
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: -10, y: -0.1 })
      let x = components['/_point1'].stateValues.xs[0].tree;
      let y = components['/_point1'].stateValues.xs[1].tree;
      let minimum1 = components["/_function1"].stateValues.minima[0];

      expect(y).closeTo(minimum1[0], 0.1);
      expect(x).closeTo(minimum1[1], 0.1);
      expect(x).closeTo(y * y * y * y - 5 * y * y, 1E-5);
    })


    // try a bunch of points at top to make sure stay on top branch
    // which fails with nDiscretizationPoints too low (e.g., at 100) 
    for (let v = -5; v <= -1; v += 0.1) {
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        components['/_point1'].movePoint({ x: v, y: 5 })
        let x = components['/_point1'].stateValues.xs[0].tree;
        let y = components['/_point1'].stateValues.xs[1].tree;
        expect(y).greaterThan(1.7)
        expect(x).greaterThan(v);
        expect(x).lessThan(v + 0.5)
        expect(x).closeTo(y * y * y * y - 5 * y * y, 1E-5);
      })
    }
  });

  it('constrain to inverse function, different scales from graph', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph xmax="120" xmin="-45" ymin="-1" ymax="5.5">
      <curve name="c" flipFunction>
        <function name='g' variables='t' domain="(0,5)">(60 t - 106 t^2 + 59*t^3 - 13 t^4 + t^5)4</function>
      </curve>
      <point y="1.5" x="2" name="A">
        <constraints>
          <constrainTo>$c</constrainTo>
        </constraints>
      </point>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    let f = t => (60 * t - 106 * t ** 2 + 59 * t ** 3 - 13 * t ** 4 + t ** 5) * 4;

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x = components['/A'].stateValues.xs[0].tree;
      let y = components['/A'].stateValues.xs[1].tree;
      expect(y).closeTo(1.5, 1E-10);
      expect(x).closeTo(f(1.5), 1E-10);
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/A'].movePoint({ x: -60, y: 5 })
      let x = components['/A'].stateValues.xs[0].tree;
      let y = components['/A'].stateValues.xs[1].tree;
      expect(y).closeTo(5, 1E-10);
      expect(x).closeTo(f(5), 1E-10);
    })

  });

  it('constrain to inverse function, different scales from graph 2 ', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph ymax="120" ymin="-45" xmin="-1" xmax="5.5">
      <curve name="c" flipFunction>
        <function name='g' variables='t' domain="(-20,100)">sin(t/10)+t/50+2</function>
      </curve>
      <point y="1.5" x="2" name="A">
        <constraints>
          <constrainTo>$c</constrainTo>
        </constraints>
      </point>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    let f = t => Math.sin(t / 10) + t / 50 + 2;

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x = components['/A'].stateValues.xs[0].tree;
      let y = components['/A'].stateValues.xs[1].tree;
      expect(y).closeTo(1.5, 1E-10);
      expect(x).closeTo(f(1.5), 1E-10);
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/A'].movePoint({ x: 5, y: 90 })
      let x = components['/A'].stateValues.xs[0].tree;
      let y = components['/A'].stateValues.xs[1].tree;
      expect(y).closeTo(90, 1E-10);
      expect(x).closeTo(f(90), 1E-10);
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/A'].movePoint({ x: -5, y: 120 })
      let x = components['/A'].stateValues.xs[0].tree;
      let y = components['/A'].stateValues.xs[1].tree;
      expect(y).closeTo(100, 1E-10);
      expect(x).closeTo(f(100), 1E-10);
    })


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/A'].movePoint({ x: 10, y: -10 })
      let x = components['/A'].stateValues.xs[0].tree;
      let y = components['/A'].stateValues.xs[1].tree;
      expect(y).closeTo(-10, 1E-10);
      expect(x).closeTo(f(-10), 1E-10);
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/A'].movePoint({ x: -100, y: -50 })
      let x = components['/A'].stateValues.xs[0].tree;
      let y = components['/A'].stateValues.xs[1].tree;
      expect(y).closeTo(-20, 1E-10);
      expect(x).closeTo(f(-20), 1E-10);
    })


  });


});
