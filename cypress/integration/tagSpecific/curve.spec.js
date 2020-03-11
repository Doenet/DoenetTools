describe('Curve Tag Tests', function () {

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
      expect(components['/_curve1'].state.curveType).eq("function");
      expect(components['/_curve1'].state.flipFunction).eq(false);
      expect(components['/_curve1'].state.variables[0].tree).eq("x");
      expect(components['/_curve1'].state.variables[1].tree).eq("y");
      expect(components['/_curve1'].state.f(-2)).eq(-8 + 2);
      expect(components['/_curve1'].state.f(3)).eq(27 - 3);
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
      expect(components['/_curve1'].state.curveType).eq("function");
      expect(components['/_curve1'].state.flipFunction).eq(false);
      expect(components['/_curve1'].state.variables[0].tree).eq("x");
      expect(components['/_curve1'].state.variables[1].tree).eq("y");
      expect(components['/_curve1'].state.f(-2)).eq(-8 + 2);
      expect(components['/_curve1'].state.f(3)).eq(27 - 3);
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
      expect(components['/_curve1'].state.curveType).eq("function");
      expect(components['/_curve1'].state.flipFunction).eq(true);
      expect(components['/_curve1'].state.variables[0].tree).eq("x");
      expect(components['/_curve1'].state.variables[1].tree).eq("y");
      expect(components['/_curve1'].state.f(-2)).eq(-8 + 2);
      expect(components['/_curve1'].state.f(3)).eq(27 - 3);
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
      expect(components['/_curve1'].state.curveType).eq("function");
      expect(components['/_curve1'].state.flipFunction).eq(false);
      expect(components['/_curve1'].state.variables[0].tree).eq("y");
      expect(components['/_curve1'].state.variables[1].tree).eq("x");
      expect(components['/_curve1'].state.f(-2)).eq(-8 + 2);
      expect(components['/_curve1'].state.f(3)).eq(27 - 3);
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
      expect(components['/_curve1'].state.curveType).eq("function");
      expect(components['/_curve1'].state.flipFunction).eq(false);
      expect(components['/_curve1'].state.variables[0].tree).eq("p");
      expect(components['/_curve1'].state.variables[1].tree).eq("q");
      expect(components['/_curve1'].state.f(-2)).eq(-8 + 2);
      expect(components['/_curve1'].state.f(3)).eq(27 - 3);
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
      expect(components['/_curve1'].state.curveType).eq("function");
      expect(components['/_curve1'].state.flipFunction).eq(true);
      expect(components['/_curve1'].state.variables[0].tree).eq("q");
      expect(components['/_curve1'].state.variables[1].tree).eq("p");
      expect(components['/_curve1'].state.f(-2)).eq(-8 + 2);
      expect(components['/_curve1'].state.f(3)).eq(27 - 3);
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
      expect(components['/_curve1'].state.curveType).eq("function");
      expect(components['/_curve1'].state.flipFunction).eq(false);
      expect(components['/_curve1'].state.variables[0].tree).eq("r");
      expect(components['/_curve1'].state.variables[1].tree).eq("u");
      expect(components['/_curve1'].state.f(-2)).eq(-8 + 2);
      expect(components['/_curve1'].state.f(3)).eq(27 - 3);
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
      expect(components['/_curve1'].state.curveType).eq("function");
      expect(components['/_curve1'].state.flipFunction).eq(false);
      expect(components['/_curve1'].state.variables[0].tree).eq("r");
      expect(components['/_curve1'].state.variables[1].tree).eq("u");
      expect(components['/_curve1'].state.f(-2)).eq(-8 + 2);
      expect(components['/_curve1'].state.f(3)).eq(27 - 3);
    })

  });

  it('an unsugared function, manually flipped', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve variables="r,u" flipfunction="true">
    <function variable="a">a^3-a</function>
    </curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.curveType).eq("function");
      expect(components['/_curve1'].state.flipFunction).eq(true);
      expect(components['/_curve1'].state.variables[0].tree).eq("r");
      expect(components['/_curve1'].state.variables[1].tree).eq("u");
      expect(components['/_curve1'].state.f(-2)).eq(-8 + 2);
      expect(components['/_curve1'].state.f(3)).eq(27 - 3);
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
      expect(components['/_curve1'].state.curveType).eq("function");
      expect(components['/_curve1'].state.flipFunction).eq(false);
      expect(components['/_curve1'].state.variables[0].tree).eq("x");
      expect(components['/_curve1'].state.variables[1].tree).eq("y");
      expect(components['/_curve1'].state.f(-2)).eq(-8 + 2);
      expect(components['/_curve1'].state.f(3)).eq(27 - 3);
    })

    cy.get("#\\/_mathinput1_input").clear().type("-2{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.curveType).eq("function");
      expect(components['/_curve1'].state.flipFunction).eq(false);
      expect(components['/_curve1'].state.variables[0].tree).eq("x");
      expect(components['/_curve1'].state.variables[1].tree).eq("y");
      expect(components['/_curve1'].state.f(-2)).eq(-8 + 2 * (-2));
      expect(components['/_curve1'].state.f(3)).eq(27 - 3 * (-2));
    })

  });

  it('a parameterization in terms of t', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve>
    5t^3, 3t^5
    </curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.curveType).eq("parameterization");
      expect(components['/_curve1'].state.variables[0].tree).eq("x");
      expect(components['/_curve1'].state.variables[1].tree).eq("y");
      expect(components['/_curve1'].state.parameter.tree).eq("t");
      expect(components['/_curve1'].state.parmin.tree).eq(-10);
      expect(components['/_curve1'].state.parmax.tree).eq(10);
      expect(components['/_curve1'].state.fs[0](-2)).eq(-5 * 8);
      expect(components['/_curve1'].state.fs[0](3)).eq(5 * 27);
      expect(components['/_curve1'].state.fs[1](-2)).eq(-3 * 32);
      expect(components['/_curve1'].state.fs[1](3)).eq(3 * 243);
    })

  });

  it('a parameterization in terms of s', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve parameter="s">
    5s^3, 3s^5
    </curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.curveType).eq("parameterization");
      expect(components['/_curve1'].state.variables[0].tree).eq("x");
      expect(components['/_curve1'].state.variables[1].tree).eq("y");
      expect(components['/_curve1'].state.parameter.tree).eq("s");
      expect(components['/_curve1'].state.parmin.tree).eq(-10);
      expect(components['/_curve1'].state.parmax.tree).eq(10);
      expect(components['/_curve1'].state.fs[0](-2)).eq(-5 * 8);
      expect(components['/_curve1'].state.fs[0](3)).eq(5 * 27);
      expect(components['/_curve1'].state.fs[1](-2)).eq(-3 * 32);
      expect(components['/_curve1'].state.fs[1](3)).eq(3 * 243);
    })

  });

  it('x, y = a parameterization in terms of t', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve>
    x = 5t^3, 3t^5 = y
    </curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.curveType).eq("parameterization");
      expect(components['/_curve1'].state.variables[0].tree).eq("x");
      expect(components['/_curve1'].state.variables[1].tree).eq("y");
      expect(components['/_curve1'].state.parameter.tree).eq("t");
      expect(components['/_curve1'].state.parmin.tree).eq(-10);
      expect(components['/_curve1'].state.parmax.tree).eq(10);
      expect(components['/_curve1'].state.fs[0](-2)).eq(-5 * 8);
      expect(components['/_curve1'].state.fs[0](3)).eq(5 * 27);
      expect(components['/_curve1'].state.fs[1](-2)).eq(-3 * 32);
      expect(components['/_curve1'].state.fs[1](3)).eq(3 * 243);
    })

  });

  it('x, y = a parameterization in terms of t, swapped variables', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve variables="y,x">
    x = 5t^3, 3t^5 = y
    </curve>
    </graph>
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.curveType).eq("parameterization");
      expect(components['/_curve1'].state.variables[0].tree).eq("y");
      expect(components['/_curve1'].state.variables[1].tree).eq("x");
      expect(components['/_curve1'].state.parameter.tree).eq("t");
      expect(components['/_curve1'].state.parmin.tree).eq(-10);
      expect(components['/_curve1'].state.parmax.tree).eq(10);
      expect(components['/_curve1'].state.fs[1](-2)).eq(-5 * 8);
      expect(components['/_curve1'].state.fs[1](3)).eq(5 * 27);
      expect(components['/_curve1'].state.fs[0](-2)).eq(-3 * 32);
      expect(components['/_curve1'].state.fs[0](3)).eq(3 * 243);
    })

  });

  it('u, v = a parameterization in terms of s', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve variables="u,v" parameter="s">
    u = 5s^3, 3s^5 = v
    </curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.curveType).eq("parameterization");
      expect(components['/_curve1'].state.variables[0].tree).eq("u");
      expect(components['/_curve1'].state.variables[1].tree).eq("v");
      expect(components['/_curve1'].state.parameter.tree).eq("s");
      expect(components['/_curve1'].state.parmin.tree).eq(-10);
      expect(components['/_curve1'].state.parmax.tree).eq(10);
      expect(components['/_curve1'].state.fs[0](-2)).eq(-5 * 8);
      expect(components['/_curve1'].state.fs[0](3)).eq(5 * 27);
      expect(components['/_curve1'].state.fs[1](-2)).eq(-3 * 32);
      expect(components['/_curve1'].state.fs[1](3)).eq(3 * 243);
    })

  });

  it('x, y = a parameterization in terms of t, vector form', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve>
    (5t^3, 3t^5) = (x,y)
    </curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.curveType).eq("parameterization");
      expect(components['/_curve1'].state.variables[0].tree).eq("x");
      expect(components['/_curve1'].state.variables[1].tree).eq("y");
      expect(components['/_curve1'].state.parameter.tree).eq("t");
      expect(components['/_curve1'].state.parmin.tree).eq(-10);
      expect(components['/_curve1'].state.parmax.tree).eq(10);
      expect(components['/_curve1'].state.fs[0](-2)).eq(-5 * 8);
      expect(components['/_curve1'].state.fs[0](3)).eq(5 * 27);
      expect(components['/_curve1'].state.fs[1](-2)).eq(-3 * 32);
      expect(components['/_curve1'].state.fs[1](3)).eq(3 * 243);
    })

  });

  it('x, y = a parameterization in terms of t, vector form, switched', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve>
    (x,y) = (5t^3, 3t^5)
    </curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.curveType).eq("parameterization");
      expect(components['/_curve1'].state.variables[0].tree).eq("x");
      expect(components['/_curve1'].state.variables[1].tree).eq("y");
      expect(components['/_curve1'].state.parameter.tree).eq("t");
      expect(components['/_curve1'].state.parmin.tree).eq(-10);
      expect(components['/_curve1'].state.parmax.tree).eq(10);
      expect(components['/_curve1'].state.fs[0](-2)).eq(-5 * 8);
      expect(components['/_curve1'].state.fs[0](3)).eq(5 * 27);
      expect(components['/_curve1'].state.fs[1](-2)).eq(-3 * 32);
      expect(components['/_curve1'].state.fs[1](3)).eq(3 * 243);
    })

  });

  it('x, y = a parameterization in terms of t, change par limits', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve parmin="-1" parmax="0.5">
    x = 5t^3, 3t^5 = y
    </curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.curveType).eq("parameterization");
      expect(components['/_curve1'].state.variables[0].tree).eq("x");
      expect(components['/_curve1'].state.variables[1].tree).eq("y");
      expect(components['/_curve1'].state.parameter.tree).eq("t");
      expect(components['/_curve1'].state.parmin.tree).eq(-1);
      expect(components['/_curve1'].state.parmax.tree).eq(0.5);
      expect(components['/_curve1'].state.fs[0](-2)).eq(-5 * 8);
      expect(components['/_curve1'].state.fs[0](3)).eq(5 * 27);
      expect(components['/_curve1'].state.fs[1](-2)).eq(-3 * 32);
      expect(components['/_curve1'].state.fs[1](3)).eq(3 * 243);
    })

  });

  it('a parameterization, no sugar', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve>
    <function variable="q">5q^3</function>
    <function variable="u">3u^5</function>
    </curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.curveType).eq("parameterization");
      expect(components['/_curve1'].state.variables[0].tree).eq("x");
      expect(components['/_curve1'].state.variables[1].tree).eq("y");
      expect(components['/_curve1'].state.parameter.tree).eq("t");
      expect(components['/_curve1'].state.parmin.tree).eq(-10);
      expect(components['/_curve1'].state.parmax.tree).eq(10);
      expect(components['/_curve1'].state.fs[0](-2)).eq(-5 * 8);
      expect(components['/_curve1'].state.fs[0](3)).eq(5 * 27);
      expect(components['/_curve1'].state.fs[1](-2)).eq(-3 * 32);
      expect(components['/_curve1'].state.fs[1](3)).eq(3 * 243);
    })

  });

  it('a parameterization with parens', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve>
    (t-2)(t-3), (t+2)(t+3)
    </curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.curveType).eq("parameterization");
      expect(components['/_curve1'].state.variables[0].tree).eq("x");
      expect(components['/_curve1'].state.variables[1].tree).eq("y");
      expect(components['/_curve1'].state.parameter.tree).eq("t");
      expect(components['/_curve1'].state.parmin.tree).eq(-10);
      expect(components['/_curve1'].state.parmax.tree).eq(10);
      expect(components['/_curve1'].state.fs[0](-2)).eq(4 * 5);
      expect(components['/_curve1'].state.fs[0](3)).eq(0);
      expect(components['/_curve1'].state.fs[1](-2)).eq(0);
      expect(components['/_curve1'].state.fs[1](3)).eq(5 * 6);
    })

  });

  it('a parameterization with math and ref', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput prefill="2"/>
    <graph>
    <curve>
    x = <math>t</math><ref prop="value">_mathinput1</ref>+1,
    y = <math>t^3</math>-<ref prop="value">_mathinput1</ref>
    </curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.curveType).eq("parameterization");
      expect(components['/_curve1'].state.variables[0].tree).eq("x");
      expect(components['/_curve1'].state.variables[1].tree).eq("y");
      expect(components['/_curve1'].state.parameter.tree).eq("t");
      expect(components['/_curve1'].state.parmin.tree).eq(-10);
      expect(components['/_curve1'].state.parmax.tree).eq(10);
      expect(components['/_curve1'].state.fs[0](-2)).eq(-4 + 1);
      expect(components['/_curve1'].state.fs[0](3)).eq(6 + 1);
      expect(components['/_curve1'].state.fs[1](-2)).eq(-8 - 2);
      expect(components['/_curve1'].state.fs[1](3)).eq(27 - 2);
    })

    cy.get("#\\/_mathinput1_input").clear().type("-3{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.curveType).eq("parameterization");
      expect(components['/_curve1'].state.variables[0].tree).eq("x");
      expect(components['/_curve1'].state.variables[1].tree).eq("y");
      expect(components['/_curve1'].state.parameter.tree).eq("t");
      expect(components['/_curve1'].state.parmin.tree).eq(-10);
      expect(components['/_curve1'].state.parmax.tree).eq(10);
      expect(components['/_curve1'].state.fs[0](-2)).eq(6 + 1);
      expect(components['/_curve1'].state.fs[0](3)).eq(-9 + 1);
      expect(components['/_curve1'].state.fs[1](-2)).eq(-8 + 3);
      expect(components['/_curve1'].state.fs[1](3)).eq(27 + 3);
    })
  });

  it('spline through four points, as string with ref', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput prefill="-2"/>
    <graph>
    <curve>
    (-1,2),(2, <ref prop="value">_mathinput1</ref>),
    (2<ref prop="value">_mathinput1</ref>, -4), (5,6)
    </curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.curveType).eq("spline");
      expect(components['/_curve1'].state.nPoints).eq(4);
      expect(components['/_curve1'].state.splineform).eq("centripetal");
      expect(components['/_curve1'].state.splinetension).eq(0.8);
      expect(components['/_curve1'].parameterization(1, 0)).eq(2);
      expect(components['/_curve1'].parameterization(1, 1)).eq(-2);
      expect(components['/_curve1'].parameterization(1)).eqls([2, -2]);
      expect(components['/_curve1'].parameterization(2, 0)).eq(-4);
      expect(components['/_curve1'].parameterization(2, 1)).eq(-4);
      expect(components['/_curve1'].parameterization(2)).eqls([-4, -4]);
    })

    cy.get("#\\/_mathinput1_input").clear().type("4{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.curveType).eq("spline");
      expect(components['/_curve1'].state.nPoints).eq(4);
      expect(components['/_curve1'].state.splineform).eq("centripetal");
      expect(components['/_curve1'].state.splinetension).eq(0.8);
      expect(components['/_curve1'].parameterization(1, 0)).eq(2);
      expect(components['/_curve1'].parameterization(1, 1)).eq(4);
      expect(components['/_curve1'].parameterization(1)).eqls([2, 4]);
      expect(components['/_curve1'].parameterization(2, 0)).eq(8);
      expect(components['/_curve1'].parameterization(2, 1)).eq(-4);
      expect(components['/_curve1'].parameterization(2)).eqls([8, -4]);
    })

  });

  it('spline through four points, as reffed points', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput prefill="-2"/>
    <graph>
    <point>(-1,2)</point>
    <point>(2, <ref prop="value">_mathinput1</ref>)</point>
    <point>(2<ref prop="value">_mathinput1</ref>, -4)</point>
    <point>(5,6)</point>
    <curve>
    <ref>_point1</ref>
    <ref>_point2</ref>
    <ref>_point3</ref>
    <ref>_point4</ref>
    </curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.curveType).eq("spline");
      expect(components['/_curve1'].state.nPoints).eq(4);
      expect(components['/_curve1'].state.splineform).eq("centripetal");
      expect(components['/_curve1'].state.splinetension).eq(0.8);
      expect(components['/_curve1'].parameterization(1, 0)).eq(2);
      expect(components['/_curve1'].parameterization(1, 1)).eq(-2);
      expect(components['/_curve1'].parameterization(1)).eqls([2, -2]);
      expect(components['/_curve1'].parameterization(2, 0)).eq(-4);
      expect(components['/_curve1'].parameterization(2, 1)).eq(-4);
      expect(components['/_curve1'].parameterization(2)).eqls([-4, -4]);
    })

    cy.get("#\\/_mathinput1_input").clear().type("4{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.curveType).eq("spline");
      expect(components['/_curve1'].state.nPoints).eq(4);
      expect(components['/_curve1'].state.splineform).eq("centripetal");
      expect(components['/_curve1'].state.splinetension).eq(0.8);
      expect(components['/_curve1'].parameterization(1, 0)).eq(2);
      expect(components['/_curve1'].parameterization(1, 1)).eq(4);
      expect(components['/_curve1'].parameterization(1)).eqls([2, 4]);
      expect(components['/_curve1'].parameterization(2, 0)).eq(8);
      expect(components['/_curve1'].parameterization(2, 1)).eq(-4);
      expect(components['/_curve1'].parameterization(2)).eqls([8, -4]);
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point2'].movePoint({ x: 5, y: 7 })
      expect(components['/_curve1'].state.curveType).eq("spline");
      expect(components['/_curve1'].state.nPoints).eq(4);
      expect(components['/_curve1'].state.splineform).eq("centripetal");
      expect(components['/_curve1'].state.splinetension).eq(0.8);
      expect(components['/_curve1'].parameterization(1, 0)).eq(5);
      expect(components['/_curve1'].parameterization(1, 1)).eq(7);
      expect(components['/_curve1'].parameterization(1)).eqls([5, 7]);
      expect(components['/_curve1'].parameterization(2, 0)).eq(14);
      expect(components['/_curve1'].parameterization(2, 1)).eq(-4);
      expect(components['/_curve1'].parameterization(2)).eqls([14, -4]);
    })

  });

  it('spline through four points, as reffed points, no sugar', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput prefill="-2"/>
    <graph>
    <point>(-1,2)</point>
    <point>(2, <ref prop="value">_mathinput1</ref>)</point>
    <point>(2<ref prop="value">_mathinput1</ref>, -4)</point>
    <point>(5,6)</point>
    <curve>
    <through>
    <ref>_point1</ref>
    <ref>_point2</ref>
    <ref>_point3</ref>
    <ref>_point4</ref>
    </through>
    </curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.curveType).eq("spline");
      expect(components['/_curve1'].state.nPoints).eq(4);
      expect(components['/_curve1'].state.splineform).eq("centripetal");
      expect(components['/_curve1'].state.splinetension).eq(0.8);
      expect(components['/_curve1'].parameterization(1, 0)).eq(2);
      expect(components['/_curve1'].parameterization(1, 1)).eq(-2);
      expect(components['/_curve1'].parameterization(1)).eqls([2, -2]);
      expect(components['/_curve1'].parameterization(2, 0)).eq(-4);
      expect(components['/_curve1'].parameterization(2, 1)).eq(-4);
      expect(components['/_curve1'].parameterization(2)).eqls([-4, -4]);
    })

    cy.get("#\\/_mathinput1_input").clear().type("4{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.curveType).eq("spline");
      expect(components['/_curve1'].state.nPoints).eq(4);
      expect(components['/_curve1'].state.splineform).eq("centripetal");
      expect(components['/_curve1'].state.splinetension).eq(0.8);
      expect(components['/_curve1'].parameterization(1, 0)).eq(2);
      expect(components['/_curve1'].parameterization(1, 1)).eq(4);
      expect(components['/_curve1'].parameterization(1)).eqls([2, 4]);
      expect(components['/_curve1'].parameterization(2, 0)).eq(8);
      expect(components['/_curve1'].parameterization(2, 1)).eq(-4);
      expect(components['/_curve1'].parameterization(2)).eqls([8, -4]);
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point2'].movePoint({ x: 5, y: 7 })
      expect(components['/_curve1'].state.curveType).eq("spline");
      expect(components['/_curve1'].state.nPoints).eq(4);
      expect(components['/_curve1'].state.splineform).eq("centripetal");
      expect(components['/_curve1'].state.splinetension).eq(0.8);
      expect(components['/_curve1'].parameterization(1, 0)).eq(5);
      expect(components['/_curve1'].parameterization(1, 1)).eq(7);
      expect(components['/_curve1'].parameterization(1)).eqls([5, 7]);
      expect(components['/_curve1'].parameterization(2, 0)).eq(14);
      expect(components['/_curve1'].parameterization(2, 1)).eq(-4);
      expect(components['/_curve1'].parameterization(2)).eqls([14, -4]);
    })

  });

  it('spline through four points, as reffed points, change spline parameters', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput prefill="-2"/>
    <graph>
    <point>(-1,2)</point>
    <point>(2, <ref prop="value">_mathinput1</ref>)</point>
    <point>(2<ref prop="value">_mathinput1</ref>, -4)</point>
    <point>(5,6)</point>
    <curve splineform="uniform" splinetension="0.4">
    <ref>_point1</ref>
    <ref>_point2</ref>
    <ref>_point3</ref>
    <ref>_point4</ref>
    </curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.curveType).eq("spline");
      expect(components['/_curve1'].state.nPoints).eq(4);
      expect(components['/_curve1'].state.splineform).eq("uniform");
      expect(components['/_curve1'].state.splinetension).eq(0.4);
      expect(components['/_curve1'].parameterization(1, 0)).eq(2);
      expect(components['/_curve1'].parameterization(1, 1)).eq(-2);
      expect(components['/_curve1'].parameterization(1)).eqls([2, -2]);
      expect(components['/_curve1'].parameterization(2, 0)).eq(-4);
      expect(components['/_curve1'].parameterization(2, 1)).eq(-4);
      expect(components['/_curve1'].parameterization(2)).eqls([-4, -4]);
    })

    cy.get("#\\/_mathinput1_input").clear().type("4{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.curveType).eq("spline");
      expect(components['/_curve1'].state.nPoints).eq(4);
      expect(components['/_curve1'].state.splineform).eq("uniform");
      expect(components['/_curve1'].state.splinetension).eq(0.4);
      expect(components['/_curve1'].parameterization(1, 0)).eq(2);
      expect(components['/_curve1'].parameterization(1, 1)).eq(4);
      expect(components['/_curve1'].parameterization(1)).eqls([2, 4]);
      expect(components['/_curve1'].parameterization(2, 0)).eq(8);
      expect(components['/_curve1'].parameterization(2, 1)).eq(-4);
      expect(components['/_curve1'].parameterization(2)).eqls([8, -4]);
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point2'].movePoint({ x: 5, y: 7 })
      expect(components['/_curve1'].state.curveType).eq("spline");
      expect(components['/_curve1'].state.nPoints).eq(4);
      expect(components['/_curve1'].state.splineform).eq("uniform");
      expect(components['/_curve1'].state.splinetension).eq(0.4);
      expect(components['/_curve1'].parameterization(1, 0)).eq(5);
      expect(components['/_curve1'].parameterization(1, 1)).eq(7);
      expect(components['/_curve1'].parameterization(1)).eqls([5, 7]);
      expect(components['/_curve1'].parameterization(2, 0)).eq(14);
      expect(components['/_curve1'].parameterization(2, 1)).eq(-4);
      expect(components['/_curve1'].parameterization(2)).eqls([14, -4]);
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
      expect(components['/_curve1'].state.curveType).eq("function");
      expect(components['/_curve1'].state.flipFunction).eq(false);
      let x = components['/_point1'].state.xs[0].tree;
      let y = components['/_point1'].state.xs[1].tree;
      expect(y).closeTo(5, 0.1);
      expect(x).greaterThan(2);
      expect(y).closeTo(x * x * x * x - 5 * x * x, 1E-5);
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: 1.5, y: -1.5 })
      let x = components['/_point1'].state.xs[0].tree;
      let y = components['/_point1'].state.xs[1].tree;
      expect(y).closeTo(-1.5, 0.1);
      expect(x).greaterThan(1.5);
      expect(y).closeTo(x * x * x * x - 5 * x * x, 1E-5);
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: 0.1, y: -10 })
      let x = components['/_point1'].state.xs[0].tree;
      let y = components['/_point1'].state.xs[1].tree;
      let vertexx = Math.sqrt(10) / 2;
      let vertexy = Math.pow(vertexx, 4) - 5 * Math.pow(vertexx, 2);
      expect(x).closeTo(vertexx, 0.1);
      expect(y).closeTo(vertexy, 0.1);
      expect(y).closeTo(x * x * x * x - 5 * x * x, 1E-5);
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: -0.1, y: -10 })
      let x = components['/_point1'].state.xs[0].tree;
      let y = components['/_point1'].state.xs[1].tree;
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
      expect(components['/_curve1'].state.curveType).eq("function");
      expect(components['/_curve1'].state.flipFunction).eq(true);
      let x = components['/_point1'].state.xs[0].tree;
      let y = components['/_point1'].state.xs[1].tree;
      expect(x).closeTo(5, 0.1);
      expect(y).greaterThan(2);
      expect(x).closeTo(y * y * y * y - 5 * y * y, 1E-5);
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ y: 1.5, x: -1.5 })
      let x = components['/_point1'].state.xs[0].tree;
      let y = components['/_point1'].state.xs[1].tree;
      expect(x).closeTo(-1.5, 0.1);
      expect(y).greaterThan(1.5);
      expect(x).closeTo(y * y * y * y - 5 * y * y, 1E-5);
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ y: 0.1, x: -10 })
      let x = components['/_point1'].state.xs[0].tree;
      let y = components['/_point1'].state.xs[1].tree;
      let vertexx = Math.sqrt(10) / 2;
      let vertexy = Math.pow(vertexx, 4) - 5 * Math.pow(vertexx, 2);
      expect(y).closeTo(vertexx, 0.1);
      expect(x).closeTo(vertexy, 0.1);
      expect(x).closeTo(y * y * y * y - 5 * y * y, 1E-5);
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ y: -0.1, x: -10 })
      let x = components['/_point1'].state.xs[0].tree;
      let y = components['/_point1'].state.xs[1].tree;
      let vertexx = -Math.sqrt(10) / 2;
      let vertexy = Math.pow(vertexx, 4) - 5 * Math.pow(vertexx, 2);
      expect(y).closeTo(vertexx, 0.1);
      expect(x).closeTo(vertexy, 0.1);
      expect(x).closeTo(y * y * y * y - 5 * y * y, 1E-5);
    })

  });

  it('constrain to parametrized curve', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput prefill="-2"/>
    <mathinput prefill="2"/>
    <graph>
    <curve variables="u,v" parameter="s">
    <parmin><ref prop="value">_mathinput1</ref></parmin>
    <parmax><ref prop="value">_mathinput2</ref></parmax>
    u=s^3, v=sin(2s)
    </curve>
    
    <point>(7,1)
    <constrainTo><ref>_curve1</ref></constrainTo>
    </point>
    
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.curveType).eq("parameterization");
      let x = components['/_point1'].state.xs[0].tree;
      let y = components['/_point1'].state.xs[1].tree;
      expect(x).closeTo(7, 0.5);
      expect(y).closeTo(Math.sin(2 * Math.pow(x, 1 / 3)), 1E-5);
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: -2, y: 10 })
      let x = components['/_point1'].state.xs[0].tree;
      let y = components['/_point1'].state.xs[1].tree;
      expect(x).closeTo(0.3, 0.1);
      expect(y).closeTo(Math.sin(2 * Math.pow(x, 1 / 3)), 1E-5);
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: -10, y: 2 })
      let x = components['/_point1'].state.xs[0].tree;
      let y = components['/_point1'].state.xs[1].tree;
      expect(x).closeTo(-8, 1E-3);
      expect(y).closeTo(Math.sin(-4), 1E-3);
    })

    cy.get("#\\/_mathinput1_input").clear().type("-1{enter}")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x = components['/_point1'].state.xs[0].tree;
      let y = components['/_point1'].state.xs[1].tree;
      expect(x).closeTo(-1, 1E-3);
      expect(y).closeTo(Math.sin(-2), 1E-3);
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: 10, y: 2 })
      let x = components['/_point1'].state.xs[0].tree;
      let y = components['/_point1'].state.xs[1].tree;
      expect(x).closeTo(8, 1E-3);
      expect(y).closeTo(Math.sin(4), 1E-3);
    })

    cy.get("#\\/_mathinput2_input").clear().type("1{enter}")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x = components['/_point1'].state.xs[0].tree;
      let y = components['/_point1'].state.xs[1].tree;
      expect(x).closeTo(1, 1E-3);
      expect(y).closeTo(Math.sin(2), 1E-3);
    })

  });

  it('constrain to spline', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <textinput />
    <mathinput prefill="0.8"/>
    <graph>
    <point>(-7,-4)</point>
    <point>(2.5,6)</point>
    <point>(3, 5.8)</point>
    <point>(8,-6)</point>
    <curve>
      <splineform><ref prop="value">_textinput1</ref></splineform>
      <splinetension><ref prop="value">_mathinput1</ref></splinetension>
     <ref>_point1</ref>
     <ref>_point2</ref>
     <ref>_point3</ref>
     <ref>_point4</ref>
    </curve>
    
    <point>(5,10)
    <constrainTo><ref>_curve1</ref></constrainTo>
    </point>
    
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.curveType).eq("spline");
      expect(components['/_curve1'].state.nPoints).eq(4);
      expect(components['/_curve1'].state.splineform).eq("centripetal");
      expect(components['/_curve1'].state.splinetension).eq(0.8);

      let x = components['/_point5'].state.xs[0].tree;
      let y = components['/_point5'].state.xs[1].tree;
      expect(x).closeTo(2.8, 0.1);
      expect(y).closeTo(6.1, 0.1);
    })

    cy.get("#\\/_textinput1_input").clear().type("uniform{enter}")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.splineform).eq("uniform");
      expect(components['/_curve1'].state.splinetension).eq(0.8);
      let x = components['/_point5'].state.xs[0].tree;
      let y = components['/_point5'].state.xs[1].tree;
      expect(x).closeTo(3.4, 0.1);
      expect(y).closeTo(8, 0.1);
    })

    cy.get("#\\/_textinput1_input").clear().type("centripetal{enter}")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.splineform).eq("centripetal");
      expect(components['/_curve1'].state.splinetension).eq(0.8);
      let x = components['/_point5'].state.xs[0].tree;
      let y = components['/_point5'].state.xs[1].tree;
      expect(x).closeTo(2.8, 0.1);
      expect(y).closeTo(6.1, 0.1);
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point5'].movePoint({ x: 10, y: 2 })
      let x = components['/_point5'].state.xs[0].tree;
      let y = components['/_point5'].state.xs[1].tree;
      expect(x).closeTo(5.5, 0.1);
      expect(y).closeTo(0.2, 0.1);
    })

    cy.get("#\\/_mathinput1_input").clear().type("0.1{enter}")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.splineform).eq("centripetal");
      expect(components['/_curve1'].state.splinetension).eq(0.1);
      let x = components['/_point5'].state.xs[0].tree;
      let y = components['/_point5'].state.xs[1].tree;
      expect(x).closeTo(5.5, 0.1);
      expect(y).closeTo(0.2, 0.1);
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: 9, y: 9 });
      components['/_point2'].movePoint({ x: -9, y: 2 });
      components['/_point3'].movePoint({ x: 6, y: -8 });
      components['/_point4'].movePoint({ x: 9, y: 9 });
      components['/_point5'].movePoint({ x: 10, y: -7 });
      expect(components['/_curve1'].state.splineform).eq("centripetal");
      expect(components['/_curve1'].state.splinetension).eq(0.1);
      let x = components['/_point5'].state.xs[0].tree;
      let y = components['/_point5'].state.xs[1].tree;
      expect(x).closeTo(6.4, 0.1);
      expect(y).closeTo(-6.3, 0.1);
    })

    cy.get("#\\/_textinput1_input").clear().type("uniform{enter}")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point5'].movePoint({ x: 10, y: -7 });
      expect(components['/_curve1'].state.splineform).eq("uniform");
      expect(components['/_curve1'].state.splinetension).eq(0.1);
      let x = components['/_point5'].state.xs[0].tree;
      let y = components['/_point5'].state.xs[1].tree;
      expect(x).closeTo(6.5, 0.1);
      expect(y).closeTo(-6.3, 0.1);
    })

    cy.get("#\\/_mathinput1_input").clear().type("1{enter}")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point5'].movePoint({ x: 10, y: -7 });
      expect(components['/_curve1'].state.splineform).eq("uniform");
      expect(components['/_curve1'].state.splinetension).eq(1);
      let x = components['/_point5'].state.xs[0].tree;
      let y = components['/_point5'].state.xs[1].tree;
      expect(x).closeTo(8.6, 0.1);
      expect(y).closeTo(-6.1, 0.1);
    })

    cy.get("#\\/_textinput1_input").clear().blur()
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point5'].movePoint({ x: 10, y: -7 });
      expect(components['/_curve1'].state.splineform).eq("centripetal");
      expect(components['/_curve1'].state.splinetension).eq(1);
      let x = components['/_point5'].state.xs[0].tree;
      let y = components['/_point5'].state.xs[1].tree;
      expect(x).closeTo(7.4, 0.1);
      expect(y).closeTo(-6.1, 0.1);
    })

  });

  it('extrapolate', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <booleaninput />
    <booleaninput />
    <graph>
    <point>(-7,-4)</point>
    <point>(-4, 3)</point>
    <point>(4, 3)</point>
    <point>(7,-4)</point>
    <curve>
    <extrapolatebackward><ref prop="value">_booleaninput1</ref></extrapolatebackward>
    <extrapolateforward><ref prop="value">_booleaninput2</ref></extrapolateforward>

     <ref>_point1</ref>
     <ref>_point2</ref>
     <ref>_point3</ref>
     <ref>_point4</ref>
    </curve>
    
    <point>(8,-8)
    <constrainTo><ref>_curve1</ref></constrainTo>
    </point>
    <point>(-8,-8)
    <constrainTo><ref>_curve1</ref></constrainTo>
    </point>
    
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let x = components['/_point5'].state.xs[0].tree;
      let y = components['/_point5'].state.xs[1].tree;
      expect(x).closeTo(7, 1E-3);
      expect(y).closeTo(-4, 1E-3);

      x = components['/_point6'].state.xs[0].tree;
      y = components['/_point6'].state.xs[1].tree;
      expect(x).closeTo(-7, 1E-3);
      expect(y).closeTo(-4, 1E-3);
    })

    cy.log("turn on extrapolation")
    cy.get("#\\/_booleaninput1_input").click();
    cy.get("#\\/_booleaninput2_input").click();

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let x = components['/_point5'].state.xs[0].tree;
      let y = components['/_point5'].state.xs[1].tree;
      expect(x).closeTo(8.6, 0.1);
      expect(y).closeTo(-7.7, 0.1);

      x = components['/_point6'].state.xs[0].tree;
      y = components['/_point6'].state.xs[1].tree;
      expect(x).closeTo(-8.6, 0.1);
      expect(y).closeTo(-7.7, 0.1);
    })

    cy.log("activate bezier controls and move tangents")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].togglePointControl(0)
      components['/_curve1'].moveControlvector({
        controlvectorInd: 0,
        controlvector: [-1, 2]
      })
      components['/_curve1'].togglePointControl(3)
      components['/_curve1'].moveControlvector({
        controlvectorInd: 2 * 3 - 1,
        controlvector: [1, 2]
      })
      let x = components['/_point5'].state.xs[0].tree;
      let y = components['/_point5'].state.xs[1].tree;
      expect(x).closeTo(5.7, 0.1);
      expect(y).closeTo(-5.6, 0.1);

      x = components['/_point6'].state.xs[0].tree;
      y = components['/_point6'].state.xs[1].tree;
      expect(x).closeTo(-5.7, 0.1);
      expect(y).closeTo(-5.6, 0.1);
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveControlvector({
        controlvectorInd: 0,
        controlvector: [1, -2]
      })
      components['/_curve1'].moveControlvector({
        controlvectorInd: 2 * 3 - 1,
        controlvector: [-1, -2]
      })

      components['/_point5'].movePoint({ x: 9, y: -3 })

      let x = components['/_point5'].state.xs[0].tree;
      let y = components['/_point5'].state.xs[1].tree;
      expect(x).closeTo(7.5, 0.1);
      expect(y).closeTo(-2.5, 0.1);

      components['/_point6'].movePoint({ x: -9, y: -3 })

      x = components['/_point6'].state.xs[0].tree;
      y = components['/_point6'].state.xs[1].tree;
      expect(x).closeTo(-7.5, 0.1);
      expect(y).closeTo(-2.5, 0.1);
    })


  });

  it('variable length curve', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Number of points: <mathinput /></p>
    <p>Step size: <mathinput /></p>
    
    <graph>
    <curve>
      <through>
      <map>
        <template><point>(<subsref/>, sin(<subsref/>))</point></template>
        <substitutions>
          <sequence from="0">
            <count><ref prop="value">_mathinput1</ref></count>
            <step><ref prop="value">_mathinput2</ref></step>
          </sequence>
        </substitutions>
      </map>
      </through>
    </curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let curve = components['/_curve1'];

      expect(curve.state.throughpoints.length).eq(0);
      expect(curve.state.controlvectors.length).eq(0);

    })

    cy.get("#\\/_mathinput1_input").clear().type("10{enter}");
    cy.get("#\\/_mathinput2_input").clear().type("1{enter}");

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let curve = components['/_curve1'];

      let throughpoints = curve.state.throughpoints;

      expect(throughpoints.length).eq(10);
      expect(curve.state.controlvectors.length).eq(19);

      for (let i = 0; i < 10; i++) {
        expect(throughpoints[i].tree[1]).closeTo(i, 1E-12);
        expect(throughpoints[i].tree[2]).closeTo(Math.sin(i), 1E-12);
      }
    })

    cy.get("#\\/_mathinput1_input").clear().type("20{enter}");

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let curve = components['/_curve1'];

      let throughpoints = curve.state.throughpoints;

      expect(throughpoints.length).eq(20);
      expect(curve.state.controlvectors.length).eq(39);

      for (let i = 0; i < 20; i++) {
        expect(throughpoints[i].tree[1]).closeTo(i, 1E-12);
        expect(throughpoints[i].tree[2]).closeTo(Math.sin(i), 1E-12);
      }
    })


    cy.get("#\\/_mathinput2_input").clear().type("0.5{enter}");

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let curve = components['/_curve1'];

      let throughpoints = curve.state.throughpoints;

      expect(throughpoints.length).eq(20);
      expect(curve.state.controlvectors.length).eq(39);

      for (let i = 0; i < 20; i++) {
        expect(throughpoints[i].tree[1]).closeTo(i * 0.5, 1E-12);
        expect(throughpoints[i].tree[2]).closeTo(Math.sin(i * 0.5), 1E-12);
      }
    })

    cy.get("#\\/_mathinput1_input").clear().type("10{enter}");

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let curve = components['/_curve1'];

      let throughpoints = curve.state.throughpoints;

      expect(throughpoints.length).eq(10);
      expect(curve.state.controlvectors.length).eq(19);

      for (let i = 0; i < 10; i++) {
        expect(throughpoints[i].tree[1]).closeTo(i * 0.5, 1E-12);
        expect(throughpoints[i].tree[2]).closeTo(Math.sin(i * 0.5), 1E-12);
      }
    })


  });

  it('new curve from reffed vertices, some flipped', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve>(-9,6),(-3,7),(4,0),(8,5)</curve>
    </graph>
    <graph>
    <curve>
      <ref prop="throughpoint1">_curve1</ref>
      <point>
        (<extract prop="y"><ref prop="throughpoint2">_curve1</ref></extract>,
        <extract prop="x"><ref prop="throughpoint2">_curve1</ref></extract>)
      </point>
      <ref prop="throughpoint3">_curve1</ref>
      <point>
        <x><extract prop="y"><ref prop="throughpoint4">_curve1</ref></extract></x>
        <y><extract prop="x"><ref prop="throughpoint4">_curve1</ref></extract></y>
      </point>
    </curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then((win) => {
      let ps = [[-9, 6], [-3, 7], [4, 0], [8, 5]];
      let psflipped = [[-9, 6], [7, -3], [4, 0], [5, 8]];
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...ps[0]]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...ps[1]]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...ps[2]]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...ps[3]]);
      expect(components['/_curve2'].state.throughpoints[0].tree).eqls(['tuple', ...psflipped[0]]);
      expect(components['/_curve2'].state.throughpoints[1].tree).eqls(['tuple', ...psflipped[1]]);
      expect(components['/_curve2'].state.throughpoints[2].tree).eqls(['tuple', ...psflipped[2]]);
      expect(components['/_curve2'].state.throughpoints[3].tree).eqls(['tuple', ...psflipped[3]]);
    })

    cy.log('move first curve points')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let ps = [[7, 2], [1, -3], [2, 9], [-4, -3]];
      let psflipped = [[7, 2], [-3, 1], [2, 9], [-3, -4]];

      components['/_curve1'].moveThroughpoint({
        throughpointInd: 0,
        throughpoint: ps[0]
      });

      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...ps[0]]);
      expect(components['/_curve2'].state.throughpoints[0].tree).eqls(['tuple', ...psflipped[0]]);

      components['/_curve1'].moveThroughpoint({
        throughpointInd: 1,
        throughpoint: ps[1]
      });

      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...ps[1]]);
      expect(components['/_curve2'].state.throughpoints[1].tree).eqls(['tuple', ...psflipped[1]]);

      components['/_curve1'].moveThroughpoint({
        throughpointInd: 2,
        throughpoint: ps[2]
      });

      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...ps[2]]);
      expect(components['/_curve2'].state.throughpoints[2].tree).eqls(['tuple', ...psflipped[2]]);

      components['/_curve1'].moveThroughpoint({
        throughpointInd: 3,
        throughpoint: ps[3]
      });

      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...ps[3]]);
      expect(components['/_curve2'].state.throughpoints[3].tree).eqls(['tuple', ...psflipped[3]]);

    })

    cy.log('move second polyline verticies')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let ps = [[-1, 9], [7, 5], [-8, 1], [6, -7]];
      let psflipped = [[-1, 9], [5, 7], [-8, 1], [-7, 6]];

      components['/_curve2'].moveThroughpoint({
        throughpointInd: 0,
        throughpoint: psflipped[0]
      });

      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...ps[0]]);
      expect(components['/_curve2'].state.throughpoints[0].tree).eqls(['tuple', ...psflipped[0]]);

      components['/_curve2'].moveThroughpoint({
        throughpointInd: 1,
        throughpoint: psflipped[1]
      });

      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...ps[1]]);
      expect(components['/_curve2'].state.throughpoints[1].tree).eqls(['tuple', ...psflipped[1]]);

      components['/_curve2'].moveThroughpoint({
        throughpointInd: 2,
        throughpoint: psflipped[2]
      });

      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...ps[2]]);
      expect(components['/_curve2'].state.throughpoints[2].tree).eqls(['tuple', ...psflipped[2]]);

      components['/_curve2'].moveThroughpoint({
        throughpointInd: 3,
        throughpoint: psflipped[3]
      });

      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...ps[3]]);
      expect(components['/_curve2'].state.throughpoints[3].tree).eqls(['tuple', ...psflipped[3]]);

    })

  });

  it('extracting point coordinates of symmetric curve', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve>
      <point>(1,2)</point>
      <point>
        (<ref prop="y">_point1</ref>, <ref prop="x">_point1</ref>)
      </point>
    </curve> 
    <point name="x1">
      <x><extract prop="x"><ref prop="throughpoint1">_curve1</ref></extract></x>
      <y fixed>3</y>
    </point>
    <point name="x2">
      <x><extract prop="x"><ref prop="throughpoint2">_curve1</ref></extract></x>
      <y fixed>4</y>
    </point>
    <point name="y1">
      <y><extract prop="y"><ref prop="throughpoint1">_curve1</ref></extract></y>
      <x fixed>3</x>
    </point>
    <point name="y2">
      <y><extract prop="y"><ref prop="throughpoint2">_curve1</ref></extract></y>
      <x fixed>4</x>
    </point>
  </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    let x = 1, y = 2;

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", x, y]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", y, x]);
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
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", x, y]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", y, x]);
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
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", x, y]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", y, x]);
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
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", x, y]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", y, x]);
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
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", x, y]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", y, x]);
      expect(components['/x1'].state.xs[0].tree).eq(x);
      expect(components['/x2'].state.xs[0].tree).eq(y);
      expect(components['/y1'].state.xs[1].tree).eq(y);
      expect(components['/y2'].state.xs[1].tree).eq(x);
    })


  });

});
