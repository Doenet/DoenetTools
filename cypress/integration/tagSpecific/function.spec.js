describe('Function Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')
  })

  it('function with nothing', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function>
    </function>
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let f = components['/_function1'].stateValues.numericalf;
      expect(f(0)).closeTo(0, 1E-12);
      expect(f(1)).closeTo(0, 1E-12);
      expect(f(2)).closeTo(0, 1E-12);
      expect(f(-1)).closeTo(0, 1E-12);
      expect(f(-2)).closeTo(0, 1E-12);

      f = components['/_function1'].stateValues.f;
      expect(f(0).tree).closeTo(0, 1E-12);
      expect(f(1).tree).closeTo(0, 1E-12);
      expect(f(2).tree).closeTo(0, 1E-12);
      expect(f(-1).tree).closeTo(0, 1E-12);
      expect(f(-2).tree).closeTo(0, 1E-12);

    })

  });

  it('function with single minimum', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function>
    <minimum>2</minimum>
    </function>
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let f = components['/_function1'].stateValues.numericalf;
      expect(f(0)).closeTo(2, 1E-12);
      expect(f(1)).closeTo(2 + 1, 1E-12);
      expect(f(2)).closeTo(2 + 4, 1E-12);
      expect(f(-1)).closeTo(2 + 1, 1E-12);
      expect(f(-2)).closeTo(2 + 4, 1E-12);

    })

  });

  it('function with single minimum, change x-scale', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function xscale="3">
    <minimum>2</minimum>
    </function>
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let f = components['/_function1'].stateValues.numericalf;
      expect(f(0)).closeTo(2, 1E-12);
      expect(f(3)).closeTo(2 + 1, 1E-12);
      expect(f(6)).closeTo(2 + 4, 1E-12);
      expect(f(-3)).closeTo(2 + 1, 1E-12);
      expect(f(-6)).closeTo(2 + 4, 1E-12);

    })

  });

  it('function with single minimum, change x-scale and y-scale', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function xscale="3" yscale="5">
    <minimum>2</minimum>
    </function>
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let f = components['/_function1'].stateValues.numericalf;
      expect(f(0)).closeTo(2, 1E-12);
      expect(f(3)).closeTo(2 + 1 * 5, 1E-12);
      expect(f(6)).closeTo(2 + 4 * 5, 1E-12);
      expect(f(-3)).closeTo(2 + 1 * 5, 1E-12);
      expect(f(-6)).closeTo(2 + 4 * 5, 1E-12);

    })

  });

  it('function with single maximum', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function>
    <maximum>3</maximum>
    </function>
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let f = components['/_function1'].stateValues.numericalf;
      expect(f(0)).closeTo(3, 1E-12);
      expect(f(1)).closeTo(3 - 1, 1E-12);
      expect(f(2)).closeTo(3 - 4, 1E-12);
      expect(f(-1)).closeTo(3 - 1, 1E-12);
      expect(f(-2)).closeTo(3 - 4, 1E-12);

    })

  });

  it('function with single maximum, change x-scale', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function xscale="3">
    <maximum>3</maximum>
    </function>
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let f = components['/_function1'].stateValues.numericalf;
      expect(f(0)).closeTo(3, 1E-12);
      expect(f(3)).closeTo(3 - 1, 1E-12);
      expect(f(6)).closeTo(3 - 4, 1E-12);
      expect(f(-3)).closeTo(3 - 1, 1E-12);
      expect(f(-6)).closeTo(3 - 4, 1E-12);

    })

  });

  it('function with single maximum, change x-scale and y-scale', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function xscale="3" yscale="5">
    <maximum>3</maximum>
    </function>
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let f = components['/_function1'].stateValues.numericalf;
      expect(f(0)).closeTo(3, 1E-12);
      expect(f(3)).closeTo(3 - 1 * 5, 1E-12);
      expect(f(6)).closeTo(3 - 4 * 5, 1E-12);
      expect(f(-3)).closeTo(3 - 1 * 5, 1E-12);
      expect(f(-6)).closeTo(3 - 4 * 5, 1E-12);

    })

  });

  it('function with single minimum, specify x', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function>
    <minimum>x=2</minimum>
    </function>
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let f = components['/_function1'].stateValues.numericalf;
      expect(f(0)).closeTo(4, 1E-12);
      expect(f(1)).closeTo(1, 1E-12);
      expect(f(2)).closeTo(0, 1E-12);
      expect(f(3)).closeTo(1, 1E-12);
      expect(f(4)).closeTo(4, 1E-12);
    })
  });

  it('function with single minimum, specify x and y', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function>
    <minimum>x=2, y=-3</minimum>
    </function>
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let f = components['/_function1'].stateValues.numericalf;
      expect(f(0)).closeTo(4 - 3, 1E-12);
      expect(f(1)).closeTo(1 - 3, 1E-12);
      expect(f(2)).closeTo(0 - 3, 1E-12);
      expect(f(3)).closeTo(1 - 3, 1E-12);
      expect(f(4)).closeTo(4 - 3, 1E-12);
    })
  });

  it('function with single minimum, specify x and y as tuple', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function>
    <minimum>(2, -3)</minimum>
    </function>
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let f = components['/_function1'].stateValues.numericalf;
      expect(f(0)).closeTo(4 - 3, 1E-12);
      expect(f(1)).closeTo(1 - 3, 1E-12);
      expect(f(2)).closeTo(0 - 3, 1E-12);
      expect(f(3)).closeTo(1 - 3, 1E-12);
      expect(f(4)).closeTo(4 - 3, 1E-12);
    })
  });

  it('function with single minimum, specify x and y as list', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function>
    <minimum>2, -3</minimum>
    </function>
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let f = components['/_function1'].stateValues.numericalf;
      expect(f(0)).closeTo(4 - 3, 1E-12);
      expect(f(1)).closeTo(1 - 3, 1E-12);
      expect(f(2)).closeTo(0 - 3, 1E-12);
      expect(f(3)).closeTo(1 - 3, 1E-12);
      expect(f(4)).closeTo(4 - 3, 1E-12);
    })
  });

  it('function with single minimum, specify x and y as vector equation', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function>
    <minimum>(x,y) = (2, -3)</minimum>
    </function>
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let f = components['/_function1'].stateValues.numericalf;
      expect(f(0)).closeTo(4 - 3, 1E-12);
      expect(f(1)).closeTo(1 - 3, 1E-12);
      expect(f(2)).closeTo(0 - 3, 1E-12);
      expect(f(3)).closeTo(1 - 3, 1E-12);
      expect(f(4)).closeTo(4 - 3, 1E-12);
    })
  });

  it('function with single extremum, specify x and y as tuple', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function>
    <extremum>(2, -3)</extremum>
    </function>
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let f = components['/_function1'].stateValues.numericalf;
      expect(f(0)).closeTo(-4 - 3, 1E-12);
      expect(f(1)).closeTo(-1 - 3, 1E-12);
      expect(f(2)).closeTo(0 - 3, 1E-12);
      expect(f(3)).closeTo(-1 - 3, 1E-12);
      expect(f(4)).closeTo(-4 - 3, 1E-12);
    })
  });

  it('function with min and max', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function>
    <minimum>x=0, y=0</minimum>
    <maximum>x=1, y=1</maximum>
    </function>
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let f = components['/_function1'].stateValues.numericalf;
      expect(f(0)).closeTo(0, 1E-12);
      expect(f(1)).closeTo(1, 1E-12);
      expect(f(0.5)).closeTo(0.5, 1E-12);
      // like parabola to left of minimum
      expect(f(-1)).closeTo(1, 1E-12);
      expect(f(-2)).closeTo(4, 1E-12);
      expect(f(-3)).closeTo(9, 1E-12);
      // like parabola to right of maximum
      expect(f(2)).closeTo(0, 1E-12);
      expect(f(3)).closeTo(-3, 1E-12);
      expect(f(4)).closeTo(-8, 1E-12);
    })
  });

  it('function with min and extremum', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function>
    <minimum>x=0, y=0</minimum>
    <extremum>x=1, y=1</extremum>
    </function>
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let f = components['/_function1'].stateValues.numericalf;
      expect(f(0)).closeTo(0, 1E-12);
      expect(f(1)).closeTo(1, 1E-12);
      expect(f(0.5)).closeTo(0.5, 1E-12);
      // like parabola to left of minimum
      expect(f(-1)).closeTo(1, 1E-12);
      expect(f(-2)).closeTo(4, 1E-12);
      expect(f(-3)).closeTo(9, 1E-12);
      // like parabola to right of maximum
      expect(f(2)).closeTo(0, 1E-12);
      expect(f(3)).closeTo(-3, 1E-12);
      expect(f(4)).closeTo(-8, 1E-12);
    })
  });

  it('function with extremum and max', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function>
    <extremum>x=0, y=0</extremum>
    <maximum>x=1, y=1</maximum>
    </function>
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let f = components['/_function1'].stateValues.numericalf;
      expect(f(0)).closeTo(0, 1E-12);
      expect(f(1)).closeTo(1, 1E-12);
      expect(f(0.5)).closeTo(0.5, 1E-12);
      // like parabola to left of minimum
      expect(f(-1)).closeTo(1, 1E-12);
      expect(f(-2)).closeTo(4, 1E-12);
      expect(f(-3)).closeTo(9, 1E-12);
      // like parabola to right of maximum
      expect(f(2)).closeTo(0, 1E-12);
      expect(f(3)).closeTo(-3, 1E-12);
      expect(f(4)).closeTo(-8, 1E-12);
    })
  });

  it('function with two minima', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function>
    <minimum>x=-2</minimum>
    <minimum>x=2, y=1</minimum>
    </function>
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let f = components['/_function1'].stateValues.numericalf;
      expect(f(-2)).closeTo(1, 1E-12);
      expect(f(2)).closeTo(1, 1E-12);
      expect(f(0)).closeTo(2, 1E-12);
      // like parabola to left of minimum
      expect(f(-3)).closeTo(1 + 1, 1E-12);
      expect(f(-4)).closeTo(4 + 1, 1E-12);
      expect(f(-5)).closeTo(9 + 1, 1E-12);
      // like parabola to right of minimum
      expect(f(3)).closeTo(1 + 1, 1E-12);
      expect(f(4)).closeTo(4 + 1, 1E-12);
      expect(f(5)).closeTo(9 + 1, 1E-12);
    })
  });

  it('function with two minima and maximum with specified height', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function>
    <minimum>x=-2</minimum>
    <minimum>x=2, y=1</minimum>
    <maximum>y=5</maximum>
    </function>
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let f = components['/_function1'].stateValues.numericalf;
      expect(f(-2)).closeTo(1, 1E-12);
      expect(f(2)).closeTo(1, 1E-12);
      expect(f(0)).closeTo(5, 1E-12);
      // like parabola to left of minimum
      expect(f(-3)).closeTo(1 + 1, 1E-12);
      expect(f(-4)).closeTo(4 + 1, 1E-12);
      expect(f(-5)).closeTo(9 + 1, 1E-12);
      // like parabola to right of minimum
      expect(f(3)).closeTo(1 + 1, 1E-12);
      expect(f(4)).closeTo(4 + 1, 1E-12);
      expect(f(5)).closeTo(9 + 1, 1E-12);
    })
  });

  it('function with two minima and extremum with specified height', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function>
    <minimum>x=-2</minimum>
    <minimum>x=2, y=1</minimum>
    <extremum>y=5</extremum>
    </function>
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let f = components['/_function1'].stateValues.numericalf;
      expect(f(-2)).closeTo(1, 1E-12);
      expect(f(2)).closeTo(1, 1E-12);
      expect(f(0)).closeTo(5, 1E-12);
      // like parabola to left of minimum
      expect(f(-3)).closeTo(1 + 1, 1E-12);
      expect(f(-4)).closeTo(4 + 1, 1E-12);
      expect(f(-5)).closeTo(9 + 1, 1E-12);
      // like parabola to right of minimum
      expect(f(3)).closeTo(1 + 1, 1E-12);
      expect(f(4)).closeTo(4 + 1, 1E-12);
      expect(f(5)).closeTo(9 + 1, 1E-12);
    })
  });

  it('function with maximum and higher minimum', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function>
    <maximum>-2,1</maximum>
    <minimum>x=2, y=2</minimum>
    </function>
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let f = components['/_function1'].stateValues.numericalf;
      expect(f(-2)).closeTo(1, 1E-12);
      expect(f(-3)).closeTo(0, 1E-12);
      expect(f(-2 + 4 / 3)).closeTo(0, 1E-12);

      expect(f(2)).closeTo(2, 1E-12);
      expect(f(3)).closeTo(3, 1E-12);
      expect(f(2 - 4 / 3)).closeTo(3, 1E-12);

      expect(f(0)).closeTo(1.5, 1E-12);
    })
  });

  it('function with maximum and higher extremum', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function>
    <maximum>-2,1</maximum>
    <extremum>x=2, y=2</extremum>
    </function>
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let f = components['/_function1'].stateValues.numericalf;
      expect(f(-2)).closeTo(1, 1E-12);
      expect(f(-3)).closeTo(0, 1E-12);
      expect(f(0)).closeTo(0, 1E-12);

      expect(f(2)).closeTo(2, 1E-12);
      expect(f(3)).closeTo(1, 1E-12);
    })
  });

  it('function with minimum and lower maximum', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function>
    <minimum>-2,3</minimum>
    <maximum>x=2, y=2</maximum>
    </function>
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let f = components['/_function1'].stateValues.numericalf;
      expect(f(-2)).closeTo(3, 1E-12);
      expect(f(-3)).closeTo(4, 1E-12);
      expect(f(-2 + 4 / 3)).closeTo(4, 1E-12);

      expect(f(2)).closeTo(2, 1E-12);
      expect(f(3)).closeTo(1, 1E-12);
      expect(f(2 - 4 / 3)).closeTo(1, 1E-12);

      expect(f(0)).closeTo(2.5, 1E-12);
    })
  });

  it('function with minimum and lower extremum', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function>
    <minimum>-2,3</minimum>
    <extremum>x=2, y=2</extremum>
    </function>
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let f = components['/_function1'].stateValues.numericalf;
      expect(f(-2)).closeTo(3, 1E-12);
      expect(f(-3)).closeTo(4, 1E-12);
      expect(f(0)).closeTo(4, 1E-12);

      expect(f(2)).closeTo(2, 1E-12);
      expect(f(3)).closeTo(3, 1E-12);
    })
  });

  it('function with extremum and lower maximum', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function>
    <extremum>-2,3</extremum>
    <maximum>x=2, y=2</maximum>
    </function>
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let f = components['/_function1'].stateValues.numericalf;
      expect(f(-2)).closeTo(3, 1E-12);
      expect(f(-3)).closeTo(2, 1E-12);
      expect(f(0)).closeTo(1, 1E-12);

      expect(f(2)).closeTo(2, 1E-12);
      expect(f(3)).closeTo(1, 1E-12);
    })
  });

  it('function with maximum through points', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function>
    <maximum>-2,2</maximum>
    <through>(-5,0), (-6,-1)</through>
    <through>(0,0), (1,0)</through>
    </function>
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let f = components['/_function1'].stateValues.numericalf;
      expect(f(-2)).closeTo(2, 1E-12);
      expect(f(-5)).closeTo(0, 1E-12);
      expect(f(-6)).closeTo(-1, 1E-12);

      // extrapolates linearly
      let slope = f(-6) - f(-7)
      expect(f(-8)).closeTo(-1 - slope * 2, 1E-12);
      expect(f(-9)).closeTo(-1 - slope * 3, 1E-12);
      expect(f(-10)).closeTo(-1 - slope * 4, 1E-12);

      expect(f(0)).closeTo(0, 1E-12);
      expect(f(1)).closeTo(0, 1E-12);
      // extrapolates linearly
      expect(f(2)).closeTo(0, 1E-12);
      expect(f(3)).closeTo(0, 1E-12);
    })
  });

  it('function with single through point', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function>
    <through>(-6,-1)</through>
    </function>
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let f = components['/_function1'].stateValues.numericalf;
      expect(f(-6)).closeTo(-1, 1E-12);
      expect(f(-2)).closeTo(-1, 1E-12);
      expect(f(-12)).closeTo(-1, 1E-12);
      expect(f(12)).closeTo(-1, 1E-12);
    })
  });

  it('function with single through point with slope', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function>
    <through slope="3">(-6,-1)</through>
    </function>
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let f = components['/_function1'].stateValues.numericalf;
      expect(f(-6)).closeTo(-1, 1E-12);
      expect(f(-2)).closeTo(-1 + 3 * (-2 + 6), 1E-12);
      expect(f(-12)).closeTo(-1 + 3 * (-12 + 6), 1E-12);
      expect(f(12)).closeTo(-1 + 3 * (12 + 6), 1E-12);
    })
  });

  it('function with single through point with dynamic slope', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>slope: <mathinput/></p>
    <graph>
    <function>
    <through><slope><copy prop="value" tname="_mathinput1" /></slope>(-6,-1)</through>
    </function>
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let f = components['/_function1'].stateValues.numericalf;
      expect(f(-6)).closeTo(-1, 1E-12);
      expect(f(-2)).closeTo(-1 + 0 * (-2 + 6), 1E-12);
      expect(f(-12)).closeTo(-1 + 0 * (-12 + 6), 1E-12);
      expect(f(12)).closeTo(-1 + 0 * (12 + 6), 1E-12);
    })

    cy.get('#\\/_mathinput1_input').clear().type("2{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let f = components['/_function1'].stateValues.numericalf;
      expect(f(-6)).closeTo(-1, 1E-12);
      expect(f(-2)).closeTo(-1 + 2 * (-2 + 6), 1E-12);
      expect(f(-12)).closeTo(-1 + 2 * (-12 + 6), 1E-12);
      expect(f(12)).closeTo(-1 + 2 * (12 + 6), 1E-12);
    })

    cy.get('#\\/_mathinput1_input').clear().type("-3{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let f = components['/_function1'].stateValues.numericalf;
      expect(f(-6)).closeTo(-1, 1E-12);
      expect(f(-2)).closeTo(-1 - 3 * (-2 + 6), 1E-12);
      expect(f(-12)).closeTo(-1 - 3 * (-12 + 6), 1E-12);
      expect(f(12)).closeTo(-1 - 3 * (12 + 6), 1E-12);
    })

    cy.get('#\\/_mathinput1_input').clear().blur();
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let f = components['/_function1'].stateValues.numericalf;
      expect(f(-6)).closeTo(-1, 1E-12);
      expect(f(-2)).closeTo(-1 + 0 * (-2 + 6), 1E-12);
      expect(f(-12)).closeTo(-1 + 0 * (-12 + 6), 1E-12);
      expect(f(12)).closeTo(-1 + 0 * (12 + 6), 1E-12);
    })


  });

  it('function with two through points with dynamic slope', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>slope: <mathinput/></p>
    <graph>
    <function>
    <through><slope><copy prop="value" tname="_mathinput1" /></slope>(-6,-1),(3,8)</through>
    </function>
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log('with undefined slope, get line through points')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let f = components['/_function1'].stateValues.numericalf;
      expect(f(-6)).closeTo(-1, 1E-12);
      expect(f(-2)).closeTo(-1 + 1 * (-2 + 6), 1E-12);
      expect(f(-12)).closeTo(-1 + 1 * (-12 + 6), 1E-12);
      expect(f(12)).closeTo(-1 + 1 * (12 + 6), 1E-12);
    })

    cy.get('#\\/_mathinput1_input').clear().type("2{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let f = components['/_function1'].stateValues.numericalf;
      expect(f(-6 - 0.01)).closeTo(-1 - 0.01 * 2, 1E-3);
      expect(f(-6)).closeTo(-1, 1E-12);
      expect(f(-6 + 0.01)).closeTo(-1 + 0.01 * 2, 1E-3);

      expect(f(3 - 0.01)).closeTo(8 - 0.01 * 2, 1E-3);
      expect(f(3)).closeTo(8, 1E-12);
      expect(f(3 + 0.01)).closeTo(8 + 0.01 * 2, 1E-3);

      // extrapolate linearly
      expect(f(-6 - 3)).closeTo(-1 - 3 * 2, 1E-12);
      expect(f(3 + 3)).closeTo(8 + 3 * 2, 1E-12);


    })

    cy.get('#\\/_mathinput1_input').clear().type("-3{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let f = components['/_function1'].stateValues.numericalf;
      expect(f(-6 - 0.01)).closeTo(-1 - 0.01 * (-3), 1E-3);
      expect(f(-6)).closeTo(-1, 1E-12);
      expect(f(-6 + 0.01)).closeTo(-1 + 0.01 * (-3), 1E-3);

      expect(f(3 - 0.01)).closeTo(8 - 0.01 * (-3), 1E-3);
      expect(f(3)).closeTo(8, 1E-12);
      expect(f(3 + 0.01)).closeTo(8 + 0.01 * (-3), 1E-3);

      // extrapolate linearly
      expect(f(-6 - 3)).closeTo(-1 - 3 * (-3), 1E-12);
      expect(f(3 + 3)).closeTo(8 + 3 * (-3), 1E-12);

    })

    cy.get('#\\/_mathinput1_input').clear().blur();
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let f = components['/_function1'].stateValues.numericalf;
      expect(f(-6)).closeTo(-1, 1E-12);
      expect(f(-2)).closeTo(-1 + 1 * (-2 + 6), 1E-12);
      expect(f(-12)).closeTo(-1 + 1 * (-12 + 6), 1E-12);
      expect(f(12)).closeTo(-1 + 1 * (12 + 6), 1E-12);
    })


  });

  it('function through three points', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function>
    <through>(0,2), (2,1), (3,2)</through>
    </function>
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let f = components['/_function1'].stateValues.numericalf;
      expect(f(0)).closeTo(2, 1E-12);
      expect(f(2)).closeTo(1, 1E-12);
      expect(f(3)).closeTo(2, 1E-12);
      // extrapolate linearly
      let slope = f(4) - f(3)
      expect(f(5)).closeTo(2 + slope * 2, 1E-12);
      expect(f(6)).closeTo(2 + slope * 3, 1E-12);
      expect(f(7)).closeTo(2 + slope * 4, 1E-12);
      slope = f(0) - f(-1)
      expect(f(-2)).closeTo(2 - slope * 2, 1E-12);
      expect(f(-3)).closeTo(2 - slope * 3, 1E-12);
      expect(f(-4)).closeTo(2 - slope * 4, 1E-12);

    })
  });

  it('function through three points with slopes', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <point>(2,1)</point>
    <function>
    <through slope="0.5">(0,2)</through>
    <through slope="2">(2,1)</through>
    <through slope="-1">(3,2)</through>
    </function>
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let f = components['/_function1'].stateValues.numericalf;
      expect(f(-0.01)).closeTo(2 - 0.01 * 0.5, 1E-3)
      expect(f(0)).closeTo(2, 1E-12);
      expect(f(0.01)).closeTo(2 + 0.01 * 0.5, 1E-3)

      expect(f(2 - 0.01)).closeTo(1 - 0.01 * 2, 1E-3)
      expect(f(2)).closeTo(1, 1E-12);
      expect(f(2 + 0.01)).closeTo(1 + 0.01 * 2, 1E-3)

      expect(f(3 - 0.01)).closeTo(2 - 0.01 * (-1), 1E-3)
      expect(f(3)).closeTo(2, 1E-12);
      expect(f(3 + 0.01)).closeTo(2 + 0.01 * (-1), 1E-3)

      // extrapolate linearly
      let slope = -1;
      expect(f(5)).closeTo(2 + slope * 2, 1E-12);
      expect(f(6)).closeTo(2 + slope * 3, 1E-12);
      expect(f(7)).closeTo(2 + slope * 4, 1E-12);
      slope = 0.5;
      expect(f(-2)).closeTo(2 - slope * 2, 1E-12);
      expect(f(-3)).closeTo(2 - slope * 3, 1E-12);
      expect(f(-4)).closeTo(2 - slope * 4, 1E-12);

    })
  });

  it('function with conflicting points', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function>
    <through>(0,2), (2,1), (2,2)</through>
    </function>
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let f = components['/_function1'].stateValues.numericalf;
      assert.isNaN(f(0));
      assert.isNaN(f(1));
      assert.isNaN(f(2));
    })
  });

  it('check monotonicity', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function>
    <through>(-5,0), (-4,0.1), (-3,0.3), (-2,3), (-1,3.1), (0,3.2), (1,5)</through>
    <maximum>(6,6)</maximum>
    </function>
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let f = components['/_function1'].stateValues.numericalf;
      for (let x = -5; x <= 6; x += 0.1) {
        expect(f(x - 0.1)).lessThan(f(x));
      }
      expect(f(-5)).closeTo(0, 1E-12);
      expect(f(-4)).closeTo(0.1, 1E-12);
      expect(f(-3)).closeTo(0.3, 1E-12);
      expect(f(-2)).closeTo(3, 1E-12);
      expect(f(-1)).closeTo(3.1, 1E-12);
      expect(f(0)).closeTo(3.2, 1E-12);
      expect(f(1)).closeTo(5, 1E-12);
      expect(f(6)).closeTo(6, 1E-12);
      expect(f(7)).closeTo(5, 1E-12);
      expect(f(8)).closeTo(2, 1E-12);
    })
  });

  it('point constrained to function', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function>
    <maximum>(5,6)</maximum>
    <through>(0,5),(8,4)</through>
    </function>

    <point>
      <constrainTo><copy tname="_function1" /></constrainTo>
      (1,2)
    </point>
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let p = components['/_point1'];

      let x = p.stateValues.xs[0].evaluate_to_constant();
      let y = p.stateValues.xs[1].evaluate_to_constant();

      expect(6 - (x - 5) * (x - 5) / 25).closeTo(y, 1E-5);

      p.movePoint({ x: -8, y: 8 });

      x = p.stateValues.xs[0].evaluate_to_constant();
      y = p.stateValues.xs[1].evaluate_to_constant();

      expect(6 - (x - 5) * (x - 5) / 25).closeTo(y, 1E-5);

      p.movePoint({ x: 8, y: 8 });

      x = p.stateValues.xs[0].evaluate_to_constant();
      y = p.stateValues.xs[1].evaluate_to_constant();

      expect(6 - (x - 5) * (x - 5) * (2 / 9)).closeTo(y, 1E-5);

    })
  });

  it('function determined by formula', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function>
    3/(1+e^(-x/2))
    </function>
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let f = components['/_function1'].stateValues.numericalf;

      expect(f(-5)).closeTo(3 / (1 + Math.exp(5 / 2)), 1E-12);
      expect(f(1)).closeTo(3 / (1 + Math.exp(-1 / 2)), 1E-12);

    })
  });

  it('function determined by formula in different variable', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function variable="q">
      q^2 sin(pi q/2)/100
    </function>

    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let f = components['/_function1'].stateValues.numericalf;

      expect(f(-5)).closeTo(25 * Math.sin(0.5 * Math.PI * (-5)) / 100, 1E-12);
      expect(f(3)).closeTo(9 * Math.sin(0.5 * Math.PI * (3)) / 100, 1E-12);

    })
  });

  it('point constrained to function in different variable', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function variable="u">
      log(2u)
    </function>
    <point>
    <constrainTo><copy tname="_function1" /></constrainTo>
    (-3,5)
    </point>

    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let p = components['/_point1'];

      let x = p.stateValues.xs[0].evaluate_to_constant();
      let y = p.stateValues.xs[1].evaluate_to_constant();

      expect(Math.log(2 * x)).closeTo(y, 1E-5);

      p.movePoint({ x: 8, y: 8 });

      x = p.stateValues.xs[0].evaluate_to_constant();
      y = p.stateValues.xs[1].evaluate_to_constant();

      expect(Math.log(2 * x)).closeTo(y, 1E-5);

      p.movePoint({ x: -8, y: -8 });

      x = p.stateValues.xs[0].evaluate_to_constant();
      y = p.stateValues.xs[1].evaluate_to_constant();

      expect(Math.log(2 * x)).closeTo(y, 1E-5);


    })
  });

  it('calculated extrema from spline', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <point>(0.7, 5.43)</point>
    <point>(3,4)</point>
    <point>(5,6)</point>
    <point>(-5,6)</point>
    <function>
      <through>
      <copy tname="_point1" />
      <copy tname="_point2" />
      </through>

      <maximum><copy tname="_point3" /></maximum>
      <minimum><copy tname="_point4" /></minimum>
    </function>
    <copy prop="maxima" tname="_function1" />
    <copy prop="minima" tname="_function1" />
    </graph>

    <p>Number of maxima: <copy prop="numbermaxima" name="numbermaxima" tname="_function1" /></p>
    <p>Maxima: <math simplify="none"><copy prop="maxima" tname="_function1" /></math></p>
    <p>Number of minima: <copy prop="numberminima" name="numberminima" tname="_function1" /></p>
    <p>Minima: <math simplify="none"><copy prop="minima" tname="_function1" /></math></p>
    <p>Number of extrema: <copy prop="numberextrema" name="numberextrema" tname="_function1" /></p>
    <p>Extrema: <math simplify="none"><copy prop="extrema" tname="_function1" /></math></p>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let numberMaximaAnchor = '#' + components["/numbermaxima"].replacements[0].componentName;
      let numberMinimaAnchor = '#' + components["/numberminima"].replacements[0].componentName;
      let numberExtremaAnchor = '#' + components["/numberextrema"].replacements[0].componentName;

      cy.get(numberMaximaAnchor).should('have.text', '2');
      cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−2.15,7)(5,6)');
      });
      cy.get(numberMinimaAnchor).should('have.text', '2');
      cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−5,6)(3,4)');
      });
      cy.get(numberExtremaAnchor).should('have.text', '4');

      cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−5,6)(−2.15,7)(3,4)(5,6)');
      });


      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        components['/_point1'].movePoint({ x: 2, y: 2 });

        cy.get(numberMaximaAnchor).should('have.text', '2');
        cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(−1.5,7)(5,6)');
        });
        cy.get(numberMinimaAnchor).should('have.text', '2');
        cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(−5,6)(2,2)');
        });
        cy.get(numberExtremaAnchor).should('have.text', '4');
        cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(−5,6)(−1.5,7)(2,2)(5,6)');
        });

      });

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        components['/_point1'].movePoint({ x: 3.6, y: 5.1 });

        cy.get(numberMaximaAnchor).should('have.text', '3');
        cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(−1,7)(3.6,5.1)(5,6)');
        });
        cy.get(numberMinimaAnchor).should('have.text', '3');
        cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(−5,6)(3,4)(4.3,5)');
        });
        cy.get(numberExtremaAnchor).should('have.text', '6');
        cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(−5,6)(−1,7)(3,4)(3.6,5.1)(4.3,5)(5,6)');
        });

      });

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        components['/_point1'].movePoint({ x: 8, y: 9 });

        cy.get(numberMaximaAnchor).should('have.text', '2');
        cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(−1,7)(5,6)');
        });
        cy.get(numberMinimaAnchor).should('have.text', '3');
        cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(−5,6)(3,4)(6.5,5)');
        });
        cy.get(numberExtremaAnchor).should('have.text', '5');
        cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(−5,6)(−1,7)(3,4)(5,6)(6.5,5)');
        });

      });

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        components['/_point1'].movePoint({ x: 5, y: 2 });

        cy.get(numberMaximaAnchor).should('have.text', '0');
        cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('＿');
        });
        cy.get(numberMinimaAnchor).should('have.text', '0');
        cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('＿');
        });
        cy.get(numberExtremaAnchor).should('have.text', '0');
        cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('＿');
        });

      });

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        components['/_point1'].movePoint({ x: -9, y: 0 });

        cy.get(numberMaximaAnchor).should('have.text', '3');
        cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(−7,7)(−1,7)(5,6)');
        });
        cy.get(numberMinimaAnchor).should('have.text', '2');
        cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(−5,6)(3,4)');
        });
        cy.get(numberExtremaAnchor).should('have.text', '5');
        cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(−7,7)(−5,6)(−1,7)(3,4)(5,6)');
        });

      });


      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        components['/_point4'].movePoint({ x: 8, y: 3 });

        cy.get(numberMaximaAnchor).should('have.text', '1');
        cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(5,6)');
        });
        cy.get(numberMinimaAnchor).should('have.text', '1');
        cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(8,3)');
        });
        cy.get(numberExtremaAnchor).should('have.text', '2');
        cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(5,6)(8,3)');
        });

      });

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        components['/_point4'].movePoint({ x: 8, y: 6 });

        cy.get(numberMaximaAnchor).should('have.text', '2');
        cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(5,6)(7,7)');
        });
        cy.get(numberMinimaAnchor).should('have.text', '2');
        cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(6,5)(8,6)');
        });
        cy.get(numberExtremaAnchor).should('have.text', '4');
        cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(5,6)(6,5)(7,7)(8,6)');
        });

      });
    })

  });

  it('calculated extrema from gaussians', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <point layer="2">(0,1)</point>
    <point layer="2">(3,1)</point>
    <function>
      <copy prop="y" tname="_point1" />
      exp(-(x-<copy prop="x" tname="_point1" />)^2)
      + 
      <copy prop="y" tname="_point2" />
      exp(-(x-<copy prop="x" tname="_point2" />)^2)
    </function>
    <copy prop="extrema" tname="_function1" />
    </graph>
    
    <p>Number of maxima: <copy prop="numbermaxima" name="numbermaxima" tname="_function1" /></p>
    <p>Maxima locations: <copy prop="maximumlocation1" name="maximumlocation1" tname="_function1" />,
    <copy prop="maximumlocation2" name="maximumlocation2" tname="_function1" /></p>
    <p>Maxima values: <copy prop="maximumvalue1" name="maximumvalue1" tname="_function1" />,
    <copy prop="maximumvalue2" name="maximumvalue2" tname="_function1" /></p>
    <p>Number of minima: <copy prop="numberminima" name="numberminima" tname="_function1" /></p>
    <p>Minima locations: <copy prop="minimumlocation1" name="minimumlocation1" tname="_function1" />,
    <copy prop="minimumlocation2" name="minimumlocation2" tname="_function1" /></p>
    <p>Minima values: <copy prop="minimumvalue1" name="minimumvalue1" tname="_function1" />,
    <copy prop="minimumvalue2" name="minimumvalue2" tname="_function1" /></p>
    <p>Number of extrema: <copy prop="numberextrema" name="numberextrema" tname="_function1" /></p>
    <p>Extrema locations: <copy prop="extremumlocation1" name="extremumlocation1" tname="_function1" />,
    <copy prop="extremumlocation2" name="extremumlocation2" tname="_function1" />,
    <copy prop="extremumlocation3" name="extremumlocation3" tname="_function1" /></p>
    <p>Extrema values: <copy prop="extremumvalue1" name="extremumvalue1" tname="_function1" />,
    <copy prop="extremumvalue2" name="extremumvalue2" tname="_function1" />,
    <copy prop="extremumvalue3" name="extremumvalue3" tname="_function1" /></p>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let numberMaximaAnchor = '#' + components["/numbermaxima"].replacements[0].componentName;
      let numberMinimaAnchor = '#' + components["/numberminima"].replacements[0].componentName;
      let numberExtremaAnchor = '#' + components["/numberextrema"].replacements[0].componentName;
      let maximumLocation1Anchor = '#' + components["/maximumlocation1"].replacements[0].componentName;
      let maximumLocation2Anchor = '#' + components["/maximumlocation2"].replacements[0].componentName;
      let maximumValue1Anchor = '#' + components["/maximumvalue1"].replacements[0].componentName;
      let maximumValue2Anchor = '#' + components["/maximumvalue2"].replacements[0].componentName;
      let minimumLocation1Anchor = '#' + components["/minimumlocation1"].replacements[0].componentName;
      let minimumValue1Anchor = '#' + components["/minimumvalue1"].replacements[0].componentName;
      let extremumLocation1Anchor = '#' + components["/extremumlocation1"].replacements[0].componentName;
      let extremumLocation2Anchor = '#' + components["/extremumlocation2"].replacements[0].componentName;
      let extremumLocation3Anchor = '#' + components["/extremumlocation3"].replacements[0].componentName;
      let extremumValue1Anchor = '#' + components["/extremumvalue1"].replacements[0].componentName;
      let extremumValue2Anchor = '#' + components["/extremumvalue2"].replacements[0].componentName;
      let extremumValue3Anchor = '#' + components["/extremumvalue3"].replacements[0].componentName;

      cy.get(numberMaximaAnchor).should('have.text', '2');
      cy.get(maximumLocation1Anchor).invoke('text').then((text) => {
        expect(Number(text.replace(/−/, '-'))).closeTo(0, 0.01);
      });
      cy.get(maximumLocation2Anchor).invoke('text').then((text) => {
        expect(Number(text.replace(/−/, '-'))).closeTo(3, 0.01);
      });
      cy.get(maximumValue1Anchor).invoke('text').then((text) => {
        expect(Number(text.replace(/−/, '-'))).closeTo(1, 0.01);
      });
      cy.get(maximumValue2Anchor).invoke('text').then((text) => {
        expect(Number(text.replace(/−/, '-'))).closeTo(1, 0.01);
      });

      cy.get(numberMinimaAnchor).should('have.text', '1');
      cy.get(minimumLocation1Anchor).invoke('text').then((text) => {
        expect(Number(text.replace(/−/, '-'))).closeTo(1.5, 0.01);
      });
      cy.get(minimumValue1Anchor).invoke('text').then((text) => {
        expect(Number(text.replace(/−/, '-'))).closeTo(.21, 0.01);
      });

      cy.get(numberExtremaAnchor).should('have.text', '3');
      cy.get(extremumLocation1Anchor).invoke('text').then((text) => {
        expect(Number(text.replace(/−/, '-'))).closeTo(0, 0.01);
      });
      cy.get(extremumLocation2Anchor).invoke('text').then((text) => {
        expect(Number(text.replace(/−/, '-'))).closeTo(1.5, 0.01);
      });
      cy.get(extremumLocation3Anchor).invoke('text').then((text) => {
        expect(Number(text.replace(/−/, '-'))).closeTo(3, 0.01);
      });
      cy.get(extremumValue1Anchor).invoke('text').then((text) => {
        expect(Number(text.replace(/−/, '-'))).closeTo(1, 0.01);
      });
      cy.get(extremumValue2Anchor).invoke('text').then((text) => {
        expect(Number(text.replace(/−/, '-'))).closeTo(.21, 0.01);
      });
      cy.get(extremumValue3Anchor).invoke('text').then((text) => {
        expect(Number(text.replace(/−/, '-'))).closeTo(1, 0.01);
      });


      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        components['/_point2'].movePoint({ x: 3, y: -1 });


        cy.get(numberMaximaAnchor).should('have.text', '1');
        cy.get(maximumLocation1Anchor).invoke('text').then((text) => {
          expect(Number(text.replace(/−/, '-'))).closeTo(0, 0.01);
        });
        cy.get(maximumLocation2Anchor).should('not.exist');
        cy.get(maximumValue1Anchor).invoke('text').then((text) => {
          expect(Number(text.replace(/−/, '-'))).closeTo(1, 0.01);
        });
        cy.get(maximumValue2Anchor).should('not.exist');


        cy.get(numberMinimaAnchor).should('have.text', '1');
        cy.get(minimumLocation1Anchor).invoke('text').then((text) => {
          expect(Number(text.replace(/−/, '-'))).closeTo(3, 0.01);
        });
        cy.get(minimumValue1Anchor).invoke('text').then((text) => {
          expect(Number(text.replace(/−/, '-'))).closeTo(-1, 0.01);
        });


        cy.get(numberExtremaAnchor).should('have.text', '2');
        cy.get(extremumLocation1Anchor).invoke('text').then((text) => {
          expect(Number(text.replace(/−/, '-'))).closeTo(0, 0.01);
        });
        cy.get(extremumLocation2Anchor).invoke('text').then((text) => {
          expect(Number(text.replace(/−/, '-'))).closeTo(3, 0.01);
        });
        cy.get(extremumLocation3Anchor).should('not.exist');
        cy.get(extremumValue1Anchor).invoke('text').then((text) => {
          expect(Number(text.replace(/−/, '-'))).closeTo(1, 0.01);
        });
        cy.get(extremumValue2Anchor).invoke('text').then((text) => {
          expect(Number(text.replace(/−/, '-'))).closeTo(-1, 0.01);
        });
        cy.get(extremumValue3Anchor).should('not.exist');

      });


      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        components['/_point1'].movePoint({ x: 0, y: -1 });

        let minimumLocation2Anchor = '#' + components["/minimumlocation2"].replacements[0].componentName;
        let minimumValue2Anchor = '#' + components["/minimumvalue2"].replacements[0].componentName;

        let extremumLocation3AnchorOld = extremumLocation3Anchor;
        let extremumLocation3Anchor = '#' + components["/extremumlocation3"].replacements[0].componentName;
        let extremumValue3AnchorOld = extremumValue3Anchor;
        let extremumValue3Anchor = '#' + components["/extremumvalue3"].replacements[0].componentName;


        cy.get(numberMaximaAnchor).should('have.text', '1');
        cy.get(maximumLocation1Anchor).invoke('text').then((text) => {
          expect(Number(text.replace(/−/, '-'))).closeTo(1.5, 0.01);
        });
        cy.get(maximumLocation2Anchor).should('not.exist');
        cy.get(maximumValue1Anchor).invoke('text').then((text) => {
          expect(Number(text.replace(/−/, '-'))).closeTo(-0.21, 0.01);
        });
        cy.get(maximumValue2Anchor).should('not.exist');


        cy.get(numberMinimaAnchor).should('have.text', '2');
        cy.get(minimumLocation1Anchor).invoke('text').then((text) => {
          expect(Number(text.replace(/−/, '-'))).closeTo(0, 0.01);
        });
        cy.get(minimumLocation2Anchor).invoke('text').then((text) => {
          expect(Number(text.replace(/−/, '-'))).closeTo(3, 0.01);
        });
        cy.get(minimumValue1Anchor).invoke('text').then((text) => {
          expect(Number(text.replace(/−/, '-'))).closeTo(-1, 0.01);
        });
        cy.get(minimumValue2Anchor).invoke('text').then((text) => {
          expect(Number(text.replace(/−/, '-'))).closeTo(-1, 0.01);
        });


        cy.get(numberExtremaAnchor).should('have.text', '3');
        cy.get(extremumLocation1Anchor).invoke('text').then((text) => {
          expect(Number(text.replace(/−/, '-'))).closeTo(0, 0.01);
        });
        cy.get(extremumLocation2Anchor).invoke('text').then((text) => {
          expect(Number(text.replace(/−/, '-'))).closeTo(1.5, 0.01);
        });
        cy.get(extremumLocation3AnchorOld).should('not.exist')
        cy.get(extremumLocation3Anchor).invoke('text').then((text) => {
          expect(Number(text.replace(/−/, '-'))).closeTo(3, 0.01);
        });
        cy.get(extremumValue1Anchor).invoke('text').then((text) => {
          expect(Number(text.replace(/−/, '-'))).closeTo(-1, 0.01);
        });
        cy.get(extremumValue2Anchor).invoke('text').then((text) => {
          expect(Number(text.replace(/−/, '-'))).closeTo(-.21, 0.01);
        });
        cy.get(extremumValue3AnchorOld).should('not.exist')
        cy.get(extremumValue3Anchor).invoke('text').then((text) => {
          expect(Number(text.replace(/−/, '-'))).closeTo(-1, 0.01);
        });

      });
    });

  });

  it('calculated extrema from sinusoid', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    Period: <mathinput />
    <graph>
    <function>sin(2*pi*x/<copy prop="value" tname="_mathinput1" />)</function>
    <copy prop="extrema" tname="_function1" />
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let f = components['/_function1'];

      expect(f.stateValues.numberMaxima).eq(0);
      expect(f.stateValues.numberMinima).eq(0);
      expect(f.stateValues.numberExtrema).eq(0);

    });

    cy.get('#\\/_mathinput1_input').clear().type("10{enter}");

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let period = 10;

      let f = components['/_function1'];

      expect(f.stateValues.numberMaxima).eq(200 / period);

      let maximaLocations = f.stateValues.maximaLocations;
      for (let m of maximaLocations) {
        expect(((m % period) + period) % period).closeTo(period / 4, 0.0001);
      }

      let maximaValues = f.stateValues.maximaValues;
      for (let m of maximaValues) {
        expect(m).closeTo(1, 0.0001);
      }

      expect(f.stateValues.numberMinima).eq(200 / period);

      let minimalocations = f.stateValues.minimaLocations;
      for (let m of minimalocations) {
        expect(((m % period) + period) % period).closeTo(3 * period / 4, 0.0001);
      }

      let minimaValues = f.stateValues.minimaValues;
      for (let m of minimaValues) {
        expect(m).closeTo(-1, 0.0001);
      }

      expect(f.stateValues.numberExtrema).eq(400 / period);

      let extremalocations = f.stateValues.minimaLocations;
      for (let m of extremalocations) {
        expect(((m % (period / 2)) + (period / 2)) % (period / 2)).closeTo(period / 4, 0.0001);
      }

      let extremavalues = f.stateValues.minimaValues;
      for (let m of extremavalues) {
        expect(Math.abs(m)).closeTo(1, 0.0001);
      }

    });

    cy.get('#\\/_mathinput1_input').clear().type("5{enter}");

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let period = 5;

      let f = components['/_function1'];

      expect(f.stateValues.numberMaxima).eq(200 / period);

      let maximaLocations = f.stateValues.maximaLocations;
      for (let m of maximaLocations) {
        expect(((m % period) + period) % period).closeTo(period / 4, 0.0001);
      }

      let maximaValues = f.stateValues.maximaValues;
      for (let m of maximaValues) {
        expect(m).closeTo(1, 0.0001);
      }

      expect(f.stateValues.numberMinima).eq(200 / period);

      let minimalocations = f.stateValues.minimaLocations;
      for (let m of minimalocations) {
        expect(((m % period) + period) % period).closeTo(3 * period / 4, 0.0001);
      }

      let minimaValues = f.stateValues.minimaValues;
      for (let m of minimaValues) {
        expect(m).closeTo(-1, 0.0001);
      }

      expect(f.stateValues.numberExtrema).eq(400 / period);

      let extremalocations = f.stateValues.minimaLocations;
      for (let m of extremalocations) {
        expect(((m % (period / 2)) + (period / 2)) % (period / 2)).closeTo(period / 4, 0.0001);
      }

      let extremavalues = f.stateValues.minimaValues;
      for (let m of extremavalues) {
        expect(Math.abs(m)).closeTo(1, 0.0001);
      }

    });


  });

  it('no extrema with horizontal asymptote', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function>
      1/(1+exp(-10*x))
    </function>
    <copy prop="minima" tname="_function1" />
    <copy prop="maxima" tname="_function1" />
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let f = components['/_function1'];

      expect(f.stateValues.numberMaxima).eq(0);
      expect(f.stateValues.numberMinima).eq(0);
      expect(f.stateValues.numberExtrema).eq(0);

    });

  });

  it('extrema of rational function', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function>
      (x+8)(x-8)/((x-2)(x+4)(x-5)^2)
    </function>
    <copy prop="extrema" tname="_function1" />
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let f = components['/_function1'];

      // values of extrema computed in Sage
      let minimaLocations = [-2.29152990292159];
      let minimaValues = [0.150710261517204];
      let maximaLocations = [-11.6660173492088, 3.18454272065031, 9.77300453148004];
      let maximaValues = [0.00247762462709702, -1.92014417815870, 0.0129202046449760]

      expect(f.stateValues.numberMaxima).eq(3);
      expect(f.stateValues.numberMinima).eq(1);
      expect(f.stateValues.numberExtrema).eq(4);

      expect(f.stateValues.minimaValues[0]).closeTo(minimaValues[0], 0.000001);
      expect(f.stateValues.minimaLocations[0]).closeTo(minimaLocations[0], 0.000001);
      for (let i in maximaLocations) {
        expect(f.stateValues.maximaValues[i]).closeTo(maximaValues[i], 0.000001);
        expect(f.stateValues.maximaLocations[i]).closeTo(maximaLocations[i], 0.000001);
      }

    });

  });

  it('intervals of extrema are not counted', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function>
      <through>
     (-8,7), (-7,2), (-6,2), (-4,3), (-2,5), (8,5), (10,4)
      </through>
    </function>
    <copy prop="extrema" tname="_function1" />
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let f = components['/_function1'];
      expect(f.stateValues.numberMaxima).eq(0);
      expect(f.stateValues.numberMinima).eq(0);
      expect(f.stateValues.numberExtrema).eq(0);

    });

  });

  it('extrema of function with restricted domain', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function>
      log(x^2-1)*sqrt((x-5)^2-1)
    </function>
    <copy prop="extrema" tname="_function1" />
    </graph>

    <copy prop="extremalocations" tname="_function1" />,
    <copy prop="extremavalues" tname="_function1" />

    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let f = components['/_function1'];
      expect(f.stateValues.numberMaxima).eq(1);
      expect(f.stateValues.numberMinima).eq(0);
      expect(f.stateValues.numberExtrema).eq(1);

      expect(f.stateValues.maximaLocations[0]).closeTo(2.614, 0.001);
      expect(f.stateValues.maximaValues[0]).closeTo(3.820, 0.001);

    });

  });

  it('two functions with mutual dependence', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <point>(1,2)</point>
    <point>(3,4)</point>
    <point>(-5,7)</point>
    <point>(8,-1)</point>
    <function yscale="5">
      <maximum>(<copy prop="numbermaxima" tname="_function2" />,
      <copy prop="numberminima" tname="_function2" />)
      </maximum>
      <through >(-8,5),(9,10)</through>
    </function>
    
    <function>
      <yscale><copy prop="yscale" tname="_function1" /></yscale>
      <through>
        <copy tname="_point1" />
        <copy tname="_point2" />
        <copy tname="_point3" />
        <copy tname="_point4" />
      </through>
      <maximum>x=0</maximum>
    </function>
    </graph>
    
    <p>Number of maxima: <copy prop="numbermaxima" name="numbermaxima" tname="_function2" /></p>
    <p>Number of minima: <copy prop="numberminima" name="numberminima" tname="_function2" /></p>
    
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let numberMaximaAnchor = '#' + components["/numbermaxima"].replacements[0].componentName;
      let numberMinimaAnchor = '#' + components["/numberminima"].replacements[0].componentName;

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let f1 = components['/_function1'];
        let f2 = components['/_function2'];
        expect(f1.stateValues.numberMaxima).eq(1);
        expect(f1.stateValues.numberMinima).eq(2);
        expect(f1.stateValues.numberExtrema).eq(3);
        expect(f2.stateValues.numberMaxima).eq(2);
        expect(f2.stateValues.numberMinima).eq(1);
        expect(f2.stateValues.numberExtrema).eq(3);

        expect(f1.stateValues.maximaLocations[0]).eq(2);
        expect(f1.stateValues.maximaValues[0]).eq(1);

        expect(f1.stateValues.xscale).eq(1);
        expect(f1.stateValues.yscale).eq(5);
        expect(f2.stateValues.xscale).eq(1);
        expect(f2.stateValues.yscale).eq(5);

      });

      cy.get(numberMaximaAnchor).should('have.text', '2')
      cy.get(numberMinimaAnchor).should('have.text', '1')

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        components['/_point1'].movePoint({ x: 2, y: 6 })

        let f1 = components['/_function1'];
        let f2 = components['/_function2'];
        expect(f1.stateValues.numberMaxima).eq(1);
        expect(f1.stateValues.numberMinima).eq(2);
        expect(f1.stateValues.numberExtrema).eq(3);
        expect(f2.stateValues.numberMaxima).eq(1);
        expect(f2.stateValues.numberMinima).eq(0);
        expect(f2.stateValues.numberExtrema).eq(1);

        expect(f1.stateValues.maximaLocations[0]).eq(1);
        expect(f1.stateValues.maximaValues[0]).eq(0);

      });

      cy.get(numberMaximaAnchor).should('have.text', '1')
      cy.get(numberMinimaAnchor).should('have.text', '0')


      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        components['/_point2'].movePoint({ x: 3, y: 7 })
        components['/_point3'].movePoint({ x: 9, y: 0 })

        let f1 = components['/_function1'];
        let f2 = components['/_function2'];
        expect(f1.stateValues.numberMaxima).eq(1);
        expect(f1.stateValues.numberMinima).eq(2);
        expect(f1.stateValues.numberExtrema).eq(3);
        expect(f2.stateValues.numberMaxima).eq(2);
        expect(f2.stateValues.numberMinima).eq(2);
        expect(f2.stateValues.numberExtrema).eq(4);

        expect(f1.stateValues.maximaLocations[0]).eq(2);
        expect(f1.stateValues.maximaValues[0]).eq(2);

      });

      cy.get(numberMaximaAnchor).should('have.text', '2')
      cy.get(numberMinimaAnchor).should('have.text', '2')


    })

  });

  it('shadowed sugar works correctly with initially unresolved', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput />
    <mathinput />
    
    <function>
    <xscale><copy prop="value" tname="_mathinput1" /></xscale>
    <copy prop="value" tname="_mathinput2" />x^3
    +1
    </function>
    
    <graph>
      <copy name="f1a" tname="_function1" />
    </graph>
    <p><copy prop="xscale" tname="f1a" /></p>
    <p><copy prop="xscale" tname="_function1" /></p>
    
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/_p1').should('have.text', 'NaN')
    cy.get('#\\/_p2').should('have.text', 'NaN')

    cy.get('#\\/_mathinput1_input').type('1{enter}')
    cy.get('#\\/_mathinput2_input').type('2{enter}')

    cy.get('#\\/_p1').should('have.text', '1')
    cy.get('#\\/_p2').should('have.text', '1')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      expect(components["/_function1"].stateValues.numericalf(-2)).eq(2 * (-2) ** 3 + 1)
    });


    cy.get('#\\/_mathinput1_input').clear().type('3{enter}')
    cy.get('#\\/_mathinput2_input').clear().type('4{enter}')

    cy.get('#\\/_p1').should('have.text', '3')
    cy.get('#\\/_p2').should('have.text', '3')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      expect(components["/_function1"].stateValues.numericalf(-2)).eq(4 * (-2) ** 3 + 1)
    });

  });

  it('extrema of quartic, reffed multipled times', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput prefill="1" />
    <mathinput prefill="0" />
    <mathinput prefill="-2" />
    
    <function>
    <copy prop="value" tname="_mathinput1" />x^4
    +<copy prop="value" tname="_mathinput2" />x^3
    +<copy prop="value" tname="_mathinput3" />x^2
    + 1
    </function>
    
    <graph>
      <copy name="f1a" tname="_function1" />
      <copy name="maxima" prop="maxima" tname="_function1" />
      <copy name="minima" prop="minima" tname="f1a" />
    </graph>
    <graph>
      <copy name="f1b" tname="f1a" />
      <copy name="extremum1" prop="extremum1" tname="f1b" />
      <copy name="extremum2" prop="extremum2" tname="f1b" />
      <copy name="extremum3" prop="extremum3" tname="f1b" />
    </graph>
    
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      expect(components["/maxima"].replacements.length).eq(1);
      expect(components["/maxima"].replacements[0].stateValues.coords.tree).eqls(["vector", 0, 1]);
      expect(components["/minima"].replacements.length).eq(2);
      expect(components["/minima"].replacements[0].stateValues.coords.tree).eqls(["vector", -1, 0]);
      expect(components["/minima"].replacements[1].stateValues.coords.tree).eqls(["vector", 1, 0]);
      expect(components["/extremum1"].replacements.length).eq(1);
      expect(components["/extremum1"].replacements[0].stateValues.coords.tree).eqls(["vector", -1, 0]);
      expect(components["/extremum2"].replacements.length).eq(1);
      expect(components["/extremum2"].replacements[0].stateValues.coords.tree).eqls(["vector", 0, 1]);
      expect(components["/extremum3"].replacements.length).eq(1);
      expect(components["/extremum3"].replacements[0].stateValues.coords.tree).eqls(["vector", 1, 0]);

    });

    cy.get("#\\/_mathinput2_input").clear().type('2{enter}');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      expect(components["/maxima"].replacements.length).eq(1);
      expect(components["/maxima"].replacements[0].stateValues.coords.tree).eqls(["vector", 0, 1]);
      expect(components["/minima"].replacements.length).eq(2);
      let min1 = components["/minima"].replacements[0].stateValues.coords.tree;
      expect(min1[1]).closeTo(-2, 0.00001)
      expect(min1[2]).closeTo(-7, 0.00001)

      let min2 = components["/minima"].replacements[1].stateValues.coords.tree;
      expect(min2[1]).closeTo(0.5, 0.00001)
      expect(min2[2]).closeTo(13 / 16, 0.00001)

      expect(components["/extremum1"].replacements.length).eq(1);
      min1 = components["/extremum1"].replacements[0].stateValues.coords.tree;
      expect(min1[1]).closeTo(-2, 0.00001)
      expect(min1[2]).closeTo(-7, 0.00001)

      expect(components["/extremum2"].replacements.length).eq(1);
      expect(components["/extremum2"].replacements[0].stateValues.coords.tree).eqls(["vector", 0, 1]);

      expect(components["/extremum3"].replacements.length).eq(1);
      min2 = components["/extremum3"].replacements[0].stateValues.coords.tree;
      expect(min2[1]).closeTo(0.5, 0.00001)
      expect(min2[2]).closeTo(13 / 16, 0.00001)

    });

    cy.get("#\\/_mathinput1_input").clear().type('-1{enter}');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      expect(components["/maxima"].replacements.length).eq(1);
      expect(components["/maxima"].replacements[0].stateValues.coords.tree).eqls(["vector", 0, 1]);
      expect(components["/minima"].replacements.length).eq(0);

      expect(components["/extremum1"].replacements.length).eq(1);
      expect(components["/extremum1"].replacements[0].stateValues.coords.tree).eqls(["vector", 0, 1]);

      expect(components["/extremum2"].replacements.length).eq(0);
      expect(components["/extremum3"].replacements.length).eq(0);

    });
  });

  it('function of function uses second variable', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <function variable="t" name="f">t^3</function>

    <function name="f2"><copy tname="f"/></function>
    <function name="f3" variable="s"><copy tname="f"/></function>

    <copy name="f4" tname="f"/>
    <copy name="f5" tname="f2"/>
    <copy name="f6" tname="f3"/>

    <copy prop="variable" tname="f" name="fv" />
    <copy prop="variable" tname="f2" name="f2v" />
    <copy prop="variable" tname="f3" name="f3v" />
    <copy prop="variable" tname="f4" name="f4v" />
    <copy prop="variable" tname="f5" name="f5v" />
    <copy prop="variable" tname="f6" name="f6v" />
    
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let variable1Anchor = '#' + components["/fv"].replacements[0].componentName;
      let variable2Anchor = '#' + components["/f2v"].replacements[0].componentName;
      let variable3Anchor = '#' + components["/f3v"].replacements[0].componentName;
      let variable4Anchor = '#' + components["/f4v"].replacements[0].componentName;
      let variable5Anchor = '#' + components["/f5v"].replacements[0].componentName;
      let variable6Anchor = '#' + components["/f6v"].replacements[0].componentName;

      cy.get(variable1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('t')
      })
      cy.get(variable2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('t')
      })
      cy.get(variable3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('t')
      })
      cy.get(variable4Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('t')
      })
      cy.get(variable5Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('t')
      })
      cy.get(variable6Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('t')
      })
      
      cy.window().then((win) => {

        expect(components["/f"].stateValues.variable.tree).eq('t');
        expect(components["/f2"].stateValues.variable.tree).eq('t');
        expect(components["/f3"].stateValues.variable.tree).eq('t');
        expect(components["/f4"].replacements[0].stateValues.variable.tree).eq('t');
        expect(components["/f5"].replacements[0].stateValues.variable.tree).eq('t');
        expect(components["/f6"].replacements[0].stateValues.variable.tree).eq('t');

        expect(components["/f"].stateValues.formula.tree).eqls(["^", "t", 3]);
        expect(components["/f2"].stateValues.formula.tree).eqls(["^", "t", 3]);
        expect(components["/f3"].stateValues.formula.tree).eqls(["^", "t", 3]);
        expect(components["/f4"].replacements[0].stateValues.formula.tree).eqls(["^", "t", 3]);
        expect(components["/f5"].replacements[0].stateValues.formula.tree).eqls(["^", "t", 3]);
        expect(components["/f6"].replacements[0].stateValues.formula.tree).eqls(["^", "t", 3]);

      })
    });

  });



});
