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
      let f = components['/_function1'].returnNumericF();
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
      let f = components['/_function1'].returnNumericF();
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
      let f = components['/_function1'].returnNumericF();
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
      let f = components['/_function1'].returnNumericF();
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
      let f = components['/_function1'].returnNumericF();
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
      let f = components['/_function1'].returnNumericF();
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
      let f = components['/_function1'].returnNumericF();
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
      let f = components['/_function1'].returnNumericF();
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
      let f = components['/_function1'].returnNumericF();
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
      let f = components['/_function1'].returnNumericF();
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
      let f = components['/_function1'].returnNumericF();
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
      let f = components['/_function1'].returnNumericF();
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
      let f = components['/_function1'].returnNumericF();
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
      let f = components['/_function1'].returnNumericF();
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
      let f = components['/_function1'].returnNumericF();
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
      let f = components['/_function1'].returnNumericF();
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
      let f = components['/_function1'].returnNumericF();
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
      let f = components['/_function1'].returnNumericF();
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
      let f = components['/_function1'].returnNumericF();
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
      let f = components['/_function1'].returnNumericF();
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
      let f = components['/_function1'].returnNumericF();
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
      let f = components['/_function1'].returnNumericF();
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
      let f = components['/_function1'].returnNumericF();
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
      let f = components['/_function1'].returnNumericF();
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
      let f = components['/_function1'].returnNumericF();
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
      let f = components['/_function1'].returnNumericF();
      expect(f(-6)).closeTo(-1, 1E-12);
      expect(f(-2)).closeTo(-1+3*(-2+6), 1E-12);
      expect(f(-12)).closeTo(-1+3*(-12+6), 1E-12);
      expect(f(12)).closeTo(-1+3*(12+6), 1E-12);
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
    <through><slope><ref prop="value">_mathinput1</ref></slope>(-6,-1)</through>
    </function>
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let f = components['/_function1'].returnNumericF();
      expect(f(-6)).closeTo(-1, 1E-12);
      expect(f(-2)).closeTo(-1+0*(-2+6), 1E-12);
      expect(f(-12)).closeTo(-1+0*(-12+6), 1E-12);
      expect(f(12)).closeTo(-1+0*(12+6), 1E-12);
    })

    cy.get('#\\/_mathinput1_input').clear().type("2{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let f = components['/_function1'].returnNumericF();
      expect(f(-6)).closeTo(-1, 1E-12);
      expect(f(-2)).closeTo(-1+2*(-2+6), 1E-12);
      expect(f(-12)).closeTo(-1+2*(-12+6), 1E-12);
      expect(f(12)).closeTo(-1+2*(12+6), 1E-12);
    })

    cy.get('#\\/_mathinput1_input').clear().type("-3{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let f = components['/_function1'].returnNumericF();
      expect(f(-6)).closeTo(-1, 1E-12);
      expect(f(-2)).closeTo(-1-3*(-2+6), 1E-12);
      expect(f(-12)).closeTo(-1-3*(-12+6), 1E-12);
      expect(f(12)).closeTo(-1-3*(12+6), 1E-12);
    })

    cy.get('#\\/_mathinput1_input').clear().blur();
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let f = components['/_function1'].returnNumericF();
      expect(f(-6)).closeTo(-1, 1E-12);
      expect(f(-2)).closeTo(-1+0*(-2+6), 1E-12);
      expect(f(-12)).closeTo(-1+0*(-12+6), 1E-12);
      expect(f(12)).closeTo(-1+0*(12+6), 1E-12);
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
    <through><slope><ref prop="value">_mathinput1</ref></slope>(-6,-1),(3,8)</through>
    </function>
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log('with undefined slope, get line through points')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let f = components['/_function1'].returnNumericF();
      expect(f(-6)).closeTo(-1, 1E-12);
      expect(f(-2)).closeTo(-1+1*(-2+6), 1E-12);
      expect(f(-12)).closeTo(-1+1*(-12+6), 1E-12);
      expect(f(12)).closeTo(-1+1*(12+6), 1E-12);
    })

    cy.get('#\\/_mathinput1_input').clear().type("2{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let f = components['/_function1'].returnNumericF();
      expect(f(-6-0.01)).closeTo(-1-0.01*2, 1E-3);
      expect(f(-6)).closeTo(-1, 1E-12);
      expect(f(-6+0.01)).closeTo(-1+0.01*2, 1E-3);

      expect(f(3-0.01)).closeTo(8-0.01*2, 1E-3);
      expect(f(3)).closeTo(8, 1E-12);
      expect(f(3+0.01)).closeTo(8+0.01*2, 1E-3);

      // extrapolate linearly
      expect(f(-6-3)).closeTo(-1-3*2, 1E-12);
      expect(f(3+3)).closeTo(8+3*2, 1E-12);


    })

    cy.get('#\\/_mathinput1_input').clear().type("-3{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let f = components['/_function1'].returnNumericF();
      expect(f(-6-0.01)).closeTo(-1-0.01*(-3), 1E-3);
      expect(f(-6)).closeTo(-1, 1E-12);
      expect(f(-6+0.01)).closeTo(-1+0.01*(-3), 1E-3);

      expect(f(3-0.01)).closeTo(8-0.01*(-3), 1E-3);
      expect(f(3)).closeTo(8, 1E-12);
      expect(f(3+0.01)).closeTo(8+0.01*(-3), 1E-3);

      // extrapolate linearly
      expect(f(-6-3)).closeTo(-1-3*(-3), 1E-12);
      expect(f(3+3)).closeTo(8+3*(-3), 1E-12);

    })

    cy.get('#\\/_mathinput1_input').clear().blur();
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let f = components['/_function1'].returnNumericF();
      expect(f(-6)).closeTo(-1, 1E-12);
      expect(f(-2)).closeTo(-1+1*(-2+6), 1E-12);
      expect(f(-12)).closeTo(-1+1*(-12+6), 1E-12);
      expect(f(12)).closeTo(-1+1*(12+6), 1E-12);
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
      let f = components['/_function1'].returnNumericF();
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
      let f = components['/_function1'].returnNumericF();
      expect(f(-0.01)).closeTo(2-0.01*0.5, 1E-3)
      expect(f(0)).closeTo(2, 1E-12);
      expect(f(0.01)).closeTo(2+0.01*0.5, 1E-3)
    
      expect(f(2-0.01)).closeTo(1-0.01*2, 1E-3)
      expect(f(2)).closeTo(1, 1E-12);
      expect(f(2+0.01)).closeTo(1+0.01*2, 1E-3)

      expect(f(3-0.01)).closeTo(2-0.01*(-1), 1E-3)
      expect(f(3)).closeTo(2, 1E-12);
      expect(f(3+0.01)).closeTo(2+0.01*(-1), 1E-3)

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
      let f = components['/_function1'].returnNumericF();
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
      let f = components['/_function1'].returnNumericF();
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
      <constrainTo><ref>_function1</ref></constrainTo>
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

      let x = p.state.xs[0].evaluate_to_constant();
      let y = p.state.xs[1].evaluate_to_constant();

      expect(6 - (x - 5) * (x - 5) / 25).closeTo(y, 1E-5);

      p.movePoint({ x: -8, y: 8 });

      x = p.state.xs[0].evaluate_to_constant();
      y = p.state.xs[1].evaluate_to_constant();

      expect(6 - (x - 5) * (x - 5) / 25).closeTo(y, 1E-5);

      p.movePoint({ x: 8, y: 8 });

      x = p.state.xs[0].evaluate_to_constant();
      y = p.state.xs[1].evaluate_to_constant();

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
      let f = components['/_function1'].returnNumericF();

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
      let f = components['/_function1'].returnNumericF();

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
    <constrainTo><ref>_function1</ref></constrainTo>
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

      let x = p.state.xs[0].evaluate_to_constant();
      let y = p.state.xs[1].evaluate_to_constant();

      expect(Math.log(2 * x)).closeTo(y, 1E-5);

      p.movePoint({ x: 8, y: 8 });

      x = p.state.xs[0].evaluate_to_constant();
      y = p.state.xs[1].evaluate_to_constant();

      expect(Math.log(2 * x)).closeTo(y, 1E-5);

      p.movePoint({ x: -8, y: -8 });

      x = p.state.xs[0].evaluate_to_constant();
      y = p.state.xs[1].evaluate_to_constant();

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
      <ref>_point1</ref>
      <ref>_point2</ref>
      </through>

      <maximum><ref>_point3</ref></maximum>
      <minimum><ref>_point4</ref></minimum>
    </function>
    <ref prop="maxima">_function1</ref>
    <ref prop="minima">_function1</ref>
    </graph>

    <p>Number of maxima: <ref prop="numbermaxima">_function1</ref></p>
    <p>Maxima: <math simplify="none"><ref prop="maxima">_function1</ref></math></p>
    <p>Number of minima: <ref prop="numberminima">_function1</ref></p>
    <p>Minima: <math simplify="none"><ref prop="minima">_function1</ref></math></p>
    <p>Number of extrema: <ref prop="numberextrema">_function1</ref></p>
    <p>Extrema: <math simplify="none"><ref prop="extrema">_function1</ref></math></p>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#__number1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2');
    });
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−2.15,7)(5,6)');
    });
    cy.get('#__number2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2');
    });
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−5,6)(3,4)');
    });
    cy.get('#__number3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4');
    });
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−5,6)(−2.15,7)(3,4)(5,6)');
    });


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      components['/_point1'].movePoint({ x: 2, y: 2 });

      cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2');
      });
      cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−1.5,7)(5,6)');
      });
      cy.get('#__number2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2');
      });
      cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−5,6)(2,2)');
      });
      cy.get('#__number3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4');
      });
      cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−5,6)(−1.5,7)(2,2)(5,6)');
      });

    });

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      components['/_point1'].movePoint({ x: 3.6, y: 5.1 });

      cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3');
      });
      cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−1,7)(3.6,5.1)(5,6)');
      });
      cy.get('#__number2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3');
      });
      cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−5,6)(3,4)(4.3,5)');
      });
      cy.get('#__number3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('6');
      });
      cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−5,6)(−1,7)(3,4)(3.6,5.1)(4.3,5)(5,6)');
      });

    });

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      components['/_point1'].movePoint({ x: 8, y: 9 });

      cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2');
      });
      cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−1,7)(5,6)');
      });
      cy.get('#__number2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3');
      });
      cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−5,6)(3,4)(6.5,5)');
      });
      cy.get('#__number3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5');
      });
      cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−5,6)(−1,7)(3,4)(5,6)(6.5,5)');
      });

    });

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      components['/_point1'].movePoint({ x: 5, y: 2 });

      cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('0');
      });
      cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿');
      });
      cy.get('#__number2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('0');
      });
      cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿');
      });
      cy.get('#__number3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('0');
      });
      cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿');
      });

    });

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      components['/_point1'].movePoint({ x: -9, y: 0 });

      cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3');
      });
      cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−7,7)(−1,7)(5,6)');
      });
      cy.get('#__number2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2');
      });
      cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−5,6)(3,4)');
      });
      cy.get('#__number3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5');
      });
      cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−7,7)(−5,6)(−1,7)(3,4)(5,6)');
      });

    });


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      components['/_point4'].movePoint({ x: 8, y: 3 });

      cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1');
      });
      cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(5,6)');
      });
      cy.get('#__number2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1');
      });
      cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(8,3)');
      });
      cy.get('#__number3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2');
      });
      cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(5,6)(8,3)');
      });

    });

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      components['/_point4'].movePoint({ x: 8, y: 6 });

      cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2');
      });
      cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(5,6)(7,7)');
      });
      cy.get('#__number2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2');
      });
      cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(6,5)(8,6)');
      });
      cy.get('#__number3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4');
      });
      cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(5,6)(6,5)(7,7)(8,6)');
      });

    });

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
      <ref prop="y">_point1</ref>
      exp(-(x-<ref prop="x">_point1</ref>)^2)
      + 
      <ref prop="y">_point2</ref>
      exp(-(x-<ref prop="x">_point2</ref>)^2)
    </function>
    <ref prop="extrema">_function1</ref>
    </graph>
    
    <p>Number of maxima: <ref prop="numbermaxima">_function1</ref></p>
    <p>Maxima locations: <ref prop="maximumlocation1">_function1</ref>,
    <ref prop="maximumlocation2">_function1</ref></p>
    <p>Maxima values: <ref prop="maximumvalue1">_function1</ref>,
    <ref prop="maximumvalue2">_function1</ref></p>
    <p>Number of minima: <ref prop="numberminima">_function1</ref></p>
    <p>Minima locations: <ref prop="minimumlocation1">_function1</ref>,
    <ref prop="minimumlocation2">_function1</ref></p>
    <p>Minima values: <ref prop="minimumvalue1">_function1</ref>,
    <ref prop="minimumvalue2">_function1</ref></p>
    <p>Number of extrema: <ref prop="numberextrema">_function1</ref></p>
    <p>Extrema locations: <ref prop="extremumlocation1">_function1</ref>,
    <ref prop="extremumlocation2">_function1</ref>,
    <ref prop="extremumlocation3">_function1</ref></p>
    <p>Extrema values: <ref prop="extremumvalue1">_function1</ref>,
    <ref prop="extremumvalue2">_function1</ref>,
    <ref prop="extremumvalue3">_function1</ref></p>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#__number1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2');
    });
    cy.get('#__number2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text.replace(/−/, '-'))).closeTo(0, 0.01);
    });
    cy.get('#__number3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text.replace(/−/, '-'))).closeTo(3, 0.01);
    });
    cy.get('#__number4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text.replace(/−/, '-'))).closeTo(1, 0.01);
    });
    cy.get('#__number5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text.replace(/−/, '-'))).closeTo(1, 0.01);
    });

    cy.get('#__number6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1');
    });
    cy.get('#__number7').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text.replace(/−/, '-'))).closeTo(1.5, 0.01);
    });
    cy.get('#__number8').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text.replace(/−/, '-'))).closeTo(.21, 0.01);
    });

    cy.get('#__number9').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3');
    });
    cy.get('#__number10').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text.replace(/−/, '-'))).closeTo(0, 0.01);
    });
    cy.get('#__number11').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text.replace(/−/, '-'))).closeTo(1.5, 0.01);
    });
    cy.get('#__number12').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text.replace(/−/, '-'))).closeTo(3, 0.01);
    });
    cy.get('#__number13').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text.replace(/−/, '-'))).closeTo(1, 0.01);
    });
    cy.get('#__number14').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text.replace(/−/, '-'))).closeTo(.21, 0.01);
    });
    cy.get('#__number15').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text.replace(/−/, '-'))).closeTo(1, 0.01);
    });


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      components['/_point2'].movePoint({ x: 3, y: -1 });


      cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1');
      });
      cy.get('#__number2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text.replace(/−/, '-'))).closeTo(0, 0.01);
      });
      cy.get('#__number3').should('not.exist');
      cy.get('#__number4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text.replace(/−/, '-'))).closeTo(1, 0.01);
      });
      cy.get('#__number5').should('not.exist');

      cy.get('#__number6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1');
      });
      cy.get('#__number7').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text.replace(/−/, '-'))).closeTo(3, 0.01);
      });
      cy.get('#__number8').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text.replace(/−/, '-'))).closeTo(-1, 0.01);
      });


      cy.get('#__number9').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2');
      });
      cy.get('#__number10').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text.replace(/−/, '-'))).closeTo(0, 0.01);
      });
      cy.get('#__number11').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text.replace(/−/, '-'))).closeTo(3, 0.01);
      });
      cy.get('#__number12').should('not.exist');
      cy.get('#__number13').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text.replace(/−/, '-'))).closeTo(1, 0.01);
      });
      cy.get('#__number14').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text.replace(/−/, '-'))).closeTo(-1, 0.01);
      });
      cy.get('#__number15').should('not.exist');

    });


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      components['/_point1'].movePoint({ x: 0, y: -1 });

      cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1');
      });
      cy.get('#__number2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text.replace(/−/, '-'))).closeTo(1.5, 0.01);
      });
      cy.get('#__number3').should('not.exist');
      cy.get('#__number4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text.replace(/−/, '-'))).closeTo(-0.21, 0.01);
      });
      cy.get('#__number5').should('not.exist');

      cy.get('#__number6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2');
      });
      cy.get('#__number7').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text.replace(/−/, '-'))).closeTo(0, 0.01);
      });
      cy.get('#__number16').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text.replace(/−/, '-'))).closeTo(3, 0.01);
      });
      cy.get('#__number8').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text.replace(/−/, '-'))).closeTo(-1, 0.01);
      });
      cy.get('#__number17').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text.replace(/−/, '-'))).closeTo(-1, 0.01);
      });

      cy.get('#__number9').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3');
      });
      cy.get('#__number10').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text.replace(/−/, '-'))).closeTo(0, 0.01);
      });
      cy.get('#__number11').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text.replace(/−/, '-'))).closeTo(1.5, 0.01);
      });
      cy.get('#__number12').should('not.exist');
      cy.get('#__number18').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text.replace(/−/, '-'))).closeTo(3, 0.01);
      });
      cy.get('#__number13').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text.replace(/−/, '-'))).closeTo(-1, 0.01);
      });
      cy.get('#__number14').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text.replace(/−/, '-'))).closeTo(-0.21, 0.01);
      });
      cy.get('#__number15').should('not.exist');
      cy.get('#__number19').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text.replace(/−/, '-'))).closeTo(-1, 0.01);
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
    <function>sin(2*pi*x/<ref prop="value">_mathinput1</ref>)</function>
    <ref prop="extrema">_function1</ref>
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let f = components['/_function1'];

      expect(f.state.numbermaxima).eq(0);
      expect(f.state.numberminima).eq(0);
      expect(f.state.numberextrema).eq(0);

    });

    cy.get('#\\/_mathinput1_input').clear().type("10{enter}");

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let period = 10;

      let f = components['/_function1'];

      expect(f.state.numbermaxima).eq(200 / period);

      let maximalocations = f.state.maximalocations;
      for (let m of maximalocations) {
        expect(((m % period) + period) % period).closeTo(period / 4, 0.0001);
      }

      let maximavalues = f.state.maximavalues;
      for (let m of maximavalues) {
        expect(m).closeTo(1, 0.0001);
      }

      expect(f.state.numberminima).eq(200 / period);

      let minimalocations = f.state.minimalocations;
      for (let m of minimalocations) {
        expect(((m % period) + period) % period).closeTo(3 * period / 4, 0.0001);
      }

      let minimavalues = f.state.minimavalues;
      for (let m of minimavalues) {
        expect(m).closeTo(-1, 0.0001);
      }

      expect(f.state.numberextrema).eq(400 / period);

      let extremalocations = f.state.minimalocations;
      for (let m of extremalocations) {
        expect(((m % (period / 2)) + (period / 2)) % (period / 2)).closeTo(period / 4, 0.0001);
      }

      let extremavalues = f.state.minimavalues;
      for (let m of extremavalues) {
        expect(Math.abs(m)).closeTo(1, 0.0001);
      }

    });

    cy.get('#\\/_mathinput1_input').clear().type("5{enter}");

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let period = 5;

      let f = components['/_function1'];

      expect(f.state.numbermaxima).eq(200 / period);

      let maximalocations = f.state.maximalocations;
      for (let m of maximalocations) {
        expect(((m % period) + period) % period).closeTo(period / 4, 0.0001);
      }

      let maximavalues = f.state.maximavalues;
      for (let m of maximavalues) {
        expect(m).closeTo(1, 0.0001);
      }

      expect(f.state.numberminima).eq(200 / period);

      let minimalocations = f.state.minimalocations;
      for (let m of minimalocations) {
        expect(((m % period) + period) % period).closeTo(3 * period / 4, 0.0001);
      }

      let minimavalues = f.state.minimavalues;
      for (let m of minimavalues) {
        expect(m).closeTo(-1, 0.0001);
      }

      expect(f.state.numberextrema).eq(400 / period);

      let extremalocations = f.state.minimalocations;
      for (let m of extremalocations) {
        expect(((m % (period / 2)) + (period / 2)) % (period / 2)).closeTo(period / 4, 0.0001);
      }

      let extremavalues = f.state.minimavalues;
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
    <ref prop="minima">_function1</ref>
    <ref prop="maxima">_function1</ref>
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let f = components['/_function1'];

      expect(f.state.numbermaxima).eq(0);
      expect(f.state.numberminima).eq(0);
      expect(f.state.numberextrema).eq(0);

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
    <ref prop="extrema">_function1</ref>
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

      expect(f.state.numbermaxima).eq(3);
      expect(f.state.numberminima).eq(1);
      expect(f.state.numberextrema).eq(4);

      expect(f.state.minimavalues[0]).closeTo(minimaValues[0], 0.000001);
      expect(f.state.minimalocations[0]).closeTo(minimaLocations[0], 0.000001);
      for (let i in maximaLocations) {
        expect(f.state.maximavalues[i]).closeTo(maximaValues[i], 0.000001);
        expect(f.state.maximalocations[i]).closeTo(maximaLocations[i], 0.000001);
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
    <ref prop="extrema">_function1</ref>
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let f = components['/_function1'];
      expect(f.state.numbermaxima).eq(0);
      expect(f.state.numberminima).eq(0);
      expect(f.state.numberextrema).eq(0);

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
    <ref prop="extrema">_function1</ref>
    </graph>

    <ref prop="extremalocations">_function1</ref>,
    <ref prop="extremavalues">_function1</ref>

    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let f = components['/_function1'];
      expect(f.state.numbermaxima).eq(1);
      expect(f.state.numberminima).eq(0);
      expect(f.state.numberextrema).eq(1);

      expect(f.state.maximalocations[0]).closeTo(2.614, 0.001);
      expect(f.state.maximavalues[0]).closeTo(3.820, 0.001);

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
      <maximum>(<ref prop="numbermaxima">_function2</ref>,
      <ref prop="numberminima">_function2</ref>)
      </maximum>
      <through >(-8,5),(9,10)</through>
    </function>
    
    <function>
      <yscale><ref prop="yscale">_function1</ref></yscale>
      <through>
        <ref>_point1</ref>
        <ref>_point2</ref>
        <ref>_point3</ref>
        <ref>_point4</ref>
      </through>
      <maximum>x=0</maximum>
    </function>
    </graph>
    
    <p>Number of maxima: <ref prop="numbermaxima">_function2</ref></p>
    <p>Number of minima: <ref prop="numberminima">_function2</ref></p>
    
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let f1 = components['/_function1'];
      let f2 = components['/_function2'];
      expect(f1.state.numbermaxima).eq(1);
      expect(f1.state.numberminima).eq(2);
      expect(f1.state.numberextrema).eq(3);
      expect(f2.state.numbermaxima).eq(2);
      expect(f2.state.numberminima).eq(1);
      expect(f2.state.numberextrema).eq(3);

      expect(f1.state.maximalocations[0]).eq(2);
      expect(f1.state.maximavalues[0]).eq(1);
      
      expect(f1.state.xscale).eq(1);
      expect(f1.state.yscale).eq(5);
      expect(f2.state.xscale).eq(1);
      expect(f2.state.yscale).eq(5);

    });

    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    })
    cy.get('#__number2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      components['/_point1'].movePoint({x: 2, y: 6})
      
      let f1 = components['/_function1'];
      let f2 = components['/_function2'];
      expect(f1.state.numbermaxima).eq(1);
      expect(f1.state.numberminima).eq(2);
      expect(f1.state.numberextrema).eq(3);
      expect(f2.state.numbermaxima).eq(1);
      expect(f2.state.numberminima).eq(0);
      expect(f2.state.numberextrema).eq(1);

      expect(f1.state.maximalocations[0]).eq(1);
      expect(f1.state.maximavalues[0]).eq(0);

    });

    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
    cy.get('#__number2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      components['/_point2'].movePoint({x: 3, y: 7})
      components['/_point3'].movePoint({x: 9, y: 0})
      
      let f1 = components['/_function1'];
      let f2 = components['/_function2'];
      expect(f1.state.numbermaxima).eq(1);
      expect(f1.state.numberminima).eq(2);
      expect(f1.state.numberextrema).eq(3);
      expect(f2.state.numbermaxima).eq(2);
      expect(f2.state.numberminima).eq(2);
      expect(f2.state.numberextrema).eq(4);

      expect(f1.state.maximalocations[0]).eq(2);
      expect(f1.state.maximavalues[0]).eq(2);

    });

    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    })
    cy.get('#__number2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    })



  });



});
