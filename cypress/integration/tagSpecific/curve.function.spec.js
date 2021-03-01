describe('Function curve Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')
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
      expect(components['/_curve1'].stateValues.variable.tree).eq("x");
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
      expect(components['/_curve1'].stateValues.variable.tree).eq("r");
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
    <function variable="a">a^3-a</function>
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

  it('a function with math and copy', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput prefill="1" name="a" />
    <graph>
    <curve><function><formula>
      <math>x</math>^3-x$a
    </formula></function></curve>
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
    <function variable="a">a^3-a</function>
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
      <function variable="u">
        u^4-5u^2
      </function>
    </curve>
    
    <point>
      <x>3</x><y>5</y>
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

  it('constrain to inverse function', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve flipFunction><function variable="u">
      u^4-5u^2
    </function></curve>
    
    <point>
      <x>5</x><y>3</y>
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

  });;


});
