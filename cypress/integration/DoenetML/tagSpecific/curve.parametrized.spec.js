describe('Parameterized Curve Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')
  })

  it('sugar a parameterization in terms of x', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve>
    (5x^3, 3x^5)
    </curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].stateValues.curveType).eq("parameterization");
      expect(components['/_curve1'].stateValues.variableForChild.tree).eq("x");
      expect(components['/_curve1'].stateValues.parMin).eq(-10);
      expect(components['/_curve1'].stateValues.parMax).eq(10);
      expect(components['/_curve1'].stateValues.fs[0](-2)).eq(-5 * 8);
      expect(components['/_curve1'].stateValues.fs[0](3)).eq(5 * 27);
      expect(components['/_curve1'].stateValues.fs[1](-2)).eq(-3 * 32);
      expect(components['/_curve1'].stateValues.fs[1](3)).eq(3 * 243);
    })

  });

  it('sugar a parameterization in terms of x, with strings and macros', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve>
    ($b x^$a, $a x^$b)
    </curve>
    </graph>
    <number name="a">3</number>
    <math name="b">5</math>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].stateValues.curveType).eq("parameterization");
      expect(components['/_curve1'].stateValues.variableForChild.tree).eq("x");
      expect(components['/_curve1'].stateValues.parMin).eq(-10);
      expect(components['/_curve1'].stateValues.parMax).eq(10);
      expect(components['/_curve1'].stateValues.fs[0](-2)).eq(-5 * 8);
      expect(components['/_curve1'].stateValues.fs[0](3)).eq(5 * 27);
      expect(components['/_curve1'].stateValues.fs[1](-2)).eq(-3 * 32);
      expect(components['/_curve1'].stateValues.fs[1](3)).eq(3 * 243);
    })

  });

  it('sugar a parameterization in terms of t', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve variable="t">
    (5t^3, 3t^5)
    </curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].stateValues.curveType).eq("parameterization");
      expect(components['/_curve1'].stateValues.variableForChild.tree).eq("t");
      expect(components['/_curve1'].stateValues.parMin).eq(-10);
      expect(components['/_curve1'].stateValues.parMax).eq(10);
      expect(components['/_curve1'].stateValues.fs[0](-2)).eq(-5 * 8);
      expect(components['/_curve1'].stateValues.fs[0](3)).eq(5 * 27);
      expect(components['/_curve1'].stateValues.fs[1](-2)).eq(-3 * 32);
      expect(components['/_curve1'].stateValues.fs[1](3)).eq(3 * 243);
    })

  });

  it('sugar a parameterization in terms of t, with strings and macro', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve variable="$var">
    (5$var^3, 3$var^5)
    </curve>
    </graph>
    <math name="var">t</math>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].stateValues.curveType).eq("parameterization");
      expect(components['/_curve1'].stateValues.variableForChild.tree).eq("t");
      expect(components['/_curve1'].stateValues.parMin).eq(-10);
      expect(components['/_curve1'].stateValues.parMax).eq(10);
      expect(components['/_curve1'].stateValues.fs[0](-2)).eq(-5 * 8);
      expect(components['/_curve1'].stateValues.fs[0](3)).eq(5 * 27);
      expect(components['/_curve1'].stateValues.fs[1](-2)).eq(-3 * 32);
      expect(components['/_curve1'].stateValues.fs[1](3)).eq(3 * 243);
    })

  });

  it.skip('x, y = a parameterization in terms of t', () => {
    cy.window().then(async (win) => {
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


    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let parametrizedCurve = components[components['/_curve1'].stateValues.curveChild];
      // expect(components['/_curve1'].stateValues.curveType).eq("parameterization");
      expect(components['/_curve1'].stateValues.variables[0].tree).eq("x");
      expect(components['/_curve1'].stateValues.variables[1].tree).eq("y");
      expect(components['/_curve1'].stateValues.parameter.tree).eq("t");
      expect(components['/_curve1'].stateValues.parMin).eq(-10);
      expect(components['/_curve1'].stateValues.parMax).eq(10);
      expect(parametrizedCurve.stateValues.variables[0].tree).eq("x");
      expect(parametrizedCurve.stateValues.variables[1].tree).eq("y");
      expect(parametrizedCurve.stateValues.parameter.tree).eq("t");
      expect(parametrizedCurve.stateValues.parMin).eq(-10);
      expect(parametrizedCurve.stateValues.parMax).eq(10);
      expect(parametrizedCurve.stateValues.fs[0](-2)).eq(-5 * 8);
      expect(parametrizedCurve.stateValues.fs[0](3)).eq(5 * 27);
      expect(parametrizedCurve.stateValues.fs[1](-2)).eq(-3 * 32);
      expect(parametrizedCurve.stateValues.fs[1](3)).eq(3 * 243);
    })

  });

  it.skip('x, y = a parameterization in terms of t, swapped variables', () => {
    cy.window().then(async (win) => {
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


    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let parametrizedCurve = components[components['/_curve1'].stateValues.curveChild];
      // expect(components['/_curve1'].stateValues.curveType).eq("parameterization");
      expect(components['/_curve1'].stateValues.variables[0].tree).eq("y");
      expect(components['/_curve1'].stateValues.variables[1].tree).eq("x");
      expect(components['/_curve1'].stateValues.parameter.tree).eq("t");
      expect(components['/_curve1'].stateValues.parMin).eq(-10);
      expect(components['/_curve1'].stateValues.parMax).eq(10);
      expect(parametrizedCurve.stateValues.variables[0].tree).eq("y");
      expect(parametrizedCurve.stateValues.variables[1].tree).eq("x");
      expect(parametrizedCurve.stateValues.parameter.tree).eq("t");
      expect(parametrizedCurve.stateValues.parMin).eq(-10);
      expect(parametrizedCurve.stateValues.parMax).eq(10);
      expect(parametrizedCurve.stateValues.fs[1](-2)).eq(-5 * 8);
      expect(parametrizedCurve.stateValues.fs[1](3)).eq(5 * 27);
      expect(parametrizedCurve.stateValues.fs[0](-2)).eq(-3 * 32);
      expect(parametrizedCurve.stateValues.fs[0](3)).eq(3 * 243);
    })

  });

  it.skip('u, v = a parameterization in terms of s', () => {
    cy.window().then(async (win) => {
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

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let parametrizedCurve = components[components['/_curve1'].stateValues.curveChild];
      // expect(components['/_curve1'].stateValues.curveType).eq("parameterization");
      expect(components['/_curve1'].stateValues.variables[0].tree).eq("u");
      expect(components['/_curve1'].stateValues.variables[1].tree).eq("v");
      expect(components['/_curve1'].stateValues.parameter.tree).eq("s");
      expect(components['/_curve1'].stateValues.parMin).eq(-10);
      expect(components['/_curve1'].stateValues.parMax).eq(10);
      expect(parametrizedCurve.stateValues.variables[0].tree).eq("u");
      expect(parametrizedCurve.stateValues.variables[1].tree).eq("v");
      expect(parametrizedCurve.stateValues.parameter.tree).eq("s");
      expect(parametrizedCurve.stateValues.parMin).eq(-10);
      expect(parametrizedCurve.stateValues.parMax).eq(10);
      expect(parametrizedCurve.stateValues.fs[0](-2)).eq(-5 * 8);
      expect(parametrizedCurve.stateValues.fs[0](3)).eq(5 * 27);
      expect(parametrizedCurve.stateValues.fs[1](-2)).eq(-3 * 32);
      expect(parametrizedCurve.stateValues.fs[1](3)).eq(3 * 243);
    })

  });

  it.skip('x, y = a parameterization in terms of t, vector form', () => {
    cy.window().then(async (win) => {
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

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let parametrizedCurve = components[components['/_curve1'].stateValues.curveChild];
      // expect(components['/_curve1'].stateValues.curveType).eq("parameterization");
      expect(components['/_curve1'].stateValues.variables[0].tree).eq("x");
      expect(components['/_curve1'].stateValues.variables[1].tree).eq("y");
      expect(components['/_curve1'].stateValues.parameter.tree).eq("t");
      expect(components['/_curve1'].stateValues.parMin).eq(-10);
      expect(components['/_curve1'].stateValues.parMax).eq(10);
      expect(parametrizedCurve.stateValues.variables[0].tree).eq("x");
      expect(parametrizedCurve.stateValues.variables[1].tree).eq("y");
      expect(parametrizedCurve.stateValues.parameter.tree).eq("t");
      expect(parametrizedCurve.stateValues.parMin).eq(-10);
      expect(parametrizedCurve.stateValues.parMax).eq(10);
      expect(parametrizedCurve.stateValues.fs[0](-2)).eq(-5 * 8);
      expect(parametrizedCurve.stateValues.fs[0](3)).eq(5 * 27);
      expect(parametrizedCurve.stateValues.fs[1](-2)).eq(-3 * 32);
      expect(parametrizedCurve.stateValues.fs[1](3)).eq(3 * 243);
    })

  });

  it.skip('x, y = a parameterization in terms of t, vector form, switched', () => {
    cy.window().then(async (win) => {
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

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let parametrizedCurve = components[components['/_curve1'].stateValues.curveChild];
      // expect(components['/_curve1'].stateValues.curveType).eq("parameterization");
      expect(components['/_curve1'].stateValues.variables[0].tree).eq("x");
      expect(components['/_curve1'].stateValues.variables[1].tree).eq("y");
      expect(components['/_curve1'].stateValues.parameter.tree).eq("t");
      expect(components['/_curve1'].stateValues.parMin).eq(-10);
      expect(components['/_curve1'].stateValues.parMax).eq(10);
      expect(parametrizedCurve.stateValues.variables[0].tree).eq("x");
      expect(parametrizedCurve.stateValues.variables[1].tree).eq("y");
      expect(parametrizedCurve.stateValues.parameter.tree).eq("t");
      expect(parametrizedCurve.stateValues.parMin).eq(-10);
      expect(parametrizedCurve.stateValues.parMax).eq(10);
      expect(parametrizedCurve.stateValues.fs[0](-2)).eq(-5 * 8);
      expect(parametrizedCurve.stateValues.fs[0](3)).eq(5 * 27);
      expect(parametrizedCurve.stateValues.fs[1](-2)).eq(-3 * 32);
      expect(parametrizedCurve.stateValues.fs[1](3)).eq(3 * 243);
    })

  });

  it.skip('x, y = a parameterization in terms of t, change par limits', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve parMin="-1" parMax="0.5">
    x = 5t^3, 3t^5 = y
    </curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let parametrizedCurve = components[components['/_curve1'].stateValues.curveChild];
      // expect(components['/_curve1'].stateValues.curveType).eq("parameterization");
      expect(components['/_curve1'].stateValues.variables[0].tree).eq("x");
      expect(components['/_curve1'].stateValues.variables[1].tree).eq("y");
      expect(components['/_curve1'].stateValues.parameter.tree).eq("t");
      expect(components['/_curve1'].stateValues.parMin.simplify().tree).eq(-1);
      expect(components['/_curve1'].stateValues.parMax).eq(0.5);
      expect(parametrizedCurve.stateValues.variables[0].tree).eq("x");
      expect(parametrizedCurve.stateValues.variables[1].tree).eq("y");
      expect(parametrizedCurve.stateValues.parameter.tree).eq("t");
      expect(parametrizedCurve.stateValues.parMin.simplify().tree).eq(-1);
      expect(parametrizedCurve.stateValues.parMax).eq(0.5);
      expect(parametrizedCurve.stateValues.fs[0](-2)).eq(-5 * 8);
      expect(parametrizedCurve.stateValues.fs[0](3)).eq(5 * 27);
      expect(parametrizedCurve.stateValues.fs[1](-2)).eq(-3 * 32);
      expect(parametrizedCurve.stateValues.fs[1](3)).eq(3 * 243);
    })

  });

  it('a parameterization, no sugar', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve>
    <function variables="q">5q^3</function>
    <function variables="u">3u^5</function>
    </curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].stateValues.curveType).eq("parameterization");
      expect(components['/_curve1'].stateValues.parMin).eq(-10);
      expect(components['/_curve1'].stateValues.parMax).eq(10);
      expect(components['/_curve1'].stateValues.fs[0](-2)).eq(-5 * 8);
      expect(components['/_curve1'].stateValues.fs[0](3)).eq(5 * 27);
      expect(components['/_curve1'].stateValues.fs[1](-2)).eq(-3 * 32);
      expect(components['/_curve1'].stateValues.fs[1](3)).eq(3 * 243);
    })

  });

  it('a parameterization, change par limits', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve parMin="-1" parMax="0.5">
      <function variables="t">5t^3</function>
      <function variables="t">3t^5</function>
    </curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].stateValues.curveType).eq("parameterization");
      expect(components['/_curve1'].stateValues.parMin).eq(-1);
      expect(components['/_curve1'].stateValues.parMax).eq(0.5);
      expect(components['/_curve1'].stateValues.fs[0](-2)).eq(-5 * 8);
      expect(components['/_curve1'].stateValues.fs[0](3)).eq(5 * 27);
      expect(components['/_curve1'].stateValues.fs[1](-2)).eq(-3 * 32);
      expect(components['/_curve1'].stateValues.fs[1](3)).eq(3 * 243);
    })

  });


  it.skip('a parameterization with parens', () => {
    cy.window().then(async (win) => {
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

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let parametrizedCurve = components[components['/_curve1'].stateValues.curveChild];
      // expect(components['/_curve1'].stateValues.curveType).eq("parameterization");
      expect(components['/_curve1'].stateValues.variables[0].tree).eq("x");
      expect(components['/_curve1'].stateValues.variables[1].tree).eq("y");
      expect(components['/_curve1'].stateValues.parameter.tree).eq("t");
      expect(components['/_curve1'].stateValues.parMin).eq(-10);
      expect(components['/_curve1'].stateValues.parMax).eq(10);
      expect(parametrizedCurve.stateValues.variables[0].tree).eq("x");
      expect(parametrizedCurve.stateValues.variables[1].tree).eq("y");
      expect(parametrizedCurve.stateValues.parameter.tree).eq("t");
      expect(parametrizedCurve.stateValues.parMin).eq(-10);
      expect(parametrizedCurve.stateValues.parMax).eq(10);
      expect(parametrizedCurve.stateValues.fs[0](-2)).eq(4 * 5);
      expect(parametrizedCurve.stateValues.fs[0](3)).eq(0);
      expect(parametrizedCurve.stateValues.fs[1](-2)).eq(0);
      expect(parametrizedCurve.stateValues.fs[1](3)).eq(5 * 6);
    })

  });

  it('a parameterization with copy', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput prefill="2"/>
    <graph>
    <curve>
    <function variables="t">t$_mathinput1+1</function>
    <function variables="t">t^3-$_mathinput1</function>
    </curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/_curve1"].stateValues.parMin).eq(-10);
      expect(components["/_curve1"].stateValues.parMax).eq(10);
      expect(components["/_curve1"].stateValues.fs[0](-2)).eq(-4 + 1);
      expect(components["/_curve1"].stateValues.fs[0](3)).eq(6 + 1);
      expect(components["/_curve1"].stateValues.fs[1](-2)).eq(-8 - 2);
      expect(components["/_curve1"].stateValues.fs[1](3)).eq(27 - 2);
    })

    cy.get("#\\/_mathinput1 textarea").type("{end}{backspace}-3{enter}", { force: true });
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/_curve1"].stateValues.parMin).eq(-10);
      expect(components["/_curve1"].stateValues.parMax).eq(10);
      expect(components["/_curve1"].stateValues.fs[0](-2)).eq(6 + 1);
      expect(components["/_curve1"].stateValues.fs[0](3)).eq(-9 + 1);
      expect(components["/_curve1"].stateValues.fs[1](-2)).eq(-8 + 3);
      expect(components["/_curve1"].stateValues.fs[1](3)).eq(27 + 3);
    })
  });

  it('constrain to parametrize curve', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput prefill="-2"/>
    <mathinput prefill="2"/>
    <graph>
    <curve parMin="$_mathinput1" parMax="$_mathinput2">
    <function variables="s">s^3</function>
    <function variables="s">sin(2s)</function>
    </curve>
    
    <point x='7' y='1'>
      <constraints>
        <constrainTo><copy tname="_curve1" /></constrainTo>
      </constraints>
    </point>
    
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x = components['/_point1'].stateValues.xs[0].tree;
      let y = components['/_point1'].stateValues.xs[1].tree;
      expect(x).closeTo(7, 0.5);
      expect(y).closeTo(Math.sin(2 * Math.pow(x, 1 / 3)), 1E-5);
    })

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point1'].movePoint({ x: -2, y: 10 })
      let x = components['/_point1'].stateValues.xs[0].tree;
      let y = components['/_point1'].stateValues.xs[1].tree;
      expect(x).closeTo(0.3, 0.1);
      expect(y).closeTo(Math.sin(2 * Math.pow(x, 1 / 3)), 1E-5);
    })

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point1'].movePoint({ x: -10, y: 2 })
      let x = components['/_point1'].stateValues.xs[0].tree;
      let y = components['/_point1'].stateValues.xs[1].tree;
      expect(x).closeTo(-8, 1E-3);
      expect(y).closeTo(Math.sin(-4), 1E-3);
    })

    cy.get("#\\/_mathinput1 textarea").type("{end}{backspace}{backspace}-1{enter}", { force: true })
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x = components['/_point1'].stateValues.xs[0].tree;
      let y = components['/_point1'].stateValues.xs[1].tree;
      expect(x).closeTo(-1, 1E-3);
      expect(y).closeTo(Math.sin(-2), 1E-3);
    })

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point1'].movePoint({ x: 10, y: 2 })
      let x = components['/_point1'].stateValues.xs[0].tree;
      let y = components['/_point1'].stateValues.xs[1].tree;
      expect(x).closeTo(8, 1E-3);
      expect(y).closeTo(Math.sin(4), 1E-3);
    })

    cy.get("#\\/_mathinput2 textarea").type("{end}{backspace}1{enter}", { force: true })
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x = components['/_point1'].stateValues.xs[0].tree;
      let y = components['/_point1'].stateValues.xs[1].tree;
      expect(x).closeTo(1, 1E-3);
      expect(y).closeTo(Math.sin(2), 1E-3);
    })

  });

  it('constrain to parametrize curve, different scales from graph', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <setup>
      <function variables="t" name="f">100 cos(t)</function>
      <function variables="t" name="g">0.1 sin(t)</function>
    </setup>

    <graph xmin="-110" xmax="110" ymin="-0.11" ymax="0.11">
      <curve name="c">
        <copy tname="f" />
        <copy tname="g" />
      </curve>
      <point x="1" y="0.001" name="P">
        <constraints>
          <constrainTo><copy tname="c" /></constrainTo>
        </constraints>
      </point>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x = components['/P'].stateValues.xs[0].tree;
      let y = components['/P'].stateValues.xs[1].tree;
      expect(x).closeTo(100 / Math.sqrt(2), 1E-4);
      expect(y).closeTo(0.1 / Math.sqrt(2), 1E-4);
    })

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/P'].movePoint({ x: -200, y: 0.8 })
      let x = components['/P'].stateValues.xs[0].tree;
      let y = components['/P'].stateValues.xs[1].tree;
      expect(x).closeTo(-100 / Math.sqrt(17), 1E-4);
      expect(y).closeTo(0.1 * 4 / Math.sqrt(17), 1E-4);
    })

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/P'].movePoint({ x: -2, y: -0.001 })
      let x = components['/P'].stateValues.xs[0].tree;
      let y = components['/P'].stateValues.xs[1].tree;
      expect(x).closeTo(-100 * 2 / Math.sqrt(5), 1E-4);
      expect(y).closeTo(-0.1 / Math.sqrt(5), 1E-4);
    })

  });

});
