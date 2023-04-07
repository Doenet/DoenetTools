import { createFunctionFromDefinition } from "../../../../src/Core/utils/function";

describe('Function curve Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/src/Tools/cypressTest/')
  })

  it('a function of x', () => {
    cy.window().then(async (win) => {
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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_curve1'].stateValues.curveType).eq("function");
      expect(stateVariables['/_curve1'].stateValues.flipFunction).eq(false);

      let f = createFunctionFromDefinition(stateVariables['/_curve1'].stateValues.fDefinitions[0])
      expect(f(-2)).eq(-8 + 2);
      expect(f(3)).eq(27 - 3);
    })

  });

  it('sugar a function of x', () => {
    cy.window().then(async (win) => {
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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_curve1'].stateValues.variableForChild).eq("x");
      expect(stateVariables['/_curve1'].stateValues.flipFunction).eq(false);
      let f = createFunctionFromDefinition(stateVariables['/_curve1'].stateValues.fDefinitions[0])
      expect(f(-2)).eq(-8 + 2);
      expect(f(3)).eq(27 - 3);
    })

  });

  it('sugar a function of x, with strings and macros', () => {
    cy.window().then(async (win) => {
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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_curve1'].stateValues.variableForChild).eq("x");
      expect(stateVariables['/_curve1'].stateValues.flipFunction).eq(false);
      let f = createFunctionFromDefinition(stateVariables['/_curve1'].stateValues.fDefinitions[0])
      expect(f(-2)).eq(-8 + 2);
      expect(f(3)).eq(27 - 3);
    })

  });

  it.skip('x = a function of y', () => {
    cy.window().then(async (win) => {
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


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let functionCurve = stateVariables[stateVariables['/_curve1'].stateValues.curveChild];
      // expect(stateVariables['/_curve1'].stateValues.curveType).eq("function");
      expect(stateVariables['/_curve1'].stateValues.variables[0]).eq("x");
      expect(stateVariables['/_curve1'].stateValues.variables[1]).eq("y");
      expect(functionCurve.stateValues.flipFunction).eq(true);
      expect(functionCurve.stateValues.variables[0]).eq("x");
      expect(functionCurve.stateValues.variables[1]).eq("y");
      expect(functionCurve.stateValues.f(-2)).eq(-8 + 2);
      expect(functionCurve.stateValues.f(3)).eq(27 - 3);
    })

  });

  it.skip('x = a function of y, switching variables', () => {
    cy.window().then(async (win) => {
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


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let functionCurve = stateVariables[stateVariables['/_curve1'].stateValues.curveChild];
      // expect(stateVariables['/_curve1'].stateValues.curveType).eq("function");
      expect(stateVariables['/_curve1'].stateValues.variables[0]).eq("y");
      expect(stateVariables['/_curve1'].stateValues.variables[1]).eq("x");
      expect(functionCurve.stateValues.flipFunction).eq(false);
      expect(functionCurve.stateValues.variables[0]).eq("y");
      expect(functionCurve.stateValues.variables[1]).eq("x");
      expect(functionCurve.stateValues.f(-2)).eq(-8 + 2);
      expect(functionCurve.stateValues.f(3)).eq(27 - 3);
    })

  });

  it.skip('q = a function of p', () => {
    cy.window().then(async (win) => {
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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let functionCurve = stateVariables[stateVariables['/_curve1'].stateValues.curveChild];
      // expect(stateVariables['/_curve1'].stateValues.curveType).eq("function");
      expect(stateVariables['/_curve1'].stateValues.variables[0]).eq("p");
      expect(stateVariables['/_curve1'].stateValues.variables[1]).eq("q");
      expect(functionCurve.stateValues.flipFunction).eq(false);
      expect(functionCurve.stateValues.variables[0]).eq("p");
      expect(functionCurve.stateValues.variables[1]).eq("q");
      expect(functionCurve.stateValues.f(-2)).eq(-8 + 2);
      expect(functionCurve.stateValues.f(3)).eq(27 - 3);
    })

  });

  it.skip('q = a function of p, switching variables', () => {
    cy.window().then(async (win) => {
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


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let functionCurve = stateVariables[stateVariables['/_curve1'].stateValues.curveChild];
      // expect(stateVariables['/_curve1'].stateValues.curveType).eq("function");
      expect(stateVariables['/_curve1'].stateValues.variables[0]).eq("q");
      expect(stateVariables['/_curve1'].stateValues.variables[1]).eq("p");
      expect(functionCurve.stateValues.flipFunction).eq(true);
      expect(functionCurve.stateValues.variables[0]).eq("q");
      expect(functionCurve.stateValues.variables[1]).eq("p");
      expect(functionCurve.stateValues.f(-2)).eq(-8 + 2);
      expect(functionCurve.stateValues.f(3)).eq(27 - 3);
    })

  });

  it('sugar a function of r', () => {
    cy.window().then(async (win) => {
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


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_curve1'].stateValues.curveType).eq("function");
      expect(stateVariables['/_curve1'].stateValues.variableForChild).eq("r");
      expect(stateVariables['/_curve1'].stateValues.flipFunction).eq(false);
      let f = createFunctionFromDefinition(stateVariables['/_curve1'].stateValues.fDefinitions[0])
      expect(f(-2)).eq(-8 + 2);
      expect(f(3)).eq(27 - 3);
    })

  });

  it('sugar a function of r, with strings and macro', () => {
    cy.window().then(async (win) => {
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


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_curve1'].stateValues.curveType).eq("function");
      expect(stateVariables['/_curve1'].stateValues.variableForChild).eq("r");
      expect(stateVariables['/_curve1'].stateValues.flipFunction).eq(false);
      let f = createFunctionFromDefinition(stateVariables['/_curve1'].stateValues.fDefinitions[0])
      expect(f(-2)).eq(-8 + 2);
      expect(f(3)).eq(27 - 3);
    })

  });

  it('a function of a', () => {
    cy.window().then(async (win) => {
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


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_curve1'].stateValues.curveType).eq("function");
      expect(stateVariables['/_curve1'].stateValues.flipFunction).eq(false);
      let f = createFunctionFromDefinition(stateVariables['/_curve1'].stateValues.fDefinitions[0])
      expect(f(-2)).eq(-8 + 2);
      expect(f(3)).eq(27 - 3);
    })

  });

  it('a function with copy', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput prefill="1" name="a" />
    <graph>
    <curve><function>x^3-x$a</function></curve>
    </graph>
    <p><copy prop="value" target="a" assignNames="a2" /></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load

    cy.get('#\\/a2 .mjx-mrow').should("contain.text", "1")

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_curve1'].stateValues.curveType).eq("function");
      expect(stateVariables['/_curve1'].stateValues.flipFunction).eq(false);
      let f = createFunctionFromDefinition(stateVariables['/_curve1'].stateValues.fDefinitions[0])
      expect(f(-2)).eq(-8 + 2);
      expect(f(3)).eq(27 - 3);
    })

    cy.get("#\\/a textarea").type("{end}{backspace}-2{enter}", { force: true, delay: 100 });
    cy.get('#\\/a2 .mjx-mrow').should("contain.text", "−2")
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_curve1'].stateValues.curveType).eq("function");
      expect(stateVariables['/_curve1'].stateValues.flipFunction).eq(false);
      let f = createFunctionFromDefinition(stateVariables['/_curve1'].stateValues.fDefinitions[0])
      expect(f(-2)).eq(-8 + 2 * (-2));
      expect(f(3)).eq(27 - 3 * (-2));
    })

  });

  it('a function manually flipped', () => {
    cy.window().then(async (win) => {
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


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_curve1'].stateValues.flipFunction).eq(true);
      let f = createFunctionFromDefinition(stateVariables['/_curve1'].stateValues.fDefinitions[0])
      expect(f(-2)).eq(-8 + 2);
      expect(f(3)).eq(27 - 3);
    })

  });

  it('constrain to function', () => {
    cy.window().then(async (win) => {
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
      <constrainTo><copy target="_curve1" /></constrainTo>
    </constraints>
    </point>
    
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_curve1'].stateValues.flipFunction).eq(false);
      let x = stateVariables['/_point1'].stateValues.xs[0];
      let y = stateVariables['/_point1'].stateValues.xs[1];
      expect(x).eq(3);
      expect(y).closeTo(x * x * x * x - 5 * x * x, 1E-5);
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 1.5, y: -1.5 }
      })
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables['/_point1'].stateValues.xs[0];
      let y = stateVariables['/_point1'].stateValues.xs[1];
      expect(x).eq(1.5);
      expect(y).closeTo(x * x * x * x - 5 * x * x, 1E-5);
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 0.1, y: -10 }
      })
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables['/_point1'].stateValues.xs[0];
      let y = stateVariables['/_point1'].stateValues.xs[1];
      expect(x).eq(0.1);
      expect(y).closeTo(x * x * x * x - 5 * x * x, 1E-5);
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -0.1, y: -10 }
      })
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables['/_point1'].stateValues.xs[0];
      let y = stateVariables['/_point1'].stateValues.xs[1];
      expect(x).eq(-0.1);
      expect(y).closeTo(x * x * x * x - 5 * x * x, 1E-5);
    })

  });

  it('constrain to function 2', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function name="f" variables="u">
      u^4-5u^2
    </function>
    
    <point x='3' y='5'>
    <constraints>
      <constrainTo>$f</constrainTo>
    </constraints>
    </point>
    
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables['/_point1'].stateValues.xs[0];
      let y = stateVariables['/_point1'].stateValues.xs[1];
      expect(x).eq(3);
      expect(y).closeTo(x * x * x * x - 5 * x * x, 1E-5);
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 1.5, y: -1.5 }
      })
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables['/_point1'].stateValues.xs[0];
      let y = stateVariables['/_point1'].stateValues.xs[1];
      expect(x).eq(1.5);
      expect(y).closeTo(x * x * x * x - 5 * x * x, 1E-5);
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 0.1, y: -10 }
      })
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables['/_point1'].stateValues.xs[0];
      let y = stateVariables['/_point1'].stateValues.xs[1];
      expect(x).eq(0.1);
      expect(y).closeTo(x * x * x * x - 5 * x * x, 1E-5);
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -0.1, y: -10 }
      })
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables['/_point1'].stateValues.xs[0];
      let y = stateVariables['/_point1'].stateValues.xs[1];
      expect(x).eq(-0.1);
      expect(y).closeTo(x * x * x * x - 5 * x * x, 1E-5);
    })

  });

  it('constrain to function, nearest point as curve', () => {
    cy.window().then(async (win) => {
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
      <constrainTo><copy target="_curve1" /></constrainTo>
    </constraints>
    </point>
    
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_curve1'].stateValues.flipFunction).eq(false);
      let x = stateVariables['/_point1'].stateValues.xs[0];
      let y = stateVariables['/_point1'].stateValues.xs[1];
      expect(y).closeTo(5, 0.1);
      expect(x).greaterThan(2);
      expect(y).closeTo(x * x * x * x - 5 * x * x, 1E-5);
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 1.5, y: -1.5 }
      })
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables['/_point1'].stateValues.xs[0];
      let y = stateVariables['/_point1'].stateValues.xs[1];
      expect(y).closeTo(-1.5, 0.1);
      expect(x).greaterThan(1.5);
      expect(y).closeTo(x * x * x * x - 5 * x * x, 1E-5);
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 0.1, y: -10 }
      })
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables['/_point1'].stateValues.xs[0];
      let y = stateVariables['/_point1'].stateValues.xs[1];
      let minimum2 = (stateVariables["/_function1"].stateValues.minima)[1];

      expect(x).closeTo(minimum2[0], 0.1);
      expect(y).closeTo(minimum2[1], 0.1);
      expect(y).closeTo(x * x * x * x - 5 * x * x, 1E-5);
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -0.1, y: -10 }
      })
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables['/_point1'].stateValues.xs[0];
      let y = stateVariables['/_point1'].stateValues.xs[1];
      let minimum1 = stateVariables["/_function1"].stateValues.minima[0];

      expect(x).closeTo(minimum1[0], 0.1);
      expect(y).closeTo(minimum1[1], 0.1);
      expect(y).closeTo(x * x * x * x - 5 * x * x, 1E-5);
    })


    // try a bunch of points at right to make sure stay on right branch
    // which fails with nDiscretizationPoints too low (e.g., at 100) 
    for (let v = -5; v <= -1; v += 0.1) {
      cy.window().then(async (win) => {
        await win.callAction1({
          actionName: "movePoint",
          componentName: "/_point1",
          args: { x: 5, y: v }
        })
        let stateVariables = await win.returnAllStateVariables1();
        let x = stateVariables['/_point1'].stateValues.xs[0];
        let y = stateVariables['/_point1'].stateValues.xs[1];
        expect(x).greaterThan(1.7)
        expect(y).greaterThan(v);
        expect(y).lessThan(v + 0.5)
        expect(y).closeTo(x * x * x * x - 5 * x * x, 1E-5);
      })
    }
  });

  it('constrain to function, nearest point as curve 2', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function name="f" variables="u" nearestPointAsCurve>
      u^4-5u^2
    </function>
    
    <point x='3' y='5'>
    <constraints>
      <constrainTo>$f</constrainTo>
    </constraints>
    </point>
    
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables['/_point1'].stateValues.xs[0];
      let y = stateVariables['/_point1'].stateValues.xs[1];
      expect(y).closeTo(5, 0.1);
      expect(x).greaterThan(2);
      expect(y).closeTo(x * x * x * x - 5 * x * x, 1E-5);
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 1.5, y: -1.5 }
      })
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables['/_point1'].stateValues.xs[0];
      let y = stateVariables['/_point1'].stateValues.xs[1];
      expect(y).closeTo(-1.5, 0.1);
      expect(x).greaterThan(1.5);
      expect(y).closeTo(x * x * x * x - 5 * x * x, 1E-5);
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 0.1, y: -10 }
      })
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables['/_point1'].stateValues.xs[0];
      let y = stateVariables['/_point1'].stateValues.xs[1];
      let minimum2 = (stateVariables["/f"].stateValues.minima)[1];

      expect(x).closeTo(minimum2[0], 0.1);
      expect(y).closeTo(minimum2[1], 0.1);
      expect(y).closeTo(x * x * x * x - 5 * x * x, 1E-5);
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -0.1, y: -10 }
      })
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables['/_point1'].stateValues.xs[0];
      let y = stateVariables['/_point1'].stateValues.xs[1];
      let minimum1 = stateVariables["/f"].stateValues.minima[0];

      expect(x).closeTo(minimum1[0], 0.1);
      expect(y).closeTo(minimum1[1], 0.1);
      expect(y).closeTo(x * x * x * x - 5 * x * x, 1E-5);
    })


    // try a bunch of points at right to make sure stay on right branch
    // which fails with nDiscretizationPoints too low (e.g., at 100) 
    for (let v = -5; v <= -1; v += 0.1) {
      cy.window().then(async (win) => {
        await win.callAction1({
          actionName: "movePoint",
          componentName: "/_point1",
          args: { x: 5, y: v }
        })
        let stateVariables = await win.returnAllStateVariables1();
        let x = stateVariables['/_point1'].stateValues.xs[0];
        let y = stateVariables['/_point1'].stateValues.xs[1];
        expect(x).greaterThan(1.7)
        expect(y).greaterThan(v);
        expect(y).lessThan(v + 0.5)
        expect(y).closeTo(x * x * x * x - 5 * x * x, 1E-5);
      })
    }
  });

  it('constrain to function, nearest point as curve 3', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve>
      <function variables="u" nearestPointAsCurve>
        u^4-5u^2
      </function>
    </curve>
    
    <point x='3' y='5'>
    <constraints>
      <constrainTo><copy target="_curve1" /></constrainTo>
    </constraints>
    </point>
    
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_curve1'].stateValues.flipFunction).eq(false);
      let x = stateVariables['/_point1'].stateValues.xs[0];
      let y = stateVariables['/_point1'].stateValues.xs[1];
      expect(y).closeTo(5, 0.1);
      expect(x).greaterThan(2);
      expect(y).closeTo(x * x * x * x - 5 * x * x, 1E-5);
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 1.5, y: -1.5 }
      })
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables['/_point1'].stateValues.xs[0];
      let y = stateVariables['/_point1'].stateValues.xs[1];
      expect(y).closeTo(-1.5, 0.1);
      expect(x).greaterThan(1.5);
      expect(y).closeTo(x * x * x * x - 5 * x * x, 1E-5);
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 0.1, y: -10 }
      })
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables['/_point1'].stateValues.xs[0];
      let y = stateVariables['/_point1'].stateValues.xs[1];
      let minimum2 = (stateVariables["/_function1"].stateValues.minima)[1];

      expect(x).closeTo(minimum2[0], 0.1);
      expect(y).closeTo(minimum2[1], 0.1);
      expect(y).closeTo(x * x * x * x - 5 * x * x, 1E-5);
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -0.1, y: -10 }
      })
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables['/_point1'].stateValues.xs[0];
      let y = stateVariables['/_point1'].stateValues.xs[1];
      let minimum1 = stateVariables["/_function1"].stateValues.minima[0];

      expect(x).closeTo(minimum1[0], 0.1);
      expect(y).closeTo(minimum1[1], 0.1);
      expect(y).closeTo(x * x * x * x - 5 * x * x, 1E-5);
    })


    // try a bunch of points at right to make sure stay on right branch
    // which fails with nDiscretizationPoints too low (e.g., at 100) 
    for (let v = -5; v <= -1; v += 0.1) {
      cy.window().then(async (win) => {
        await win.callAction1({
          actionName: "movePoint",
          componentName: "/_point1",
          args: { x: 5, y: v }
        })
        let stateVariables = await win.returnAllStateVariables1();
        let x = stateVariables['/_point1'].stateValues.xs[0];
        let y = stateVariables['/_point1'].stateValues.xs[1];
        expect(x).greaterThan(1.7)
        expect(y).greaterThan(v);
        expect(y).lessThan(v + 0.5)
        expect(y).closeTo(x * x * x * x - 5 * x * x, 1E-5);
      })
    }
  });

  it('constrain to function, different scales from graph', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph ymax="120" ymin="-45" xmin="-1" xmax="5.5">
      <curve name="c">
        <function name='g' variables='t' domain="[0,5]">(60 t - 106 t^2 + 59*t^3 - 13 t^4 + t^5)4</function>
      </curve>
      <point x="1.5" y="2" name="A">
        <constraints baseOnGraph="_graph1">
          <constrainTo>$c</constrainTo>
        </constraints>
      </point>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    let f = t => (60 * t - 106 * t ** 2 + 59 * t ** 3 - 13 * t ** 4 + t ** 5) * 4;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables['/A'].stateValues.xs[0];
      let y = stateVariables['/A'].stateValues.xs[1];
      expect(x).closeTo(1.5, 1E-10);
      expect(y).closeTo(f(1.5), 1E-10);
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 5, y: -60 }
      })
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables['/A'].stateValues.xs[0];
      let y = stateVariables['/A'].stateValues.xs[1];
      expect(x).closeTo(5, 1E-10);
      expect(y).closeTo(f(5), 1E-10);
    })

  });

  it('constrain to function, different scales from graph 2 ', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph xmax="120" xmin="-45" ymin="-1" ymax="5.5">
      <curve name="c">
        <function name='g' variables='t' domain="[-20,100]">sin(t/10)+t/50+2</function>
      </curve>
      <point x="1.5" y="2" name="A">
        <constraints baseOnGraph="_graph1">
          <constrainTo>$c</constrainTo>
        </constraints>
      </point>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    let f = t => Math.sin(t / 10) + t / 50 + 2;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables['/A'].stateValues.xs[0];
      let y = stateVariables['/A'].stateValues.xs[1];
      expect(x).closeTo(1.5, 1E-10);
      expect(y).closeTo(f(1.5), 1E-10);
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 90, y: 5 }
      })
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables['/A'].stateValues.xs[0];
      let y = stateVariables['/A'].stateValues.xs[1];
      expect(x).closeTo(90, 1E-10);
      expect(y).closeTo(f(90), 1E-10);
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 120, y: -5 }
      })
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables['/A'].stateValues.xs[0];
      let y = stateVariables['/A'].stateValues.xs[1];
      expect(x).closeTo(100, 1E-10);
      expect(y).closeTo(f(100), 1E-10);
    })


    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -10, y: 10 }
      })
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables['/A'].stateValues.xs[0];
      let y = stateVariables['/A'].stateValues.xs[1];
      expect(x).closeTo(-10, 1E-10);
      expect(y).closeTo(f(-10), 1E-10);
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -50, y: -100 }
      })
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables['/A'].stateValues.xs[0];
      let y = stateVariables['/A'].stateValues.xs[1];
      expect(x).closeTo(-20, 1E-10);
      expect(y).closeTo(f(-20), 1E-10);
    })


  });

  it('constrain to inverse function', () => {
    cy.window().then(async (win) => {
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
      <constrainTo><copy target="_curve1" /></constrainTo>
    </constraints>
    </point>
    
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_curve1'].stateValues.flipFunction).eq(true);
      let x = stateVariables['/_point1'].stateValues.xs[0];
      let y = stateVariables['/_point1'].stateValues.xs[1];
      expect(y).eq(3);
      expect(x).closeTo(y * y * y * y - 5 * y * y, 1E-5);
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { y: 1.5, x: -1.5 }
      })
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables['/_point1'].stateValues.xs[0];
      let y = stateVariables['/_point1'].stateValues.xs[1];
      expect(y).eq(1.5);
      expect(x).closeTo(y * y * y * y - 5 * y * y, 1E-5);
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { y: 0.1, x: -10 }
      })
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables['/_point1'].stateValues.xs[0];
      let y = stateVariables['/_point1'].stateValues.xs[1];
      expect(y).eq(0.1);
      expect(x).closeTo(y * y * y * y - 5 * y * y, 1E-5);
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { y: -0.1, x: -10 }
      })
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables['/_point1'].stateValues.xs[0];
      let y = stateVariables['/_point1'].stateValues.xs[1];
      expect(y).eq(-0.1);
      expect(x).closeTo(y * y * y * y - 5 * y * y, 1E-5);
    })

  });

  it('constrain to inverse function, nearest point as curve', () => {
    cy.window().then(async (win) => {
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
      <constrainTo><copy target="_curve1" /></constrainTo>
    </constraints>
    </point>
    
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_curve1'].stateValues.flipFunction).eq(true);
      let x = stateVariables['/_point1'].stateValues.xs[0];
      let y = stateVariables['/_point1'].stateValues.xs[1];
      expect(x).closeTo(5, 0.1);
      expect(y).greaterThan(2);
      expect(x).closeTo(y * y * y * y - 5 * y * y, 1E-5);
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -1.5, y: 1.5 }
      })
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables['/_point1'].stateValues.xs[0];
      let y = stateVariables['/_point1'].stateValues.xs[1];
      expect(x).closeTo(-1.5, 0.1);
      expect(y).greaterThan(1.5);
      expect(x).closeTo(y * y * y * y - 5 * y * y, 1E-5);
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -10, y: 0.1 }
      })
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables['/_point1'].stateValues.xs[0];
      let y = stateVariables['/_point1'].stateValues.xs[1];
      let minimum2 = (stateVariables["/_function1"].stateValues.minima)[1];

      expect(y).closeTo(minimum2[0], 0.1);
      expect(x).closeTo(minimum2[1], 0.1);
      expect(x).closeTo(y * y * y * y - 5 * y * y, 1E-5);
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -10, y: -0.1 }
      })
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables['/_point1'].stateValues.xs[0];
      let y = stateVariables['/_point1'].stateValues.xs[1];
      let minimum1 = stateVariables["/_function1"].stateValues.minima[0];

      expect(y).closeTo(minimum1[0], 0.1);
      expect(x).closeTo(minimum1[1], 0.1);
      expect(x).closeTo(y * y * y * y - 5 * y * y, 1E-5);
    })


    // try a bunch of points at top to make sure stay on top branch
    // which fails with nDiscretizationPoints too low (e.g., at 100) 
    for (let v = -5; v <= -1; v += 0.1) {
      cy.window().then(async (win) => {
        await win.callAction1({
          actionName: "movePoint",
          componentName: "/_point1",
          args: { x: v, y: 5 }
        })
        let stateVariables = await win.returnAllStateVariables1();
        let x = stateVariables['/_point1'].stateValues.xs[0];
        let y = stateVariables['/_point1'].stateValues.xs[1];
        expect(y).greaterThan(1.7)
        expect(x).greaterThan(v);
        expect(x).lessThan(v + 0.5)
        expect(x).closeTo(y * y * y * y - 5 * y * y, 1E-5);
      })
    }
  });

  it('constrain to inverse function, nearest point as curve 2', () => {
    cy.window().then(async (win) => {
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
      <constrainTo><copy target="_curve1"  nearestPointAsCurve/></constrainTo>
    </constraints>
    </point>
    
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_curve1'].stateValues.flipFunction).eq(true);
      let x = stateVariables['/_point1'].stateValues.xs[0];
      let y = stateVariables['/_point1'].stateValues.xs[1];
      expect(x).closeTo(5, 0.1);
      expect(y).greaterThan(2);
      expect(x).closeTo(y * y * y * y - 5 * y * y, 1E-5);
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -1.5, y: 1.5 }
      })
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables['/_point1'].stateValues.xs[0];
      let y = stateVariables['/_point1'].stateValues.xs[1];
      expect(x).closeTo(-1.5, 0.1);
      expect(y).greaterThan(1.5);
      expect(x).closeTo(y * y * y * y - 5 * y * y, 1E-5);
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -10, y: 0.1 }
      })
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables['/_point1'].stateValues.xs[0];
      let y = stateVariables['/_point1'].stateValues.xs[1];
      let minimum2 = (stateVariables["/_function1"].stateValues.minima)[1];

      expect(y).closeTo(minimum2[0], 0.1);
      expect(x).closeTo(minimum2[1], 0.1);
      expect(x).closeTo(y * y * y * y - 5 * y * y, 1E-5);
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -10, y: -0.1 }
      })
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables['/_point1'].stateValues.xs[0];
      let y = stateVariables['/_point1'].stateValues.xs[1];
      let minimum1 = stateVariables["/_function1"].stateValues.minima[0];

      expect(y).closeTo(minimum1[0], 0.1);
      expect(x).closeTo(minimum1[1], 0.1);
      expect(x).closeTo(y * y * y * y - 5 * y * y, 1E-5);
    })


    // try a bunch of points at top to make sure stay on top branch
    // which fails with nDiscretizationPoints too low (e.g., at 100) 
    for (let v = -5; v <= -1; v += 0.1) {
      cy.window().then(async (win) => {
        await win.callAction1({
          actionName: "movePoint",
          componentName: "/_point1",
          args: { x: v, y: 5 }
        })
        let stateVariables = await win.returnAllStateVariables1();
        let x = stateVariables['/_point1'].stateValues.xs[0];
        let y = stateVariables['/_point1'].stateValues.xs[1];
        expect(y).greaterThan(1.7)
        expect(x).greaterThan(v);
        expect(x).lessThan(v + 0.5)
        expect(x).closeTo(y * y * y * y - 5 * y * y, 1E-5);
      })
    }
  });

  it('constrain to inverse function, different scales from graph', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph xmax="120" xmin="-45" ymin="-1" ymax="5.5">
      <curve name="c" flipFunction>
        <function name='g' variables='t' domain="[0,5]">(60 t - 106 t^2 + 59*t^3 - 13 t^4 + t^5)4</function>
      </curve>
      <point y="1.5" x="2" name="A">
        <constraints baseOnGraph="_graph1">
          <constrainTo>$c</constrainTo>
        </constraints>
      </point>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    let f = t => (60 * t - 106 * t ** 2 + 59 * t ** 3 - 13 * t ** 4 + t ** 5) * 4;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables['/A'].stateValues.xs[0];
      let y = stateVariables['/A'].stateValues.xs[1];
      expect(y).closeTo(1.5, 1E-10);
      expect(x).closeTo(f(1.5), 1E-10);
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -60, y: 5 }
      })
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables['/A'].stateValues.xs[0];
      let y = stateVariables['/A'].stateValues.xs[1];
      expect(y).closeTo(5, 1E-10);
      expect(x).closeTo(f(5), 1E-10);
    })

  });

  it('constrain to inverse function, different scales from graph 2 ', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph ymax="120" ymin="-45" xmin="-1" xmax="5.5">
      <curve name="c" flipFunction>
        <function name='g' variables='t' domain="[-20,100]">sin(t/10)+t/50+2</function>
      </curve>
      <point y="1.5" x="2" name="A">
        <constraints baseOnGraph="_graph1">
          <constrainTo>$c</constrainTo>
        </constraints>
      </point>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    let f = t => Math.sin(t / 10) + t / 50 + 2;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables['/A'].stateValues.xs[0];
      let y = stateVariables['/A'].stateValues.xs[1];
      expect(y).closeTo(1.5, 1E-10);
      expect(x).closeTo(f(1.5), 1E-10);
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 5, y: 90 }
      })
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables['/A'].stateValues.xs[0];
      let y = stateVariables['/A'].stateValues.xs[1];
      expect(y).closeTo(90, 1E-10);
      expect(x).closeTo(f(90), 1E-10);
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -5, y: 120 }
      })
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables['/A'].stateValues.xs[0];
      let y = stateVariables['/A'].stateValues.xs[1];
      expect(y).closeTo(100, 1E-10);
      expect(x).closeTo(f(100), 1E-10);
    })


    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 10, y: -10 }
      })
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables['/A'].stateValues.xs[0];
      let y = stateVariables['/A'].stateValues.xs[1];
      expect(y).closeTo(-10, 1E-10);
      expect(x).closeTo(f(-10), 1E-10);
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -100, y: -50 }
      })
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables['/A'].stateValues.xs[0];
      let y = stateVariables['/A'].stateValues.xs[1];
      expect(y).closeTo(-20, 1E-10);
      expect(x).closeTo(f(-20), 1E-10);
    })


  });

  it('function with label as math', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve>
      <function>
        x^3-x
      </function>
      <label>hello <m>x^3-x</m></label>
      </curve>
    </graph>
    `}, "*");
    });

    //to wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_curve1'].stateValues.curveType).eq("function");
      expect(stateVariables['/_curve1'].stateValues.flipFunction).eq(false);
      expect(stateVariables['/_curve1'].stateValues.label).eq('hello \\(x^3-x\\)');

      let f = createFunctionFromDefinition(stateVariables['/_curve1'].stateValues.fDefinitions[0])
      expect(f(-2)).eq(-8 + 2);
      expect(f(3)).eq(27 - 3);
    })

  });

});
