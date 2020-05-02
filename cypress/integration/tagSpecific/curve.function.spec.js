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
    x^3-x
    </curve>
    </graph>
    `}, "*");
    });

    //to wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let functionCurve  = components[components['/_curve1'].stateValues.curveChild];
      // expect(components['/_curve1'].stateValues.curveType).eq("function");
      expect(components['/_curve1'].stateValues.variables[0].tree).eq("x");
      expect(components['/_curve1'].stateValues.variables[1].tree).eq("y");
      expect(functionCurve.stateValues.flipFunction).eq(false);
      expect(functionCurve.stateValues.variables[0].tree).eq("x");
      expect(functionCurve.stateValues.variables[1].tree).eq("y");
      expect(functionCurve.stateValues.f(-2)).eq(-8 + 2);
      expect(functionCurve.stateValues.f(3)).eq(27 - 3);
    })

  });

  it('y = a function of x', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve>
    y = x^3-x
    </curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let functionCurve  = components[components['/_curve1'].stateValues.curveChild];
      expect(components['/_curve1'].stateValues.variables[0].tree).eq("x");
      expect(components['/_curve1'].stateValues.variables[1].tree).eq("y");
      expect(functionCurve.stateValues.flipFunction).eq(false);
      expect(functionCurve.stateValues.variables[0].tree).eq("x");
      expect(functionCurve.stateValues.variables[1].tree).eq("y");
      expect(functionCurve.stateValues.f(-2)).eq(-8 + 2);
      expect(functionCurve.stateValues.f(3)).eq(27 - 3);
    })

  });

  it('x = a function of y', () => {
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
      let functionCurve  = components[components['/_curve1'].stateValues.curveChild];
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

  it('x = a function of y, switching variables', () => {
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
      let functionCurve  = components[components['/_curve1'].stateValues.curveChild];
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

  it('q = a function of p', () => {
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
      let functionCurve  = components[components['/_curve1'].stateValues.curveChild];
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

  it('q = a function of p, switching variables', () => {
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
      let functionCurve  = components[components['/_curve1'].stateValues.curveChild];
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

  it('a function of r', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve variables="r,u">
    r^3-r
    </curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let functionCurve  = components[components['/_curve1'].stateValues.curveChild];
      // expect(components['/_curve1'].stateValues.curveType).eq("function");
      expect(components['/_curve1'].stateValues.variables[0].tree).eq("r");
      expect(components['/_curve1'].stateValues.variables[1].tree).eq("u");
      expect(functionCurve.stateValues.flipFunction).eq(false);
      expect(functionCurve.stateValues.variables[0].tree).eq("r");
      expect(functionCurve.stateValues.variables[1].tree).eq("u");
      expect(functionCurve.stateValues.f(-2)).eq(-8 + 2);
      expect(functionCurve.stateValues.f(3)).eq(27 - 3);
    })

  });

  it('an unsugared function', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve variables="r,u">
    <function variable="a">a^3-a</function>
    </curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let functionCurve  = components[components['/_curve1'].stateValues.curveChild];
      //expect(components['/_curve1'].stateValues.curveType).eq("function");
      expect(components['/_curve1'].stateValues.variables[0].tree).eq("r");
      expect(components['/_curve1'].stateValues.variables[1].tree).eq("u");
      expect(functionCurve.stateValues.flipFunction).eq(false);
      expect(functionCurve.stateValues.variables[0].tree).eq("r");
      expect(functionCurve.stateValues.variables[1].tree).eq("u");
      expect(functionCurve.stateValues.f(-2)).eq(-8 + 2);
      expect(functionCurve.stateValues.f(3)).eq(27 - 3);
    })

  });

  it('a function with math and ref', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput prefill="1"/>
    <graph>
    <curve>
    <math>x</math>^3-x<ref prop="value">_mathinput1</ref>
    </curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let functionCurve  = components[components['/_curve1'].stateValues.curveChild];
      // expect(components['/_curve1'].stateValues.curveType).eq("function");
      expect(components['/_curve1'].stateValues.variables[0].tree).eq("x");
      expect(components['/_curve1'].stateValues.variables[1].tree).eq("y");
      expect(functionCurve.stateValues.flipFunction).eq(false);
      expect(functionCurve.stateValues.variables[0].tree).eq("x");
      expect(functionCurve.stateValues.variables[1].tree).eq("y");
      expect(functionCurve.stateValues.f(-2)).eq(-8 + 2);
      expect(functionCurve.stateValues.f(3)).eq(27 - 3);
    })

    cy.get("#\\/_mathinput1_input").clear().type("-2{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let functionCurve  = components[components['/_curve1'].stateValues.curveChild];
      // expect(components['/_curve1'].stateValues.curveType).eq("function");
      expect(components['/_curve1'].stateValues.variables[0].tree).eq("x");
      expect(components['/_curve1'].stateValues.variables[1].tree).eq("y");
      expect(functionCurve.stateValues.flipFunction).eq(false);
      expect(functionCurve.stateValues.variables[0].tree).eq("x");
      expect(functionCurve.stateValues.variables[1].tree).eq("y");
      expect(functionCurve.stateValues.f(-2)).eq(-8 + 2 * (-2));
      expect(functionCurve.stateValues.f(3)).eq(27 - 3 * (-2));
    })

  });

  it('an unsugared functioncurve', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <functioncurve variables="r,u">
    <function variable="a">a^3-a</function>
    </functioncurve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_functioncurve1'].stateValues.flipFunction).eq(false);
      expect(components['/_functioncurve1'].stateValues.variables[0].tree).eq("r");
      expect(components['/_functioncurve1'].stateValues.variables[1].tree).eq("u");
      expect(components['/_functioncurve1'].stateValues.f(-2)).eq(-8 + 2);
      expect(components['/_functioncurve1'].stateValues.f(3)).eq(27 - 3);
    })

  });

  it('an unsugared functioncurve, manually flipped', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <functioncurve variables="r,u" flipfunction="true">
    <function variable="a">a^3-a</function>
    </functioncurve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_functioncurve1'].stateValues.flipFunction).eq(true);
      expect(components['/_functioncurve1'].stateValues.variables[0].tree).eq("r");
      expect(components['/_functioncurve1'].stateValues.variables[1].tree).eq("u");
      expect(components['/_functioncurve1'].stateValues.f(-2)).eq(-8 + 2);
      expect(components['/_functioncurve1'].stateValues.f(3)).eq(27 - 3);
    })

  });

  it('a functioncurve with math and ref', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput prefill="1"/>
    <graph>
    <functioncurve>
    <function>
    <math>x</math>^3-x<ref prop="value">_mathinput1</ref>
    </function>
    </functioncurve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_functioncurve1'].stateValues.flipFunction).eq(false);
      expect(components['/_functioncurve1'].stateValues.variables[0].tree).eq("x");
      expect(components['/_functioncurve1'].stateValues.variables[1].tree).eq("y");
      expect(components['/_functioncurve1'].stateValues.f(-2)).eq(-8 + 2);
      expect(components['/_functioncurve1'].stateValues.f(3)).eq(27 - 3);
    })

    cy.get("#\\/_mathinput1_input").clear().type("-2{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_functioncurve1'].stateValues.flipFunction).eq(false);
      expect(components['/_functioncurve1'].stateValues.variables[0].tree).eq("x");
      expect(components['/_functioncurve1'].stateValues.variables[1].tree).eq("y");
      expect(components['/_functioncurve1'].stateValues.f(-2)).eq(-8 + 2 * (-2));
      expect(components['/_functioncurve1'].stateValues.f(3)).eq(27 - 3 * (-2));
    })

  });

  it('constrain to function', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve variables="u,v">
    v = u^4-5u^2
    </curve>
    
    <point>(3,5)
    <constrainTo><ref>_curve1</ref></constrainTo>
    </point>
    
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let functionCurve  = components[components['/_curve1'].stateValues.curveChild];
      expect(functionCurve.stateValues.flipFunction).eq(false);
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
      let vertexx = Math.sqrt(10) / 2;
      let vertexy = Math.pow(vertexx, 4) - 5 * Math.pow(vertexx, 2);
      expect(x).closeTo(vertexx, 0.1);
      expect(y).closeTo(vertexy, 0.1);
      expect(y).closeTo(x * x * x * x - 5 * x * x, 1E-5);
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: -0.1, y: -10 })
      let x = components['/_point1'].stateValues.xs[0].tree;
      let y = components['/_point1'].stateValues.xs[1].tree;
      let vertexx = -Math.sqrt(10) / 2;
      let vertexy = Math.pow(vertexx, 4) - 5 * Math.pow(vertexx, 2);
      expect(x).closeTo(vertexx, 0.1);
      expect(y).closeTo(vertexy, 0.1);
      expect(y).closeTo(x * x * x * x - 5 * x * x, 1E-5);
    })

  });

  it('constrain to inverse function', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve variables="v,u">
    v = u^4-5u^2
    </curve>
    
    <point>(5,3)
    <constrainTo><ref>_curve1</ref></constrainTo>
    </point>
    
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let functionCurve  = components[components['/_curve1'].stateValues.curveChild];
      expect(functionCurve.stateValues.flipFunction).eq(true);
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
      expect(x).closeTo(-1.5, 0.1);
      expect(y).greaterThan(1.5);
      expect(x).closeTo(y * y * y * y - 5 * y * y, 1E-5);
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ y: 0.1, x: -10 })
      let x = components['/_point1'].stateValues.xs[0].tree;
      let y = components['/_point1'].stateValues.xs[1].tree;
      let vertexx = Math.sqrt(10) / 2;
      let vertexy = Math.pow(vertexx, 4) - 5 * Math.pow(vertexx, 2);
      expect(y).closeTo(vertexx, 0.1);
      expect(x).closeTo(vertexy, 0.1);
      expect(x).closeTo(y * y * y * y - 5 * y * y, 1E-5);
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ y: -0.1, x: -10 })
      let x = components['/_point1'].stateValues.xs[0].tree;
      let y = components['/_point1'].stateValues.xs[1].tree;
      let vertexx = -Math.sqrt(10) / 2;
      let vertexy = Math.pow(vertexx, 4) - 5 * Math.pow(vertexx, 2);
      expect(y).closeTo(vertexx, 0.1);
      expect(x).closeTo(vertexy, 0.1);
      expect(x).closeTo(y * y * y * y - 5 * y * y, 1E-5);
    })

  });

  it('constrain to functionCurve', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <functioncurve>
    <function variable="u">u^4-5u^2</function>
    </functioncurve>
    
    <point>(3,5)
    <constrainTo><ref>_functioncurve1</ref></constrainTo>
    </point>
    
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
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
      let vertexx = Math.sqrt(10) / 2;
      let vertexy = Math.pow(vertexx, 4) - 5 * Math.pow(vertexx, 2);
      expect(x).closeTo(vertexx, 0.1);
      expect(y).closeTo(vertexy, 0.1);
      expect(y).closeTo(x * x * x * x - 5 * x * x, 1E-5);
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: -0.1, y: -10 })
      let x = components['/_point1'].stateValues.xs[0].tree;
      let y = components['/_point1'].stateValues.xs[1].tree;
      let vertexx = -Math.sqrt(10) / 2;
      let vertexy = Math.pow(vertexx, 4) - 5 * Math.pow(vertexx, 2);
      expect(x).closeTo(vertexx, 0.1);
      expect(y).closeTo(vertexy, 0.1);
      expect(y).closeTo(x * x * x * x - 5 * x * x, 1E-5);
    })

  });

  it('constrain to inverse functionCurve', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <functioncurve flipfunction="true">
    <function variable="u">u^4-5u^2</function>
    </functioncurve>
    
    <point>(5,3)
    <constrainTo><ref>_functioncurve1</ref></constrainTo>
    </point>
    
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
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
      expect(x).closeTo(-1.5, 0.1);
      expect(y).greaterThan(1.5);
      expect(x).closeTo(y * y * y * y - 5 * y * y, 1E-5);
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ y: 0.1, x: -10 })
      let x = components['/_point1'].stateValues.xs[0].tree;
      let y = components['/_point1'].stateValues.xs[1].tree;
      let vertexx = Math.sqrt(10) / 2;
      let vertexy = Math.pow(vertexx, 4) - 5 * Math.pow(vertexx, 2);
      expect(y).closeTo(vertexx, 0.1);
      expect(x).closeTo(vertexy, 0.1);
      expect(x).closeTo(y * y * y * y - 5 * y * y, 1E-5);
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ y: -0.1, x: -10 })
      let x = components['/_point1'].stateValues.xs[0].tree;
      let y = components['/_point1'].stateValues.xs[1].tree;
      let vertexx = -Math.sqrt(10) / 2;
      let vertexy = Math.pow(vertexx, 4) - 5 * Math.pow(vertexx, 2);
      expect(y).closeTo(vertexx, 0.1);
      expect(x).closeTo(vertexy, 0.1);
      expect(x).closeTo(y * y * y * y - 5 * y * y, 1E-5);
    })

  });


});
