import me from 'math-expressions';
import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('Function Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')
  })

  it('function with nothing', () => {
    cy.window().then(async (win) => {
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

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let f = (await components['/_function1'].stateValues.fs)[0];
      expect(f(0)).closeTo(0, 1E-12);
      expect(f(1)).closeTo(0, 1E-12);
      expect(f(2)).closeTo(0, 1E-12);
      expect(f(-1)).closeTo(0, 1E-12);
      expect(f(-2)).closeTo(0, 1E-12);


    })

  });

  it('function with single minimum as number', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function minima="(2)" />
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let f = (await components['/_function1'].stateValues.fs)[0];
      expect(f(0)).closeTo(2, 1E-12);
      expect(f(1)).closeTo(2 + 1, 1E-12);
      expect(f(2)).closeTo(2 + 4, 1E-12);
      expect(f(-1)).closeTo(2 + 1, 1E-12);
      expect(f(-2)).closeTo(2 + 4, 1E-12);

    })

  });

  it('function with single minimum as half-empty tuple', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function minima="( ,2)" />
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let f = (await components['/_function1'].stateValues.fs)[0];
      expect(f(0)).closeTo(2, 1E-12);
      expect(f(1)).closeTo(2 + 1, 1E-12);
      expect(f(2)).closeTo(2 + 4, 1E-12);
      expect(f(-1)).closeTo(2 + 1, 1E-12);
      expect(f(-2)).closeTo(2 + 4, 1E-12);

    })

  });

  it('function with single minimum as half-empty tuple (no space)', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function minima="(,2)" />
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let f = (await components['/_function1'].stateValues.fs)[0];
      expect(f(0)).closeTo(2, 1E-12);
      expect(f(1)).closeTo(2 + 1, 1E-12);
      expect(f(2)).closeTo(2 + 4, 1E-12);
      expect(f(-1)).closeTo(2 + 1, 1E-12);
      expect(f(-2)).closeTo(2 + 4, 1E-12);

    })

  });

  it('function with single minimum, change x-scale', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function xscale="3" minima="(2)" />
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let f = (await components['/_function1'].stateValues.fs)[0];
      expect(f(0)).closeTo(2, 1E-12);
      expect(f(3)).closeTo(2 + 1, 1E-12);
      expect(f(6)).closeTo(2 + 4, 1E-12);
      expect(f(-3)).closeTo(2 + 1, 1E-12);
      expect(f(-6)).closeTo(2 + 4, 1E-12);

    })

  });

  it('function with single minimum, change x-scale and y-scale', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function xscale="3" yscale="5" minima="(2)" />
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let f = (await components['/_function1'].stateValues.fs)[0];
      expect(f(0)).closeTo(2, 1E-12);
      expect(f(3)).closeTo(2 + 1 * 5, 1E-12);
      expect(f(6)).closeTo(2 + 4 * 5, 1E-12);
      expect(f(-3)).closeTo(2 + 1 * 5, 1E-12);
      expect(f(-6)).closeTo(2 + 4 * 5, 1E-12);

    })

  });

  it('function with single maximum', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function maxima="(3)" />
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let f = (await components['/_function1'].stateValues.fs)[0];
      expect(f(0)).closeTo(3, 1E-12);
      expect(f(1)).closeTo(3 - 1, 1E-12);
      expect(f(2)).closeTo(3 - 4, 1E-12);
      expect(f(-1)).closeTo(3 - 1, 1E-12);
      expect(f(-2)).closeTo(3 - 4, 1E-12);

    })

  });

  it('function with single maximum, change x-scale', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function xscale="3" maxima="(3)" />
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let f = (await components['/_function1'].stateValues.fs)[0];
      expect(f(0)).closeTo(3, 1E-12);
      expect(f(3)).closeTo(3 - 1, 1E-12);
      expect(f(6)).closeTo(3 - 4, 1E-12);
      expect(f(-3)).closeTo(3 - 1, 1E-12);
      expect(f(-6)).closeTo(3 - 4, 1E-12);

    })

  });

  it('function with single maximum, change x-scale and y-scale', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function xscale="3" yscale="5" maxima="(3)" />
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let f = (await components['/_function1'].stateValues.fs)[0];
      expect(f(0)).closeTo(3, 1E-12);
      expect(f(3)).closeTo(3 - 1 * 5, 1E-12);
      expect(f(6)).closeTo(3 - 4 * 5, 1E-12);
      expect(f(-3)).closeTo(3 - 1 * 5, 1E-12);
      expect(f(-6)).closeTo(3 - 4 * 5, 1E-12);

    })

  });

  it('function with single minimum, specify location as half-empty tuple', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function minima="(2, )" />
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let f = (await components['/_function1'].stateValues.fs)[0];
      expect(f(0)).closeTo(4, 1E-12);
      expect(f(1)).closeTo(1, 1E-12);
      expect(f(2)).closeTo(0, 1E-12);
      expect(f(3)).closeTo(1, 1E-12);
      expect(f(4)).closeTo(4, 1E-12);
    })
  });

  it('function with single minimum, specify location as half-empty tuple (no space)', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function minima="(2,)" />
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let f = (await components['/_function1'].stateValues.fs)[0];
      expect(f(0)).closeTo(4, 1E-12);
      expect(f(1)).closeTo(1, 1E-12);
      expect(f(2)).closeTo(0, 1E-12);
      expect(f(3)).closeTo(1, 1E-12);
      expect(f(4)).closeTo(4, 1E-12);
    })
  });

  it('function with single minimum, specify location and value as tuple', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function minima="(2, -3)" />
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let f = (await components['/_function1'].stateValues.fs)[0];
      expect(f(0)).closeTo(4 - 3, 1E-12);
      expect(f(1)).closeTo(1 - 3, 1E-12);
      expect(f(2)).closeTo(0 - 3, 1E-12);
      expect(f(3)).closeTo(1 - 3, 1E-12);
      expect(f(4)).closeTo(4 - 3, 1E-12);
    })
  });

  it('function with single extremum, specify location and value as tuple', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function extrema="(2, -3)" />
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let f = (await components['/_function1'].stateValues.fs)[0];
      expect(f(0)).closeTo(-4 - 3, 1E-12);
      expect(f(1)).closeTo(-1 - 3, 1E-12);
      expect(f(2)).closeTo(0 - 3, 1E-12);
      expect(f(3)).closeTo(-1 - 3, 1E-12);
      expect(f(4)).closeTo(-4 - 3, 1E-12);
    })
  });

  it('function with min and max', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function minima="(0,0)" maxima="(1,1)" />
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let f = (await components['/_function1'].stateValues.fs)[0];
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
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function minima="(0,0)" extrema="(1,1)" />
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let f = (await components['/_function1'].stateValues.fs)[0];
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
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function extrema="(0,0)" maxima="(1,1)" />
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let f = (await components['/_function1'].stateValues.fs)[0];
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

  it('function two extrema, same height', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function extrema="(0,0) (1,0)" />
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let f = (await components['/_function1'].stateValues.fs)[0];
      expect(f(0)).closeTo(0, 1E-12);
      expect(f(1)).closeTo(0, 1E-12);
      expect(f(0.5)).closeTo(-1, 1E-12);
      // like parabola to left of maximum
      expect(f(-1)).closeTo(-1, 1E-12);
      expect(f(-2)).closeTo(-4, 1E-12);
      expect(f(-3)).closeTo(-9, 1E-12);
      // like parabola to right of maximum
      expect(f(2)).closeTo(-1, 1E-12);
      expect(f(3)).closeTo(-4, 1E-12);
      expect(f(4)).closeTo(-9, 1E-12);
    })
  });

  it('function two extrema, second higher', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function extrema="(0,0) (1,2)" />
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let f = (await components['/_function1'].stateValues.fs)[0];
      expect(f(0)).closeTo(0, 1E-12);
      expect(f(1)).closeTo(2, 1E-12);
      expect(f(0.5)).closeTo(1, 1E-12);
      // like parabola to left of minimum
      expect(f(-1)).closeTo(1, 1E-12);
      expect(f(-2)).closeTo(4, 1E-12);
      expect(f(-3)).closeTo(9, 1E-12);
      // like parabola to right of maximum
      expect(f(2)).closeTo(1, 1E-12);
      expect(f(3)).closeTo(-2, 1E-12);
      expect(f(4)).closeTo(-7, 1E-12);
    })
  });

  it('function two extrema, second lower', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function extrema="(0,0) (1,-2)" />
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let f = (await components['/_function1'].stateValues.fs)[0];
      expect(f(0)).closeTo(0, 1E-12);
      expect(f(1)).closeTo(-2, 1E-12);
      expect(f(0.5)).closeTo(-1, 1E-12);
      // like parabola to left of maximum
      expect(f(-1)).closeTo(-1, 1E-12);
      expect(f(-2)).closeTo(-4, 1E-12);
      expect(f(-3)).closeTo(-9, 1E-12);
      // like parabola to right of minimum
      expect(f(2)).closeTo(-1, 1E-12);
      expect(f(3)).closeTo(2, 1E-12);
      expect(f(4)).closeTo(7, 1E-12);
    })
  });

  it('function with two minima', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function minima='(-2, ) (2, 1)' />
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let f = (await components['/_function1'].stateValues.fs)[0];
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
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function minima="(-2, )  (2,1)" maxima="( , 5)" />
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let f = (await components['/_function1'].stateValues.fs)[0];
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
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function minima="(-2,) (2, 1) " extrema="(,5)" />
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let f = (await components['/_function1'].stateValues.fs)[0];
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
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function maxima="(-2,1)" minima="(2,2)" />
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let f = (await components['/_function1'].stateValues.fs)[0];
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
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function maxima="(-2,1)" extrema="(2,2)" />
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let f = (await components['/_function1'].stateValues.fs)[0];
      expect(f(-2)).closeTo(1, 1E-12);
      expect(f(-3)).closeTo(0, 1E-12);
      expect(f(0)).closeTo(0, 1E-12);

      expect(f(2)).closeTo(2, 1E-12);
      expect(f(3)).closeTo(1, 1E-12);
    })
  });

  it('function with minimum and lower maximum', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function minima="(-2,3)" maxima="(2,2)" />
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let f = (await components['/_function1'].stateValues.fs)[0];
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
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function minima="(-2,3)" extrema="(2,2)" />
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let f = (await components['/_function1'].stateValues.fs)[0];
      expect(f(-2)).closeTo(3, 1E-12);
      expect(f(-3)).closeTo(4, 1E-12);
      expect(f(0)).closeTo(4, 1E-12);

      expect(f(2)).closeTo(2, 1E-12);
      expect(f(3)).closeTo(3, 1E-12);
    })
  });

  it('function with extremum and lower maximum', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function extrema="(-2,3)" maxima="(2,2)" />
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let f = (await components['/_function1'].stateValues.fs)[0];
      expect(f(-2)).closeTo(3, 1E-12);
      expect(f(-3)).closeTo(2, 1E-12);
      expect(f(0)).closeTo(1, 1E-12);

      expect(f(2)).closeTo(2, 1E-12);
      expect(f(3)).closeTo(1, 1E-12);
    })
  });

  it('functions with copied extrema that overwrite attributes', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <extremum name="ex1" location="3" value="-2" />
    <copy target="ex1" location="5" assignNames="ex2" />
    <copy target="ex1" value="2" assignNames="ex3" />
    
    <graph>
      <function extrema="$ex1 $ex2" />
      <function extrema="$ex2 $ex3" />
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let f = (await components['/_function1'].stateValues.fs)[0];
      expect(f(3)).closeTo(-2, 1E-12);
      expect(f(5)).closeTo(-2, 1E-12);

      expect(f(2)).closeTo(-3, 1E-12);
      expect(f(4)).closeTo(-3, 1E-12);
      expect(f(6)).closeTo(-3, 1E-12);

      let g = (await components['/_function2'].stateValues.fs)[0];
      expect(g(3)).closeTo(2, 1E-12);
      expect(g(5)).closeTo(-2, 1E-12);

      expect(g(2)).closeTo(1, 1E-12);
      expect(g(4)).closeTo(0, 1E-12);
      expect(g(6)).closeTo(-1, 1E-12);

    })
  });

  it('copy function and overwrite extrema', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
      <function minima="(2,3)" maxima="(4,4)" name="f" />
      <copy target="f" maxima="(0,4)" assignNames="g" styleNumber="2" />
      <copy target="f" minima="(6,3)" assignNames="h" styleNumber="3" />
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let f = (await components['/f'].stateValues.fs)[0];
      expect(f(2)).closeTo(3, 1E-12);
      expect(f(4)).closeTo(4, 1E-12);

      expect(f(1)).closeTo(4, 1E-12);
      expect(f(3)).closeTo(3.5, 1E-12);
      expect(f(5)).closeTo(3, 1E-12);

      let g = (await components['/g'].stateValues.fs)[0];
      expect(g(0)).closeTo(4, 1E-12);
      expect(g(2)).closeTo(3, 1E-12);

      expect(g(-1)).closeTo(3, 1E-12);
      expect(g(1)).closeTo(3.5, 1E-12);
      expect(g(3)).closeTo(4, 1E-12);

      let h = (await components['/h'].stateValues.fs)[0];
      expect(h(4)).closeTo(4, 1E-12);
      expect(h(6)).closeTo(3, 1E-12);

      expect(h(3)).closeTo(3, 1E-12);
      expect(h(5)).closeTo(3.5, 1E-12);
      expect(h(7)).closeTo(4, 1E-12);

    })
  });

  it('function with maximum through points', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function maxima="(-2,2)" through="(-5,0) (-6,-1)(0,0) (1,0)" />
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let f = (await components['/_function1'].stateValues.fs)[0];
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
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function through="(-6,-1)" />
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let f = (await components['/_function1'].stateValues.fs)[0];
      expect(f(-6)).closeTo(-1, 1E-12);
      expect(f(-2)).closeTo(-1, 1E-12);
      expect(f(-12)).closeTo(-1, 1E-12);
      expect(f(12)).closeTo(-1, 1E-12);
    })
  });

  it('function with single through point with slope', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function through="(-6,-1)" throughSlopes="3" />
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let f = (await components['/_function1'].stateValues.fs)[0];
      expect(f(-6)).closeTo(-1, 1E-12);
      expect(f(-2)).closeTo(-1 + 3 * (-2 + 6), 1E-12);
      expect(f(-12)).closeTo(-1 + 3 * (-12 + 6), 1E-12);
      expect(f(12)).closeTo(-1 + 3 * (12 + 6), 1E-12);
    })
  });

  it('function with single through point with dynamic slope', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>slope: <mathinput/></p>
    <graph>
    <function throughSlopes="$_mathinput1" through="(-6,-1)" />
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let f = (await components['/_function1'].stateValues.fs)[0];
      expect(f(-6)).closeTo(-1, 1E-12);
      expect(f(-2)).closeTo(-1 + 0 * (-2 + 6), 1E-12);
      expect(f(-12)).closeTo(-1 + 0 * (-12 + 6), 1E-12);
      expect(f(12)).closeTo(-1 + 0 * (12 + 6), 1E-12);
    })

    cy.get('#\\/_mathinput1 textarea').type("2{enter}", { force: true });
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let f = (await components['/_function1'].stateValues.fs)[0];
      expect(f(-6)).closeTo(-1, 1E-12);
      expect(f(-2)).closeTo(-1 + 2 * (-2 + 6), 1E-12);
      expect(f(-12)).closeTo(-1 + 2 * (-12 + 6), 1E-12);
      expect(f(12)).closeTo(-1 + 2 * (12 + 6), 1E-12);
    })

    cy.get('#\\/_mathinput1 textarea').type("{end}{backspace}-3{enter}", { force: true });
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let f = (await components['/_function1'].stateValues.fs)[0];
      expect(f(-6)).closeTo(-1, 1E-12);
      expect(f(-2)).closeTo(-1 - 3 * (-2 + 6), 1E-12);
      expect(f(-12)).closeTo(-1 - 3 * (-12 + 6), 1E-12);
      expect(f(12)).closeTo(-1 - 3 * (12 + 6), 1E-12);
    })

    cy.get('#\\/_mathinput1 textarea').type("{end}{backspace}{backspace}", { force: true }).blur();
    cy.wait(100);
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let f = (await components['/_function1'].stateValues.fs)[0];
      expect(f(-6)).closeTo(-1, 1E-12);
      expect(f(-2)).closeTo(-1 + 0 * (-2 + 6), 1E-12);
      expect(f(-12)).closeTo(-1 + 0 * (-12 + 6), 1E-12);
      expect(f(12)).closeTo(-1 + 0 * (12 + 6), 1E-12);
    })


  });

  it('function with two through points with dynamic slope', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>slope: <mathinput/></p>
    <graph>
    <function throughSlopes="$_mathinput1 $_mathinput1" through="(-6,-1) (3,8)" />
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log('with undefined slope, get line through points')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let f = (await components['/_function1'].stateValues.fs)[0];
      expect(f(-6)).closeTo(-1, 1E-12);
      expect(f(-2)).closeTo(-1 + 1 * (-2 + 6), 1E-12);
      expect(f(-12)).closeTo(-1 + 1 * (-12 + 6), 1E-12);
      expect(f(12)).closeTo(-1 + 1 * (12 + 6), 1E-12);
    })

    cy.get('#\\/_mathinput1 textarea').type("2{enter}", { force: true });
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let f = (await components['/_function1'].stateValues.fs)[0];
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

    cy.get('#\\/_mathinput1 textarea').type("{end}{backspace}-3{enter}", { force: true });
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let f = (await components['/_function1'].stateValues.fs)[0];
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

    cy.get('#\\/_mathinput1 textarea').type("{end}{backspace}{backspace}", { force: true }).blur();
    cy.wait(100)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let f = (await components['/_function1'].stateValues.fs)[0];
      expect(f(-6)).closeTo(-1, 1E-12);
      expect(f(-2)).closeTo(-1 + 1 * (-2 + 6), 1E-12);
      expect(f(-12)).closeTo(-1 + 1 * (-12 + 6), 1E-12);
      expect(f(12)).closeTo(-1 + 1 * (12 + 6), 1E-12);
    })


  });

  it('function through three points', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function through="(0,2) (2,1) (3,2)" />
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let f = (await components['/_function1'].stateValues.fs)[0];
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
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <point>(2,1)</point>
    <function through="(0,2) (2,1) (3,2)" throughSlopes="0.5 2 -1" />
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let f = (await components['/_function1'].stateValues.fs)[0];
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
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function through="(0,2) (2,1) (2,2)" />
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let f = (await components['/_function1'].stateValues.fs)[0];
      assert.isNaN(f(0));
      assert.isNaN(f(1));
      assert.isNaN(f(2));
    })
  });

  it('copy function and overwrite through points and slopes', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function through="(0,2) (2,1) (3,2)" name="f" styleNumber="1" />
    <copy target="f" through="(1,5) (4,2)" assignNames="g" styleNumber="2" />
    <copy target="f" throughslopes="1 2 -3" assignNames="h" styleNumber="3" />
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let f = (await components['/f'].stateValues.fs)[0];
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

      let g = (await components['/g'].stateValues.fs)[0];
      expect(g(1)).closeTo(5, 1E-12);
      expect(g(4)).closeTo(2, 1E-12);
      // linear function
      slope = g(1) - g(0)
      expect(g(2)).closeTo(5 + slope * 1, 1E-12);
      expect(g(3)).closeTo(5 + slope * 2, 1E-12);
      expect(g(4)).closeTo(5 + slope * 3, 1E-12);
      expect(g(0)).closeTo(5 + slope * -1, 1E-12);
      expect(g(-1)).closeTo(5 + slope * -2, 1E-12);
      expect(g(-2)).closeTo(5 + slope * -3, 1E-12);

      let h = (await components['/h'].stateValues.fs)[0];
      expect(h(0)).closeTo(2, 1E-12);
      expect(h(2)).closeTo(1, 1E-12);
      expect(h(3)).closeTo(2, 1E-12);
      // extrapolate linearly at given slopes
      slope = -3
      expect(h(5)).closeTo(2 + slope * 2, 1E-12);
      expect(h(6)).closeTo(2 + slope * 3, 1E-12);
      expect(h(7)).closeTo(2 + slope * 4, 1E-12);
      slope = 1
      expect(h(-2)).closeTo(2 - slope * 2, 1E-12);
      expect(h(-3)).closeTo(2 - slope * 3, 1E-12);
      expect(h(-4)).closeTo(2 - slope * 4, 1E-12);
      // close to given slope near middle point
      slope = 2;
      expect(h(2.0001)).closeTo(1 + slope * 0.0001, 1E-7)
      expect(h(1.9999)).closeTo(1 + slope * -0.0001, 1E-7)

    })
  });

  it('check monotonicity', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function through="(-5,0) (-4,0.1) (-3,0.3) (-2,3) (-1,3.1) (0,3.2) (1,5)" maxima="(6,6)" />
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let f = (await components['/_function1'].stateValues.fs)[0];
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
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function maxima="(5,6)" through="(0,5) (8,4)" />

    <point x="1" y="2">
      <constraints>
        <constrainTo><copy target="_function1" /></constrainTo>
      </constraints>
    </point>
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let p = components['/_point1'];

      let x = p.stateValues.xs[0].evaluate_to_constant();
      let y = p.stateValues.xs[1].evaluate_to_constant();

      expect(6 - (x - 5) * (x - 5) / 25).closeTo(y, 1E-5);

      await p.movePoint({ x: -8, y: 8 });

      x = p.stateValues.xs[0].evaluate_to_constant();
      y = p.stateValues.xs[1].evaluate_to_constant();

      expect(6 - (x - 5) * (x - 5) / 25).closeTo(y, 1E-5);

      await p.movePoint({ x: 8, y: 8 });

      x = p.stateValues.xs[0].evaluate_to_constant();
      y = p.stateValues.xs[1].evaluate_to_constant();

      expect(6 - (x - 5) * (x - 5) * (2 / 9)).closeTo(y, 1E-5);

    })
  });

  it('point constrained to function, symbolic initial x', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function name="f">x^2</function>
    <point x="sqrt(2)" y="1" >
      <constraints>
        <constrainTo>
          $f
        </constrainTo>
      </constraints>
    </point>
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let p = components['/_point1'];

      expect(p.stateValues.xs[0].evaluate_to_constant()).closeTo(Math.sqrt(2), 1E-6)
      expect(p.stateValues.xs[1].evaluate_to_constant()).closeTo(2, 1E-6)

      await p.movePoint({ x: -2, y: 2 });
      expect(p.stateValues.xs[0].evaluate_to_constant()).closeTo(-2, 1E-6)
      expect(p.stateValues.xs[1].evaluate_to_constant()).closeTo(4, 1E-6)

    })
  });

  it('point constrained to function, restrict domain', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function maxima="(5,6)" through="(0,5) (8,4)" domain="(-4,7)" />

    <point x="1" y="2">
      <constraints>
        <constrainTo><copy target="_function1" /></constrainTo>
      </constraints>
    </point>
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let p = components['/_point1'];

      let x = p.stateValues.xs[0].evaluate_to_constant();
      let y = p.stateValues.xs[1].evaluate_to_constant();

      expect(x).closeTo(1, 1E-12);
      expect(6 - (x - 5) * (x - 5) / 25).closeTo(y, 1E-5);

      await p.movePoint({ x: -8, y: 8 });

      x = p.stateValues.xs[0].evaluate_to_constant();
      y = p.stateValues.xs[1].evaluate_to_constant();

      expect(x).closeTo(-4, 1E-12);
      expect(6 - (x - 5) * (x - 5) / 25).closeTo(y, 1E-5);

      await p.movePoint({ x: 6, y: 8 });

      x = p.stateValues.xs[0].evaluate_to_constant();
      y = p.stateValues.xs[1].evaluate_to_constant();

      expect(x).closeTo(6, 1E-12);
      expect(6 - (x - 5) * (x - 5) * (2 / 9)).closeTo(y, 1E-5);

      await p.movePoint({ x: 8, y: -4 });

      x = p.stateValues.xs[0].evaluate_to_constant();
      y = p.stateValues.xs[1].evaluate_to_constant();

      expect(x).closeTo(7, 1E-12);
      expect(6 - (x - 5) * (x - 5) * (2 / 9)).closeTo(y, 1E-5);

    })
  });

  it('point constrained to function with restricted domain, not explicit', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function name="f">sqrt(x)sqrt(5-x)</function>
    <point x="1" y="2">
      <constraints>
        <constrainTo>
          $f
        </constrainTo>
      </constraints>
    </point>
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');
    let f = x => Math.sqrt(x) * Math.sqrt(5 - x);

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let p = components['/_point1'];
      expect(p.stateValues.xs[0].evaluate_to_constant()).closeTo(1, 1E-6)
      expect(p.stateValues.xs[1].evaluate_to_constant()).closeTo(f(1), 1E-6)


      await p.movePoint({ x: -1, y: 8 });

      let x = p.stateValues.xs[0].evaluate_to_constant();
      let y = p.stateValues.xs[1].evaluate_to_constant();

      expect(y).closeTo(f(x), 1E-6)

      await p.movePoint({ x: 6, y: 8 });

      x = p.stateValues.xs[0].evaluate_to_constant();
      y = p.stateValues.xs[1].evaluate_to_constant();

      expect(y).closeTo(f(x), 1E-6)

      await p.movePoint({ x: 8, y: -4 });

      x = p.stateValues.xs[0].evaluate_to_constant();
      y = p.stateValues.xs[1].evaluate_to_constant();

      expect(y).closeTo(f(x), 1E-6)


      await p.movePoint({ x: -1, y: -6 });

      x = p.stateValues.xs[0].evaluate_to_constant();
      y = p.stateValues.xs[1].evaluate_to_constant();

      expect(y).closeTo(f(x), 1E-6)

    })
  });

  it('function determined by formula via sugar', () => {
    cy.window().then(async (win) => {
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

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(await components['/_function1'].stateValues.nInputs).eq(1);

      let f = (await components['/_function1'].stateValues.fs)[0];
      let numericalf = (await components['/_function1'].stateValues.numericalfs)[0];
      let symbolicf = (await components['/_function1'].stateValues.symbolicfs)[0];

      expect(f(-5)).closeTo(3 / (1 + Math.exp(5 / 2)), 1E-12);
      expect(f(1)).closeTo(3 / (1 + Math.exp(-1 / 2)), 1E-12);
      expect(numericalf(-5)).closeTo(3 / (1 + Math.exp(5 / 2)), 1E-12);
      expect(numericalf(1)).closeTo(3 / (1 + Math.exp(-1 / 2)), 1E-12);
      expect(symbolicf(-5).equals(me.fromText('3/(1+e^(5/2))'))).eq(true)
      expect(symbolicf(1).equals(me.fromText('3/(1+e^(-1/2))'))).eq(true)
      expect(symbolicf('z').equals(me.fromText('3/(1+e^(-z/2))'))).eq(true)

    })
  });

  it('function determined by formula via sugar, with strings and macros', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function>
    $a/(1+e^(-x/$b))
    </function>
    </graph>
    <number name="a">3</number>
    <math name="b">2</math>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(await components['/_function1'].stateValues.nInputs).eq(1);

      let f = (await components['/_function1'].stateValues.fs)[0];
      let numericalf = (await components['/_function1'].stateValues.numericalfs)[0];
      let symbolicf = (await components['/_function1'].stateValues.symbolicfs)[0];

      expect(f(-5)).closeTo(3 / (1 + Math.exp(5 / 2)), 1E-12);
      expect(f(1)).closeTo(3 / (1 + Math.exp(-1 / 2)), 1E-12);
      expect(numericalf(-5)).closeTo(3 / (1 + Math.exp(5 / 2)), 1E-12);
      expect(numericalf(1)).closeTo(3 / (1 + Math.exp(-1 / 2)), 1E-12);
      expect(symbolicf(-5).equals(me.fromText('3/(1+e^(5/2))'))).eq(true)
      expect(symbolicf(1).equals(me.fromText('3/(1+e^(-1/2))'))).eq(true)
      expect(symbolicf('z').equals(me.fromText('3/(1+e^(-z/2))'))).eq(true)

    })
  });

  it('function determined by formula via sugar, with strings and maths', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function>
    <number>3</number>/(1+e^(-x/<math>2</math>))
    </function>
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(await components['/_function1'].stateValues.nInputs).eq(1);

      let f = (await components['/_function1'].stateValues.fs)[0];
      let numericalf = (await components['/_function1'].stateValues.numericalfs)[0];
      let symbolicf = (await components['/_function1'].stateValues.symbolicfs)[0];

      expect(f(-5)).closeTo(3 / (1 + Math.exp(5 / 2)), 1E-12);
      expect(f(1)).closeTo(3 / (1 + Math.exp(-1 / 2)), 1E-12);
      expect(numericalf(-5)).closeTo(3 / (1 + Math.exp(5 / 2)), 1E-12);
      expect(numericalf(1)).closeTo(3 / (1 + Math.exp(-1 / 2)), 1E-12);
      expect(symbolicf(-5).equals(me.fromText('3/(1+e^(5/2))'))).eq(true)
      expect(symbolicf(1).equals(me.fromText('3/(1+e^(-1/2))'))).eq(true)
      expect(symbolicf('z').equals(me.fromText('3/(1+e^(-z/2))'))).eq(true)

    })
  });

  it('function determined by formula via sugar, with strings and copies', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function>
    <copy target="a" />/(1+e^(-x/<copy target="b" />))
    </function>
    </graph>
    <number name="a">3</number>
    <math name="b">2</math>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(await components['/_function1'].stateValues.nInputs).eq(1);

      let f = (await components['/_function1'].stateValues.fs)[0];
      let numericalf = (await components['/_function1'].stateValues.numericalfs)[0];
      let symbolicf = (await components['/_function1'].stateValues.symbolicfs)[0];

      expect(f(-5)).closeTo(3 / (1 + Math.exp(5 / 2)), 1E-12);
      expect(f(1)).closeTo(3 / (1 + Math.exp(-1 / 2)), 1E-12);
      expect(numericalf(-5)).closeTo(3 / (1 + Math.exp(5 / 2)), 1E-12);
      expect(numericalf(1)).closeTo(3 / (1 + Math.exp(-1 / 2)), 1E-12);
      expect(symbolicf(-5).equals(me.fromText('3/(1+e^(5/2))'))).eq(true)
      expect(symbolicf(1).equals(me.fromText('3/(1+e^(-1/2))'))).eq(true)
      expect(symbolicf('z').equals(me.fromText('3/(1+e^(-z/2))'))).eq(true)

    })
  });

  it('function determined by math formula', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function><math>3/(1+e^(-x/2))</math></function>
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(await components['/_function1'].stateValues.nInputs).eq(1);

      let f = (await components['/_function1'].stateValues.fs)[0];
      let numericalf = (await components['/_function1'].stateValues.numericalfs)[0];
      let symbolicf = (await components['/_function1'].stateValues.symbolicfs)[0];

      expect(f(-5)).closeTo(3 / (1 + Math.exp(5 / 2)), 1E-12);
      expect(f(1)).closeTo(3 / (1 + Math.exp(-1 / 2)), 1E-12);
      expect(numericalf(-5)).closeTo(3 / (1 + Math.exp(5 / 2)), 1E-12);
      expect(numericalf(1)).closeTo(3 / (1 + Math.exp(-1 / 2)), 1E-12);
      expect(symbolicf(-5).equals(me.fromText('3/(1+e^(5/2))'))).eq(true)
      expect(symbolicf(1).equals(me.fromText('3/(1+e^(-1/2))'))).eq(true)
      expect(symbolicf('z').equals(me.fromText('3/(1+e^(-z/2))'))).eq(true)

    })
  });

  it('function determined by math formula, with explicit copy tags', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function>
    <math><copy target="a"/>/(1+e^(-x/<copy target="b"/>))</math>
    </function>
    </graph>
    <number name="a">3</number>
    <math name="b">2</math>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(await components['/_function1'].stateValues.nInputs).eq(1);

      let f = (await components['/_function1'].stateValues.fs)[0];
      let numericalf = (await components['/_function1'].stateValues.numericalfs)[0];
      let symbolicf = (await components['/_function1'].stateValues.symbolicfs)[0];

      expect(f(-5)).closeTo(3 / (1 + Math.exp(5 / 2)), 1E-12);
      expect(f(1)).closeTo(3 / (1 + Math.exp(-1 / 2)), 1E-12);
      expect(numericalf(-5)).closeTo(3 / (1 + Math.exp(5 / 2)), 1E-12);
      expect(numericalf(1)).closeTo(3 / (1 + Math.exp(-1 / 2)), 1E-12);
      expect(symbolicf(-5).equals(me.fromText('3/(1+e^(5/2))'))).eq(true)
      expect(symbolicf(1).equals(me.fromText('3/(1+e^(-1/2))'))).eq(true)
      expect(symbolicf('z').equals(me.fromText('3/(1+e^(-z/2))'))).eq(true)

    })
  });


  it('symbolic function determined by formula via sugar', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function symbolic>
    3/(1+e^(-x/2))
    </function>
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let f = (await components['/_function1'].stateValues.fs)[0];
      let numericalf = (await components['/_function1'].stateValues.numericalfs)[0];
      let symbolicf = (await components['/_function1'].stateValues.symbolicfs)[0];

      expect(f(-5).equals(me.fromText('3/(1+e^(5/2))'))).eq(true)
      expect(f(1).equals(me.fromText('3/(1+e^(-1/2))'))).eq(true)
      expect(f('z').equals(me.fromText('3/(1+e^(-z/2))'))).eq(true)
      expect(numericalf(-5)).closeTo(3 / (1 + Math.exp(5 / 2)), 1E-12);
      expect(numericalf(1)).closeTo(3 / (1 + Math.exp(-1 / 2)), 1E-12);
      expect(symbolicf(-5).equals(me.fromText('3/(1+e^(5/2))'))).eq(true)
      expect(symbolicf(1).equals(me.fromText('3/(1+e^(-1/2))'))).eq(true)
      expect(symbolicf('z').equals(me.fromText('3/(1+e^(-z/2))'))).eq(true)

    })
  });

  it('symbolic function determined by formula via sugar, with strings and macro', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function symbolic>
    3/(1+e^(-$var/2))
    </function>
    </graph>
    <math name="var">x</math>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let f = (await components['/_function1'].stateValues.fs)[0];
      let numericalf = (await components['/_function1'].stateValues.numericalfs)[0];
      let symbolicf = (await components['/_function1'].stateValues.symbolicfs)[0];

      expect(f(-5).equals(me.fromText('3/(1+e^(5/2))'))).eq(true)
      expect(f(1).equals(me.fromText('3/(1+e^(-1/2))'))).eq(true)
      expect(f('z').equals(me.fromText('3/(1+e^(-z/2))'))).eq(true)
      expect(numericalf(-5)).closeTo(3 / (1 + Math.exp(5 / 2)), 1E-12);
      expect(numericalf(1)).closeTo(3 / (1 + Math.exp(-1 / 2)), 1E-12);
      expect(symbolicf(-5).equals(me.fromText('3/(1+e^(5/2))'))).eq(true)
      expect(symbolicf(1).equals(me.fromText('3/(1+e^(-1/2))'))).eq(true)
      expect(symbolicf('z').equals(me.fromText('3/(1+e^(-z/2))'))).eq(true)

    })
  });

  it('symbolic function determined by math formula', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function symbolic><math>3/(1+e^(-x/2))</math></function>
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let f = (await components['/_function1'].stateValues.fs)[0];
      let numericalf = (await components['/_function1'].stateValues.numericalfs)[0];
      let symbolicf = (await components['/_function1'].stateValues.symbolicfs)[0];

      expect(f(-5).equals(me.fromText('3/(1+e^(5/2))'))).eq(true)
      expect(f(1).equals(me.fromText('3/(1+e^(-1/2))'))).eq(true)
      expect(f('z').equals(me.fromText('3/(1+e^(-z/2))'))).eq(true)
      expect(numericalf(-5)).closeTo(3 / (1 + Math.exp(5 / 2)), 1E-12);
      expect(numericalf(1)).closeTo(3 / (1 + Math.exp(-1 / 2)), 1E-12);
      expect(symbolicf(-5).equals(me.fromText('3/(1+e^(5/2))'))).eq(true)
      expect(symbolicf(1).equals(me.fromText('3/(1+e^(-1/2))'))).eq(true)

    })
  });

  it('function determined by sugar formula in different variable', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function variables="q">
      q^2 sin(pi q/2)/100
    </function>

    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let f = (await components['/_function1'].stateValues.fs)[0];
      let numericalf = (await components['/_function1'].stateValues.numericalfs)[0];
      let symbolicf = (await components['/_function1'].stateValues.symbolicfs)[0];

      expect(f(-5)).closeTo(25 * Math.sin(0.5 * Math.PI * (-5)) / 100, 1E-12);
      expect(f(3)).closeTo(9 * Math.sin(0.5 * Math.PI * (3)) / 100, 1E-12);
      expect(numericalf(-5)).closeTo(25 * Math.sin(0.5 * Math.PI * (-5)) / 100, 1E-12);
      expect(numericalf(3)).closeTo(9 * Math.sin(0.5 * Math.PI * (3)) / 100, 1E-12);
      expect(symbolicf(-5).equals(me.fromText('(-5)^2sin(pi(-5)/2)/100'))).eq(true)
      expect(symbolicf(3).equals(me.fromText('(3)^2sin(pi(3)/2)/100'))).eq(true)
      expect(symbolicf('p').equals(me.fromText('p^2sin(pi p/2)/100'))).eq(true)

    })
  });

  it('function determined by sugar formula in different variable, with strings and macros', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function variables="$var">
      $var^$c sin(pi $var/$c)/$d
    </function>

    </graph>
    <math name="var">q</math>
    <number name="c">2</number>
    <number name="d">100</number>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let f = (await components['/_function1'].stateValues.fs)[0];
      let numericalf = (await components['/_function1'].stateValues.numericalfs)[0];
      let symbolicf = (await components['/_function1'].stateValues.symbolicfs)[0];

      expect(f(-5)).closeTo(25 * Math.sin(0.5 * Math.PI * (-5)) / 100, 1E-12);
      expect(f(3)).closeTo(9 * Math.sin(0.5 * Math.PI * (3)) / 100, 1E-12);
      expect(numericalf(-5)).closeTo(25 * Math.sin(0.5 * Math.PI * (-5)) / 100, 1E-12);
      expect(numericalf(3)).closeTo(9 * Math.sin(0.5 * Math.PI * (3)) / 100, 1E-12);
      expect(symbolicf(-5).equals(me.fromText('(-5)^2sin(pi(-5)/2)/100'))).eq(true)
      expect(symbolicf(3).equals(me.fromText('(3)^2sin(pi(3)/2)/100'))).eq(true)
      expect(symbolicf('p').equals(me.fromText('p^2sin(pi p/2)/100'))).eq(true)

    })
  });

  it('function determined by math formula in different variable', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
      <function variables="q"><math>q^2 sin(pi q/2)/100</math></function>
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let f = (await components['/_function1'].stateValues.fs)[0];
      let numericalf = (await components['/_function1'].stateValues.numericalfs)[0];
      let symbolicf = (await components['/_function1'].stateValues.symbolicfs)[0];

      expect(f(-5)).closeTo(25 * Math.sin(0.5 * Math.PI * (-5)) / 100, 1E-12);
      expect(f(3)).closeTo(9 * Math.sin(0.5 * Math.PI * (3)) / 100, 1E-12);
      expect(numericalf(-5)).closeTo(25 * Math.sin(0.5 * Math.PI * (-5)) / 100, 1E-12);
      expect(numericalf(3)).closeTo(9 * Math.sin(0.5 * Math.PI * (3)) / 100, 1E-12);
      expect(symbolicf(-5).equals(me.fromText('(-5)^2sin(pi(-5)/2)/100'))).eq(true)
      expect(symbolicf(3).equals(me.fromText('(3)^2sin(pi(3)/2)/100'))).eq(true)
      expect(symbolicf('p').equals(me.fromText('p^2sin(pi p/2)/100'))).eq(true)

    })
  });

  it('function with empty variables attribute', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function variables="">
      x^2 sin(pi x/2)/100
    </function>

    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let f = (await components['/_function1'].stateValues.fs)[0];
      let numericalf = (await components['/_function1'].stateValues.numericalfs)[0];
      let symbolicf = (await components['/_function1'].stateValues.symbolicfs)[0];

      expect(f(-5)).closeTo(25 * Math.sin(0.5 * Math.PI * (-5)) / 100, 1E-12);
      expect(f(3)).closeTo(9 * Math.sin(0.5 * Math.PI * (3)) / 100, 1E-12);
      expect(numericalf(-5)).closeTo(25 * Math.sin(0.5 * Math.PI * (-5)) / 100, 1E-12);
      expect(numericalf(3)).closeTo(9 * Math.sin(0.5 * Math.PI * (3)) / 100, 1E-12);
      expect(symbolicf(-5).equals(me.fromText('(-5)^2sin(pi(-5)/2)/100'))).eq(true)
      expect(symbolicf(3).equals(me.fromText('(3)^2sin(pi(3)/2)/100'))).eq(true)
      expect(symbolicf('p').equals(me.fromText('p^2sin(pi p/2)/100'))).eq(true)

    })
  });

  it('function determined by function', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <function variables="q"><math>q^2 sin(pi q/2)/100</math></function>
    <graph>
      <function>
        $_function1
      </function>
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let f = (await components['/_function2'].stateValues.fs)[0];
      let numericalf = (await components['/_function2'].stateValues.numericalfs)[0];
      let symbolicf = (await components['/_function2'].stateValues.symbolicfs)[0];

      expect(f(-5)).closeTo(25 * Math.sin(0.5 * Math.PI * (-5)) / 100, 1E-12);
      expect(f(3)).closeTo(9 * Math.sin(0.5 * Math.PI * (3)) / 100, 1E-12);
      expect(numericalf(-5)).closeTo(25 * Math.sin(0.5 * Math.PI * (-5)) / 100, 1E-12);
      expect(numericalf(3)).closeTo(9 * Math.sin(0.5 * Math.PI * (3)) / 100, 1E-12);
      expect(symbolicf(-5).equals(me.fromText('(-5)^2sin(pi(-5)/2)/100'))).eq(true)
      expect(symbolicf(3).equals(me.fromText('(3)^2sin(pi(3)/2)/100'))).eq(true)
      expect(symbolicf('p').equals(me.fromText('p^2sin(pi p/2)/100'))).eq(true)


    })
  });

  it('point constrained to function in different variable', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function variables="u">
      log(2u)
    </function>
    <point x="-3" y="5">
      <constraints>
        <constrainTo><copy target="_function1" /></constrainTo>
      </constraints>
    </point>

    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let p = components['/_point1'];

      let x = p.stateValues.xs[0].evaluate_to_constant();
      let y = p.stateValues.xs[1].evaluate_to_constant();

      expect(Math.log(2 * x)).closeTo(y, 1E-5);

      await p.movePoint({ x: 8, y: 8 });

      x = p.stateValues.xs[0].evaluate_to_constant();
      y = p.stateValues.xs[1].evaluate_to_constant();

      expect(Math.log(2 * x)).closeTo(y, 1E-5);

      await p.movePoint({ x: -8, y: -8 });

      x = p.stateValues.xs[0].evaluate_to_constant();
      y = p.stateValues.xs[1].evaluate_to_constant();

      expect(Math.log(2 * x)).closeTo(y, 1E-5);


    })
  });

  it('point constrained to function in different variable, restrict domain', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function variables="u" domain="(0.1, 6)" >
      log(2u)
    </function>
    <point x="-3" y="5">
      <constraints>
        <constrainTo><copy target="_function1" /></constrainTo>
      </constraints>
    </point>

    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let p = components['/_point1'];

      let x = p.stateValues.xs[0].evaluate_to_constant();
      let y = p.stateValues.xs[1].evaluate_to_constant();

      expect(x).eq(0.1);
      expect(Math.log(2 * x)).closeTo(y, 1E-5);

      await p.movePoint({ x: 4, y: 6 });

      x = p.stateValues.xs[0].evaluate_to_constant();
      y = p.stateValues.xs[1].evaluate_to_constant();

      expect(x).closeTo(4, 1E-12);
      expect(Math.log(2 * x)).closeTo(y, 1E-5);


      await p.movePoint({ x: 8, y: 8 });

      x = p.stateValues.xs[0].evaluate_to_constant();
      y = p.stateValues.xs[1].evaluate_to_constant();

      expect(x).closeTo(6, 1E-12);
      expect(Math.log(2 * x)).closeTo(y, 1E-5);

      await p.movePoint({ x: -8, y: -8 });

      x = p.stateValues.xs[0].evaluate_to_constant();
      y = p.stateValues.xs[1].evaluate_to_constant();

      expect(x).closeTo(0.1, 1E-12);
      expect(Math.log(2 * x)).closeTo(y, 1E-5);


    })
  });

  it('calculated extrema from spline', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <point>(0.7, 5.43)</point>
    <point>(3,4)</point>
    <point>(5,6)</point>
    <point>(-5,6)</point>
    <function through="$_point1 $_point2" maxima="$_point3" minima="$_point4" />
    <copy prop="maxima" target="_function1" />
    <copy prop="minima" target="_function1" />
    </graph>

    <p>Number of maxima: <copy prop="numbermaxima" name="numbermaxima" target="_function1" /></p>
    <p>Maxima: <math simplify="none"><copy prop="maxima" target="_function1" /></math></p>
    <p>Number of minima: <copy prop="numberminima" name="numberminima" target="_function1" /></p>
    <p>Minima: <math simplify="none"><copy prop="minima" target="_function1" /></math></p>
    <p>Number of extrema: <copy prop="numberextrema" name="numberextrema" target="_function1" /></p>
    <p>Extrema: <math simplify="none"><copy prop="extrema" target="_function1" /></math></p>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let numberMaximaAnchor = cesc('#' + components["/numbermaxima"].replacements[0].componentName);
      let numberMinimaAnchor = cesc('#' + components["/numberminima"].replacements[0].componentName);
      let numberExtremaAnchor = cesc('#' + components["/numberextrema"].replacements[0].componentName);

      cy.get(numberMaximaAnchor).should('have.text', '2');
      cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('((−2.15,7),(5,6))');
      });
      cy.get(numberMinimaAnchor).should('have.text', '2');
      cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('((−5,6),(3,4))');
      });
      cy.get(numberExtremaAnchor).should('have.text', '4');

      cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('((−5,6),(−2.15,7),(3,4),(5,6))');
      });


      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        await components['/_point1'].movePoint({ x: 2, y: 2 });

        cy.get(numberMaximaAnchor).should('have.text', '2');
        cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('((−1.5,7),(5,6))');
        });
        cy.get(numberMinimaAnchor).should('have.text', '2');
        cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('((−5,6),(2,2))');
        });
        cy.get(numberExtremaAnchor).should('have.text', '4');
        cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('((−5,6),(−1.5,7),(2,2),(5,6))');
        });

      });

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        await components['/_point1'].movePoint({ x: 3.6, y: 5.1 });

        cy.get(numberMaximaAnchor).should('have.text', '3');
        cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('((−1,7),(3.6,5.1),(5,6))');
        });
        cy.get(numberMinimaAnchor).should('have.text', '3');
        cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('((−5,6),(3,4),(4.3,5))');
        });
        cy.get(numberExtremaAnchor).should('have.text', '6');
        cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('((−5,6),(−1,7),(3,4),(3.6,5.1),(4.3,5),(5,6))');
        });

      });

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        await components['/_point1'].movePoint({ x: 8, y: 9 });

        cy.get(numberMaximaAnchor).should('have.text', '2');
        cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('((−1,7),(5,6))');
        });
        cy.get(numberMinimaAnchor).should('have.text', '3');
        cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('((−5,6),(3,4),(6.5,5))');
        });
        cy.get(numberExtremaAnchor).should('have.text', '5');
        cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('((−5,6),(−1,7),(3,4),(5,6),(6.5,5))');
        });

      });

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        await components['/_point1'].movePoint({ x: 5, y: 2 });

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

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        await components['/_point1'].movePoint({ x: -9, y: 0 });

        cy.get(numberMaximaAnchor).should('have.text', '3');
        cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('((−7,7),(−1,7),(5,6))');
        });
        cy.get(numberMinimaAnchor).should('have.text', '2');
        cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('((−5,6),(3,4))');
        });
        cy.get(numberExtremaAnchor).should('have.text', '5');
        cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('((−7,7),(−5,6),(−1,7),(3,4),(5,6))');
        });

      });


      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        await components['/_point4'].movePoint({ x: 8, y: 3 });

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
          expect(text.trim()).equal('((5,6),(8,3))');
        });

      });

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        await components['/_point4'].movePoint({ x: 8, y: 6 });

        cy.get(numberMaximaAnchor).should('have.text', '2');
        cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('((5,6),(7,7))');
        });
        cy.get(numberMinimaAnchor).should('have.text', '2');
        cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('((6,5),(8,6))');
        });
        cy.get(numberExtremaAnchor).should('have.text', '4');
        cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('((5,6),(6,5),(7,7),(8,6))');
        });

      });
    })

  });

  it('calculated extrema from spline, restrict domain', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>xmin = <mathinput name="xmin" prefill="-4" />
    xmax = <mathinput name="xmax" prefill="7" /></p>
    <graph>
    <point>(0.7, 5.43)</point>
    <point>(3,4)</point>
    <point>(5,6)</point>
    <point>(-5,6)</point>
    <function through="$_point1 $_point2" maxima="$_point3" minima="$_point4" domain="($xmin, $xmax)" />
    <copy prop="maxima" target="_function1" />
    <copy prop="minima" target="_function1" />
    </graph>

    <p>Number of maxima: <copy prop="numbermaxima" name="numbermaxima" target="_function1" /></p>
    <p>Maxima: <math simplify="none"><copy prop="maxima" target="_function1" /></math></p>
    <p>Number of minima: <copy prop="numberminima" name="numberminima" target="_function1" /></p>
    <p>Minima: <math simplify="none"><copy prop="minima" target="_function1" /></math></p>
    <p>Number of extrema: <copy prop="numberextrema" name="numberextrema" target="_function1" /></p>
    <p>Extrema: <math simplify="none"><copy prop="extrema" target="_function1" /></math></p>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let numberMaximaAnchor = cesc('#' + components["/numbermaxima"].replacements[0].componentName);
      let numberMinimaAnchor = cesc('#' + components["/numberminima"].replacements[0].componentName);
      let numberExtremaAnchor = cesc('#' + components["/numberextrema"].replacements[0].componentName);

      cy.get(numberMaximaAnchor).should('have.text', '2');
      cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('((−2.15,7),(5,6))');
      });
      cy.get(numberMinimaAnchor).should('have.text', '1');
      cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,4)');
      });
      cy.get(numberExtremaAnchor).should('have.text', '3');

      cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('((−2.15,7),(3,4),(5,6))');
      });

      cy.get('#\\/xmin textarea').type('{end}{backspace}2{enter}', { force: true });
      cy.get('#\\/xmax textarea').type('{end}{backspace}4{enter}', { force: true });

      cy.get(numberMaximaAnchor).should('have.text', '0');
      cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿');
      });
      cy.get(numberMinimaAnchor).should('have.text', '1');
      cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,4)');
      });
      cy.get(numberExtremaAnchor).should('have.text', '1');

      cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,4)');
      });


      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        await components['/_point1'].movePoint({ x: 2, y: 2 });

        cy.get(numberMaximaAnchor).should('have.text', '1');
        cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(−1.5,7)');
        });
        cy.get(numberMinimaAnchor).should('have.text', '1');
        cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(2,2)');
        });
        cy.get(numberExtremaAnchor).should('have.text', '2');
        cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('((−1.5,7),(2,2))');
        });

        cy.get('#\\/xmin textarea').type('{end}{backspace}6{enter}', { force: true });
        cy.get('#\\/xmax textarea').type('{end}{backspace}8{enter}', { force: true });

        cy.get(numberMaximaAnchor).should('have.text', '2');
        cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('((−1.5,7),(5,6))');
        });
        cy.get(numberMinimaAnchor).should('have.text', '2');
        cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('((−5,6),(2,2))');
        });
        cy.get(numberExtremaAnchor).should('have.text', '4');
        cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('((−5,6),(−1.5,7),(2,2),(5,6))');
        });

      });

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        await components['/_point1'].movePoint({ x: 3.6, y: 5.1 });

        cy.get(numberMaximaAnchor).should('have.text', '3');
        cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('((−1,7),(3.6,5.1),(5,6))');
        });
        cy.get(numberMinimaAnchor).should('have.text', '3');
        cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('((−5,6),(3,4),(4.3,5))');
        });
        cy.get(numberExtremaAnchor).should('have.text', '6');
        cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('((−5,6),(−1,7),(3,4),(3.6,5.1),(4.3,5),(5,6))');
        });

        cy.get('#\\/xmin textarea').type('{end}{backspace}1{enter}', { force: true });
        cy.get('#\\/xmax textarea').type('{end}{backspace}4{enter}', { force: true });

        cy.get(numberMaximaAnchor).should('have.text', '2');
        cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('((−1,7),(3.6,5.1))');
        });
        cy.get(numberMinimaAnchor).should('have.text', '1');
        cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(3,4)');
        });
        cy.get(numberExtremaAnchor).should('have.text', '3');
        cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('((−1,7),(3,4),(3.6,5.1))');
        });

      });
    })

  });


  it('calculated extrema from spline, restrict domain, just through points', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <point>(0, 0)</point>
    <point>(2, -1.8)</point>
    <point>(5,-4)</point>
    <point>(7,0)</point>
    <point>(8,1)</point>
    <function through="$_point1 $_point2 $_point3 $_point4 $_point5" domain="(0,10)" />
    <copy prop="maxima" target="_function1" />
    <copy prop="minima" target="_function1" />
    </graph>

    <p>Number of maxima: <copy prop="numbermaxima" name="numbermaxima" target="_function1" /></p>
    <p>Maxima: <math simplify="none"><copy prop="maxima" target="_function1" /></math></p>
    <p>Number of minima: <copy prop="numberminima" name="numberminima" target="_function1" /></p>
    <p>Minima: <math simplify="none"><copy prop="minima" target="_function1" /></math></p>
    <p>Number of extrema: <copy prop="numberextrema" name="numberextrema" target="_function1" /></p>
    <p>Extrema: <math simplify="none"><copy prop="extrema" target="_function1" /></math></p>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let numberMaximaAnchor = cesc('#' + components["/numbermaxima"].replacements[0].componentName);
      let numberMinimaAnchor = cesc('#' + components["/numberminima"].replacements[0].componentName);
      let numberExtremaAnchor = cesc('#' + components["/numberextrema"].replacements[0].componentName);

      // it is set up so that minimum of quadratic interpolating between first two points
      // is past maximum of domain
      // check for bug where this stopped looking for minima
      cy.get(numberMaximaAnchor).should('have.text', '0');
      cy.get(numberMinimaAnchor).should('have.text', '1');
      cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(5,−4)');
      });
      cy.get(numberExtremaAnchor).should('have.text', '1');

      cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(5,−4)');
      });


      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        // now move points so that the minimum of the cubic interpolating between
        // the first two points is past maximum of the domain
        // check for bug where this stopped looking for minima

        await components['/_point1'].movePoint({ x: 0, y: -0.35 });
        await components['/_point2'].movePoint({ x: 1.8, y: -1.36 });
        await components['/_point5'].movePoint({ x: 1, y: -0.866 });

        cy.get(numberMaximaAnchor).should('have.text', '0');
        cy.get(numberMinimaAnchor).should('have.text', '1');
        cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(5,−4)');
        });
        cy.get(numberExtremaAnchor).should('have.text', '1');
        cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(5,−4)');
        });

      });


      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        // now move points so that maximum of quadratic interpolating between first two points
        // is past maximum of domain
        // check for bug where this stopped looking for maxima

        await components['/_point1'].movePoint({ x: 0, y: 0 });
        await components['/_point2'].movePoint({ x: 2, y: 1.8 });
        await components['/_point3'].movePoint({ x: 5, y: 4 });
        await components['/_point5'].movePoint({ x: 8, y: -1 });

        cy.get(numberMaximaAnchor).should('have.text', '1');
        cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(5,4)');
        });
        cy.get(numberMinimaAnchor).should('have.text', '0');
        cy.get(numberExtremaAnchor).should('have.text', '1');
        cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(5,4)');
        });

      });

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        // now move points so that the maximum of the cubic interpolating between
        // the first two points is past maximum of the domain
        // check for bug where this stopped looking for maximum

        await components['/_point1'].movePoint({ x: 0, y: 0.35 });
        await components['/_point2'].movePoint({ x: 1.8, y: 1.36 });
        await components['/_point5'].movePoint({ x: 1, y: 0.866 });

        cy.get(numberMaximaAnchor).should('have.text', '1');
        cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(5,4)');
        });
        cy.get(numberMinimaAnchor).should('have.text', '0');
        cy.get(numberExtremaAnchor).should('have.text', '1');
        cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(5,4)');
        });

      });

    })

  });

  it('calculated extrema from gaussians', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <point layer="2">(0,1)</point>
    <point layer="2">(3,1)</point>
    <function>$(_point1{prop='y'}) exp(-(x-$(_point1{prop='x'}))^2)+$(_point2{prop='y'}) exp(-(x-$(_point2{prop='x'}))^2)</function>
    <copy prop="extrema" target="_function1" />
    </graph>
    
    <p>Number of maxima: <copy prop="numbermaxima" name="numbermaxima" target="_function1" /></p>
    <p>Maximum locations: <copy prop="maximumlocation1" name="maximumlocation1" target="_function1" />,
    <copy prop="maximumlocation2" name="maximumlocation2" target="_function1" /></p>
    <p>Maximum values: <copy prop="maximumvalue1" name="maximumvalue1" target="_function1" />,
    <copy prop="maximumvalue2" name="maximumvalue2" target="_function1" /></p>
    <p>Number of minima: <copy prop="numberminima" name="numberminima" target="_function1" /></p>
    <p>Minimum locations: <copy prop="minimumlocation1" name="minimumlocation1" target="_function1" />,
    <copy prop="minimumlocation2" name="minimumlocation2" target="_function1" /></p>
    <p>Minimum values: <copy prop="minimumvalue1" name="minimumvalue1" target="_function1" />,
    <copy prop="minimumvalue2" name="minimumvalue2" target="_function1" /></p>
    <p>Number of extrema: <copy prop="numberextrema" name="numberextrema" target="_function1" /></p>
    <p>Extremum locations: <copy prop="extremumlocation1" name="extremumlocation1" target="_function1" />,
    <copy prop="extremumlocation2" name="extremumlocation2" target="_function1" />,
    <copy prop="extremumlocation3" name="extremumlocation3" target="_function1" /></p>
    <p>Extremum values: <copy prop="extremumvalue1" name="extremumvalue1" target="_function1" />,
    <copy prop="extremumvalue2" name="extremumvalue2" target="_function1" />,
    <copy prop="extremumvalue3" name="extremumvalue3" target="_function1" /></p>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let numberMaximaAnchor = cesc('#' + components["/numbermaxima"].replacements[0].componentName);
      let numberMinimaAnchor = cesc('#' + components["/numberminima"].replacements[0].componentName);
      let numberExtremaAnchor = cesc('#' + components["/numberextrema"].replacements[0].componentName);
      let maximumLocation1Anchor = cesc('#' + components["/maximumlocation1"].replacements[0].componentName);
      let maximumLocation2Anchor = cesc('#' + components["/maximumlocation2"].replacements[0].componentName);
      let maximumValue1Anchor = cesc('#' + components["/maximumvalue1"].replacements[0].componentName);
      let maximumValue2Anchor = cesc('#' + components["/maximumvalue2"].replacements[0].componentName);
      let minimumLocation1Anchor = cesc('#' + components["/minimumlocation1"].replacements[0].componentName);
      let minimumValue1Anchor = cesc('#' + components["/minimumvalue1"].replacements[0].componentName);
      let extremumLocation1Anchor = cesc('#' + components["/extremumlocation1"].replacements[0].componentName);
      let extremumLocation2Anchor = cesc('#' + components["/extremumlocation2"].replacements[0].componentName);
      let extremumLocation3Anchor = cesc('#' + components["/extremumlocation3"].replacements[0].componentName);
      let extremumValue1Anchor = cesc('#' + components["/extremumvalue1"].replacements[0].componentName);
      let extremumValue2Anchor = cesc('#' + components["/extremumvalue2"].replacements[0].componentName);
      let extremumValue3Anchor = cesc('#' + components["/extremumvalue3"].replacements[0].componentName);

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


      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        await components['/_point2'].movePoint({ x: 3, y: -1 });


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


      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        await components['/_point1'].movePoint({ x: 0, y: -1 });

        let minimumLocation2Anchor = cesc('#' + components["/minimumlocation2"].replacements[0].componentName);
        let minimumValue2Anchor = cesc('#' + components["/minimumvalue2"].replacements[0].componentName);

        // let extremumLocation3AnchorOld = extremumLocation3Anchor;
        // let extremumLocation3AnchorNew = cesc('#' + components["/extremumlocation3"].replacements[0].componentName);
        // let extremumValue3AnchorOld = extremumValue3Anchor;
        // let extremumValue3AnchorNew = cesc('#' + components["/extremumvalue3"].replacements[0].componentName);

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
        // cy.get(extremumLocation3AnchorOld).should('not.exist')
        cy.get(extremumLocation3Anchor).invoke('text').then((text) => {
          expect(Number(text.replace(/−/, '-'))).closeTo(3, 0.01);
        });
        cy.get(extremumValue1Anchor).invoke('text').then((text) => {
          expect(Number(text.replace(/−/, '-'))).closeTo(-1, 0.01);
        });
        cy.get(extremumValue2Anchor).invoke('text').then((text) => {
          expect(Number(text.replace(/−/, '-'))).closeTo(-.21, 0.01);
        });
        // cy.get(extremumValue3AnchorOld).should('not.exist')
        cy.get(extremumValue3Anchor).invoke('text').then((text) => {
          expect(Number(text.replace(/−/, '-'))).closeTo(-1, 0.01);
        });

      });
    });

  });

  it('calculated extrema from sinusoid', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    Period: <mathinput />
    <graph>
    <function>sin(2*pi*x/$_mathinput1)</function>
    <copy prop="extrema" target="_function1" />
    </graph>
    <p><aslist><copy prop="maximumLocations" target="_function1" /></aslist></p>
    <p><aslist><copy prop="maximumValues" target="_function1" /></aslist></p>
    <p><aslist><copy prop="minimumLocations" target="_function1" /></aslist></p>
    <p><aslist><copy prop="minimumValues" target="_function1" /></aslist></p>
    <p><aslist><copy prop="extremumLocations" target="_function1" /></aslist></p>
    <p><aslist><copy prop="extremumValues" target="_function1" /></aslist></p>

    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let f = components['/_function1'];

      expect(f.stateValues.numberMaxima).eq(0);
      expect(f.stateValues.numberMinima).eq(0);
      expect(f.stateValues.numberExtrema).eq(0);

    });

    cy.get('#\\/_mathinput1 textarea').type("10{enter}", { force: true });

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let period = 10;

      let f = components['/_function1'];

      expect(f.stateValues.numberMaxima).eq(200 / period);

      let maximumLocations = f.stateValues.maximumLocations;
      for (let m of maximumLocations) {
        expect(((m % period) + period) % period).closeTo(period / 4, 0.0001);
      }

      let maximumValues = f.stateValues.maximumValues;
      for (let m of maximumValues) {
        expect(m).closeTo(1, 0.0001);
      }

      expect(f.stateValues.numberMinima).eq(200 / period);

      let minimumLocations = f.stateValues.minimumLocations;
      for (let m of minimumLocations) {
        expect(((m % period) + period) % period).closeTo(3 * period / 4, 0.0001);
      }

      let minimumValues = f.stateValues.minimumValues;
      for (let m of minimumValues) {
        expect(m).closeTo(-1, 0.0001);
      }

      expect(f.stateValues.numberExtrema).eq(400 / period);

      let extremumLocations = f.stateValues.minimumLocations;
      for (let m of extremumLocations) {
        expect(((m % (period / 2)) + (period / 2)) % (period / 2)).closeTo(period / 4, 0.0001);
      }

      let extremumValues = f.stateValues.minimumValues;
      for (let m of extremumValues) {
        expect(Math.abs(m)).closeTo(1, 0.0001);
      }

    });

    cy.get('#\\/_mathinput1 textarea').type("{end}{backspace}{backspace}5{enter}", { force: true });

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let period = 5;

      let f = components['/_function1'];

      expect(f.stateValues.numberMaxima).eq(200 / period);

      let maximumLocations = f.stateValues.maximumLocations;
      for (let m of maximumLocations) {
        expect(((m % period) + period) % period).closeTo(period / 4, 0.0001);
      }

      let maximumValues = f.stateValues.maximumValues;
      for (let m of maximumValues) {
        expect(m).closeTo(1, 0.0001);
      }

      expect(f.stateValues.numberMinima).eq(200 / period);

      let minimumLocations = f.stateValues.minimumLocations;
      for (let m of minimumLocations) {
        expect(((m % period) + period) % period).closeTo(3 * period / 4, 0.0001);
      }

      let minimumValues = f.stateValues.minimumValues;
      for (let m of minimumValues) {
        expect(m).closeTo(-1, 0.0001);
      }

      expect(f.stateValues.numberExtrema).eq(400 / period);

      let extremumLocations = f.stateValues.minimumLocations;
      for (let m of extremumLocations) {
        expect(((m % (period / 2)) + (period / 2)) % (period / 2)).closeTo(period / 4, 0.0001);
      }

      let extremumValues = f.stateValues.minimumValues;
      for (let m of extremumValues) {
        expect(Math.abs(m)).closeTo(1, 0.0001);
      }

    });


  });

  it('calculated extrema from sinusoid, restrict domain', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Period: <mathinput /></p>
    <p>xmin = <mathinput name="xmin" prefill="-10" />
    xmax = <mathinput name="xmax" prefill="10" /></p>
    <graph>
    <function domain="($xmin, $xmax)">sin(2*pi*x/$_mathinput1)</function>
    <copy prop="extrema" target="_function1" />
    </graph>
    <p><aslist><copy prop="maximumLocations" target="_function1" /></aslist></p>
    <p><aslist><copy prop="maximumValues" target="_function1" /></aslist></p>
    <p><aslist><copy prop="minimumLocations" target="_function1" /></aslist></p>
    <p><aslist><copy prop="minimumValues" target="_function1" /></aslist></p>
    <p><aslist><copy prop="extremumLocations" target="_function1" /></aslist></p>
    <p><aslist><copy prop="extremumValues" target="_function1" /></aslist></p>

    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let f = components['/_function1'];

      expect(f.stateValues.numberMaxima).eq(0);
      expect(f.stateValues.numberMinima).eq(0);
      expect(f.stateValues.numberExtrema).eq(0);

    });

    cy.get('#\\/_mathinput1 textarea').type("10{enter}", { force: true });

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let period = 10;

      let f = components['/_function1'];

      expect(f.stateValues.numberMaxima).eq(20 / period);

      let maximumLocations = f.stateValues.maximumLocations;
      for (let m of maximumLocations) {
        expect(((m % period) + period) % period).closeTo(period / 4, 0.0001);
      }

      let maximumValues = f.stateValues.maximumValues;
      for (let m of maximumValues) {
        expect(m).closeTo(1, 0.0001);
      }

      expect(f.stateValues.numberMinima).eq(20 / period);

      let minimumLocations = f.stateValues.minimumLocations;
      for (let m of minimumLocations) {
        expect(((m % period) + period) % period).closeTo(3 * period / 4, 0.0001);
      }

      let minimumValues = f.stateValues.minimumValues;
      for (let m of minimumValues) {
        expect(m).closeTo(-1, 0.0001);
      }

      expect(f.stateValues.numberExtrema).eq(40 / period);

      let extremumLocations = f.stateValues.minimumLocations;
      for (let m of extremumLocations) {
        expect(((m % (period / 2)) + (period / 2)) % (period / 2)).closeTo(period / 4, 0.0001);
      }

      let extremumValues = f.stateValues.minimumValues;
      for (let m of extremumValues) {
        expect(Math.abs(m)).closeTo(1, 0.0001);
      }

    });

    cy.get('#\\/xmin textarea').type("{end}{backspace}{backspace}5{enter}", { force: true });
    cy.get('#\\/xmax textarea').type("{end}{backspace}{backspace}25{enter}", { force: true });

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let period = 10;

      let f = components['/_function1'];

      expect(f.stateValues.numberMaxima).eq(30 / period);

      let maximumLocations = f.stateValues.maximumLocations;
      for (let m of maximumLocations) {
        expect(((m % period) + period) % period).closeTo(period / 4, 0.0001);
      }

      let maximumValues = f.stateValues.maximumValues;
      for (let m of maximumValues) {
        expect(m).closeTo(1, 0.0001);
      }

      expect(f.stateValues.numberMinima).eq(30 / period);

      let minimumLocations = f.stateValues.minimumLocations;
      for (let m of minimumLocations) {
        expect(((m % period) + period) % period).closeTo(3 * period / 4, 0.0001);
      }

      let minimumValues = f.stateValues.minimumValues;
      for (let m of minimumValues) {
        expect(m).closeTo(-1, 0.0001);
      }

      expect(f.stateValues.numberExtrema).eq(60 / period);

      let extremumLocations = f.stateValues.minimumLocations;
      for (let m of extremumLocations) {
        expect(((m % (period / 2)) + (period / 2)) % (period / 2)).closeTo(period / 4, 0.0001);
      }

      let extremumValues = f.stateValues.minimumValues;
      for (let m of extremumValues) {
        expect(Math.abs(m)).closeTo(1, 0.0001);
      }

    });


    cy.get('#\\/_mathinput1 textarea').type("{end}{backspace}{backspace}5{enter}", { force: true });

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let period = 5;

      let f = components['/_function1'];

      expect(f.stateValues.numberMaxima).eq(30 / period);

      let maximumLocations = f.stateValues.maximumLocations;
      for (let m of maximumLocations) {
        expect(((m % period) + period) % period).closeTo(period / 4, 0.0001);
      }

      let maximumValues = f.stateValues.maximumValues;
      for (let m of maximumValues) {
        expect(m).closeTo(1, 0.0001);
      }

      expect(f.stateValues.numberMinima).eq(30 / period);

      let minimumLocations = f.stateValues.minimumLocations;
      for (let m of minimumLocations) {
        expect(((m % period) + period) % period).closeTo(3 * period / 4, 0.0001);
      }

      let minimumValues = f.stateValues.minimumValues;
      for (let m of minimumValues) {
        expect(m).closeTo(-1, 0.0001);
      }

      expect(f.stateValues.numberExtrema).eq(60 / period);

      let extremumLocations = f.stateValues.minimumLocations;
      for (let m of extremumLocations) {
        expect(((m % (period / 2)) + (period / 2)) % (period / 2)).closeTo(period / 4, 0.0001);
      }

      let extremumValues = f.stateValues.minimumValues;
      for (let m of extremumValues) {
        expect(Math.abs(m)).closeTo(1, 0.0001);
      }

    });


    cy.get('#\\/xmin textarea').type("{end}{backspace}1{enter}", { force: true });
    cy.get('#\\/xmax textarea').type("{end}{backspace}{backspace}9{enter}", { force: true });

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let period = 5;

      let f = components['/_function1'];

      expect(f.stateValues.numberMaxima).eq(10 / period);

      let maximumLocations = f.stateValues.maximumLocations;
      for (let m of maximumLocations) {
        expect(((m % period) + period) % period).closeTo(period / 4, 0.0001);
      }

      let maximumValues = f.stateValues.maximumValues;
      for (let m of maximumValues) {
        expect(m).closeTo(1, 0.0001);
      }

      expect(f.stateValues.numberMinima).eq(10 / period);

      let minimumLocations = f.stateValues.minimumLocations;
      for (let m of minimumLocations) {
        expect(((m % period) + period) % period).closeTo(3 * period / 4, 0.0001);
      }

      let minimumValues = f.stateValues.minimumValues;
      for (let m of minimumValues) {
        expect(m).closeTo(-1, 0.0001);
      }

      expect(f.stateValues.numberExtrema).eq(20 / period);

      let extremumLocations = f.stateValues.minimumLocations;
      for (let m of extremumLocations) {
        expect(((m % (period / 2)) + (period / 2)) % (period / 2)).closeTo(period / 4, 0.0001);
      }

      let extremumValues = f.stateValues.minimumValues;
      for (let m of extremumValues) {
        expect(Math.abs(m)).closeTo(1, 0.0001);
      }

    });



  });

  it('no extrema with horizontal asymptote', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function>
      1/(1+exp(-10*x))
    </function>
    <copy prop="minima" target="_function1" />
    <copy prop="maxima" target="_function1" />
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let f = components['/_function1'];

      expect(await f.stateValues.numberMaxima).eq(0);
      expect(await f.stateValues.numberMinima).eq(0);
      expect(await f.stateValues.numberExtrema).eq(0);

    });

  });

  it('extrema of rational function', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function>
      (x+8)(x-8)/((x-2)(x+4)(x-5)^2)
    </function>
    <copy prop="extrema" target="_function1" />
    </graph>
    <p><aslist><copy prop="maximumLocations" target="_function1" /></aslist></p>
    <p><aslist><copy prop="maximumValues" target="_function1" /></aslist></p>
    <p><aslist><copy prop="minimumLocations" target="_function1" /></aslist></p>
    <p><aslist><copy prop="minimumValues" target="_function1" /></aslist></p>
    <p><aslist><copy prop="extremumLocations" target="_function1" /></aslist></p>
    <p><aslist><copy prop="extremumValues" target="_function1" /></aslist></p>

    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let f = components['/_function1'];

      // values of extrema computed in Sage
      let minimumLocations = [-2.29152990292159];
      let minimumValues = [0.150710261517204];
      let maximumLocations = [-11.6660173492088, 3.18454272065031, 9.77300453148004];
      let maximumValues = [0.00247762462709702, -1.92014417815870, 0.0129202046449760]

      expect(f.stateValues.numberMaxima).eq(3);
      expect(f.stateValues.numberMinima).eq(1);
      expect(f.stateValues.numberExtrema).eq(4);

      // Note: since just one value, the arrayEntries minimumValues and minimumLocations
      // are not arrays.
      expect(f.stateValues.minimumValues).closeTo(minimumValues[0], 0.000001);
      expect(f.stateValues.minimumLocations).closeTo(minimumLocations[0], 0.000001);
      for (let i in maximumLocations) {
        expect(f.stateValues.maximumValues[i]).closeTo(maximumValues[i], 0.000001);
        expect(f.stateValues.maximumLocations[i]).closeTo(maximumLocations[i], 0.000001);
      }

    });

  });

  it('intervals of extrema are not counted', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function through="(-8,7) (-7,2) (-6,2) (-4,3) (-2,5) (8,5) (10,4)" />
    <copy prop="extrema" target="_function1" />
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let f = components['/_function1'];
      expect(f.stateValues.numberMaxima).eq(0);
      expect(f.stateValues.numberMinima).eq(0);
      expect(f.stateValues.numberExtrema).eq(0);

    });

  });

  it('extrema of function with restricted domain, not explicit', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function>
      log(x^2-1)*sqrt((x-5)^2-1)
    </function>
    <copy prop="extrema" target="_function1" />
    </graph>

    <p><aslist><copy prop="maximumLocations" target="_function1" /></aslist></p>
    <p><aslist><copy prop="maximumValues" target="_function1" /></aslist></p>
    <p><aslist><copy prop="minimumLocations" target="_function1" /></aslist></p>
    <p><aslist><copy prop="minimumValues" target="_function1" /></aslist></p>
    <p><aslist><copy prop="extremumLocations" target="_function1" /></aslist></p>
    <p><aslist><copy prop="extremumValues" target="_function1" /></aslist></p>

    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');


    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let f = components['/_function1'];
      expect(f.stateValues.numberMaxima).eq(1);
      expect(f.stateValues.numberMinima).eq(0);
      expect(f.stateValues.numberExtrema).eq(1);

      expect(f.stateValues.maximumLocations).closeTo(2.614, 0.001);
      expect(f.stateValues.maximumValues).closeTo(3.820, 0.001);

    });

  });

  it('extrema in flat regions of functions', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function name="f1">2-(x-1.0131)^10</function>
    <function name="f2">3+(x+pi)^20</function>
    <function name="f3" domain="(1,5)">-8+3/(1+exp(-100sin(3x)))</function>

    <copy prop="extrema" target="f1" />
    <copy prop="extrema" target="f2" />
    <copy prop="extrema" target="f3" />
    </graph>


    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let f1 = components['/f1'];
      let f2 = components['/f2'];
      let f3 = components['/f3'];
      expect(f1.stateValues.numberMaxima).eq(1);
      expect(f1.stateValues.numberMinima).eq(0);
      expect(f1.stateValues.numberExtrema).eq(1);
      expect((await f1.stateValues.maxima)[0][0]).closeTo(1.0131, 1E-6);
      expect(f1.stateValues.maxima[0][1]).eq(2)
      expect((await f1.stateValues.extrema)[0][0]).closeTo(1.0131, 1E-6);
      expect(f1.stateValues.extrema[0][1]).eq(2)

      expect(f2.stateValues.numberMaxima).eq(0);
      expect(f2.stateValues.numberMinima).eq(1);
      expect(f2.stateValues.numberExtrema).eq(1);
      expect((await f2.stateValues.minima)[0][0]).closeTo(-Math.PI, 1E-6);
      expect(f2.stateValues.minima[0][1]).eq(3)
      expect((await f2.stateValues.extrema)[0][0]).closeTo(-Math.PI, 1E-6);
      expect(f2.stateValues.extrema[0][1]).eq(3)

      expect(f3.stateValues.numberMaxima).eq(2);
      expect(f3.stateValues.numberMinima).eq(2);
      expect(f3.stateValues.numberExtrema).eq(4);
      expect((await f3.stateValues.minima)[0][0]).closeTo(3 * Math.PI / 6, 1E-6);
      expect(f3.stateValues.minima[0][1]).eq(-8)
      expect(f3.stateValues.minima[1][0]).closeTo(7 * Math.PI / 6, 1E-6);
      expect(f3.stateValues.minima[1][1]).eq(-8)
      expect((await f3.stateValues.maxima)[0][0]).closeTo(5 * Math.PI / 6, 1E-6);
      expect(f3.stateValues.maxima[0][1]).eq(-5)
      expect(f3.stateValues.maxima[1][0]).closeTo(9 * Math.PI / 6, 1E-6);
      expect(f3.stateValues.maxima[1][1]).eq(-5)
      expect((await f3.stateValues.extrema)[0][0]).closeTo(3 * Math.PI / 6, 1E-6);
      expect(f3.stateValues.extrema[0][1]).eq(-8)
      expect(f3.stateValues.extrema[1][0]).closeTo(5 * Math.PI / 6, 1E-6);
      expect(f3.stateValues.extrema[1][1]).eq(-5)
      expect(f3.stateValues.extrema[2][0]).closeTo(7 * Math.PI / 6, 1E-6);
      expect(f3.stateValues.extrema[2][1]).eq(-8)
      expect(f3.stateValues.extrema[3][0]).closeTo(9 * Math.PI / 6, 1E-6);
      expect(f3.stateValues.extrema[3][1]).eq(-5)


    });

  });

  it('two functions with mutual dependence', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <point>(1,2)</point>
    <point>(3,4)</point>
    <point>(-5,7)</point>
    <point>(8,-1)</point>
    <function yscale="5" maxima="($(_function2{prop='numbermaxima'}),$(_function2{prop='numberminima'}))" through="(-8,5) (9,10)" />
    
    <function yscale="$(_function1{prop='yscale'})" through="$_point1 $_point2 $_point3 $_point4 " maxima="(0, )" />
    </graph>
    
    <p>Number of maxima: <copy prop="numbermaxima" name="numbermaxima" target="_function2" /></p>
    <p>Number of minima: <copy prop="numberminima" name="numberminima" target="_function2" /></p>
    
    <p><aslist><copy prop="maximumLocations" target="_function1" /></aslist></p>
    <p><aslist><copy prop="maximumValues" target="_function1" /></aslist></p>
    <p><aslist><copy prop="minimumLocations" target="_function1" /></aslist></p>
    <p><aslist><copy prop="minimumValues" target="_function1" /></aslist></p>
    <p><aslist><copy prop="extremumLocations" target="_function1" /></aslist></p>
    <p><aslist><copy prop="extremumValues" target="_function1" /></aslist></p>

    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let numberMaximaAnchor = cesc('#' + components["/numbermaxima"].replacements[0].componentName);
      let numberMinimaAnchor = cesc('#' + components["/numberminima"].replacements[0].componentName);

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let f1 = components['/_function1'];
        let f2 = components['/_function2'];
        expect(await f1.stateValues.numberMaxima).eq(1);
        expect(await f1.stateValues.numberMinima).eq(2);
        expect(await f1.stateValues.numberExtrema).eq(3);
        expect(await f2.stateValues.numberMaxima).eq(2);
        expect(await f2.stateValues.numberMinima).eq(1);
        expect(await f2.stateValues.numberExtrema).eq(3);

        expect(await f1.stateValues.maximumLocations).eq(2);
        expect(await f1.stateValues.maximumValues).eq(1);

        expect(await f1.stateValues.xscale).eq(1);
        expect(await f1.stateValues.yscale).eq(5);
        expect(await f2.stateValues.xscale).eq(1);
        expect(await f2.stateValues.yscale).eq(5);

      });

      cy.get(numberMaximaAnchor).should('have.text', '2')
      cy.get(numberMinimaAnchor).should('have.text', '1')

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        await components['/_point1'].movePoint({ x: 2, y: 6 })

        let f1 = components['/_function1'];
        let f2 = components['/_function2'];
        expect(await f1.stateValues.numberMaxima).eq(1);
        expect(await f1.stateValues.numberMinima).eq(2);
        expect(await f1.stateValues.numberExtrema).eq(3);
        expect(await f2.stateValues.numberMaxima).eq(1);
        expect(await f2.stateValues.numberMinima).eq(0);
        expect(await f2.stateValues.numberExtrema).eq(1);

        expect(await f1.stateValues.maximumLocations).eq(1);
        expect(await f1.stateValues.maximumValues).eq(0);

      });

      cy.get(numberMaximaAnchor).should('have.text', '1')
      cy.get(numberMinimaAnchor).should('have.text', '0')


      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        await components['/_point2'].movePoint({ x: 3, y: 7 })
        await components['/_point3'].movePoint({ x: 9, y: 0 })

        let f1 = components['/_function1'];
        let f2 = components['/_function2'];
        expect(await f1.stateValues.numberMaxima).eq(1);
        expect(await f1.stateValues.numberMinima).eq(2);
        expect(await f1.stateValues.numberExtrema).eq(3);
        expect(await f2.stateValues.numberMaxima).eq(2);
        expect(await f2.stateValues.numberMinima).eq(2);
        expect(await f2.stateValues.numberExtrema).eq(4);

        expect(await f1.stateValues.maximumLocations).eq(2);
        expect(await f1.stateValues.maximumValues).eq(2);

      });

      cy.get(numberMaximaAnchor).should('have.text', '2')
      cy.get(numberMinimaAnchor).should('have.text', '2')


    })

  });

  it('shadowed works correctly with initially unresolved', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput />
    <mathinput />
    
    <function xscale="$_mathinput1">$_mathinput2 x^3+1</function>
    
    <graph>
      <copy name="f1a" target="_function1" />
    </graph>
    <p><copy prop="xscale" target="f1a" /></p>
    <p><copy prop="xscale" target="_function1" /></p>
    
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/_p1').should('have.text', 'NaN')
    cy.get('#\\/_p2').should('have.text', 'NaN')

    cy.get('#\\/_mathinput1 textarea').type('1{enter}', { force: true })
    cy.get('#\\/_mathinput2 textarea').type('2{enter}', { force: true })

    cy.get('#\\/_p1').should('have.text', '1')
    cy.get('#\\/_p2').should('have.text', '1')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      expect((await components["/_function1"].stateValues.fs)[0](-2)).eq(2 * (-2) ** 3 + 1)
    });


    cy.get('#\\/_mathinput1 textarea').type('{end}{backspace}3{enter}', { force: true })
    cy.get('#\\/_mathinput2 textarea').type('{end}{backspace}4{enter}', { force: true })

    cy.get('#\\/_p1').should('have.text', '3')
    cy.get('#\\/_p2').should('have.text', '3')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      expect((await components["/_function1"].stateValues.fs)[0](-2)).eq(4 * (-2) ** 3 + 1)
    });

  });

  it('extrema of quartic, copied multiple times', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput prefill="1" />
    <mathinput prefill="0" />
    <mathinput prefill="-2" />
    
    <function>$_mathinput1 x^4 + $_mathinput2 x^3 +$_mathinput3 x^2 +1</function>
    
    <graph>
      <copy name="f1a" target="_function1" />
      <copy name="maxima" prop="maxima" target="_function1" />
      <copy name="minima" prop="minima" target="f1a" />
    </graph>
    <graph>
      <copy name="f1b" target="f1a" />
      <copy name="extremum1" prop="extremum1" target="f1b" />
      <copy name="extremum2" prop="extremum2" target="f1b" />
      <copy name="extremum3" prop="extremum3" target="f1b" />
    </graph>
    
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      expect(components["/maxima"].replacements.length).eq(1);
      let max1 = components["/maxima"].replacements[0].stateValues.coords.tree;
      expect(max1[1]).closeTo(0, 0.00001);
      expect(max1[2]).closeTo(1, 0.00001);
      expect(components["/minima"].replacements.length).eq(2);
      let min1 = components["/minima"].replacements[0].stateValues.coords.tree;
      expect(min1[1]).closeTo(-1, 0.00001)
      expect(min1[2]).closeTo(0, 0.00001)
      let min2 = components["/minima"].replacements[1].stateValues.coords.tree;
      expect(min2[1]).closeTo(1, 0.00001)
      expect(min2[2]).closeTo(0, 0.00001)
      expect(components["/extremum1"].replacements.length).eq(1);
      expect(components["/extremum1"].replacements[0].stateValues.coords.tree).eqls(min1);
      expect(components["/extremum2"].replacements.length).eq(1);
      expect(components["/extremum2"].replacements[0].stateValues.coords.tree).eqls(max1);
      expect(components["/extremum3"].replacements.length).eq(1);
      expect(components["/extremum3"].replacements[0].stateValues.coords.tree).eqls(min2);

    });

    cy.get("#\\/_mathinput2 textarea").type('{end}{backspace}2{enter}', { force: true });

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      expect(components["/maxima"].replacements.length).eq(1)
      let max1 = components["/maxima"].replacements[0].stateValues.coords.tree;
      expect(max1[1]).closeTo(0, 0.00001);
      expect(max1[2]).closeTo(1, 0.00001);
      expect(components["/minima"].replacements.length).eq(2);
      let min1 = components["/minima"].replacements[0].stateValues.coords.tree;
      expect(min1[1]).closeTo(-2, 0.00001)
      expect(min1[2]).closeTo(-7, 0.00001)

      let min2 = components["/minima"].replacements[1].stateValues.coords.tree;
      expect(min2[1]).closeTo(0.5, 0.00001)
      expect(min2[2]).closeTo(13 / 16, 0.00001)

      expect(components["/extremum1"].replacements.length).eq(1);
      expect(components["/extremum1"].replacements[0].stateValues.coords.tree).eqls(min1);
      expect(components["/extremum2"].replacements.length).eq(1);
      expect(components["/extremum2"].replacements[0].stateValues.coords.tree).eqls(max1);
      expect(components["/extremum3"].replacements.length).eq(1);
      expect(components["/extremum3"].replacements[0].stateValues.coords.tree).eqls(min2);

    });

    cy.get("#\\/_mathinput1 textarea").type('{end}{backspace}-1{enter}', { force: true });

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      expect(components["/maxima"].replacements.length).eq(1);
      let max1 = components["/maxima"].replacements[0].stateValues.coords.tree;
      expect(max1[1]).closeTo(0, 0.00001);
      expect(max1[2]).closeTo(1, 0.00001);

      expect(components["/minima"].replacements.length).eq(0);

      expect(components["/extremum1"].replacements.length).eq(1);
      expect(components["/extremum1"].replacements[0].stateValues.coords.tree).eqls(max1);

      expect(components["/extremum2"].replacements.length).eq(0);
      expect(components["/extremum3"].replacements.length).eq(0);

    });
  });

  it('function of function can redefine variable', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <function variables="t" name="f" symbolic>st^3</function>

    <function name="f2" symbolic><copy target="f"/></function>
    <function name="f3" variables="s" symbolic><copy target="f"/></function>

    <copy name="f4" target="f"/>
    <copy name="f5" target="f2"/>
    <copy name="f6" target="f3"/>

    <copy prop="variable" target="f" name="fv" />
    <copy prop="variable" target="f2" name="f2v" />
    <copy prop="variable" target="f3" name="f3v" />
    <copy prop="variable" target="f4" name="f4v" />
    <copy prop="variable" target="f5" name="f5v" />
    <copy prop="variable" target="f6" name="f6v" />

    <p name="fOfu">$$f(u)</p>
    <p name="f2Ofu">$$f2(u)</p>
    <p name="f3Ofu">$$f3(u)</p>
    <p name="f4Ofu">$$f4(u)</p>
    <p name="f5Ofu">$$f5(u)</p>
    <p name="f6Ofu">$$f6(u)</p>
    
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');


    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let variable1Anchor = cesc('#' + components["/fv"].replacements[0].componentName);
      let variable2Anchor = cesc('#' + components["/f2v"].replacements[0].componentName);
      let variable3Anchor = cesc('#' + components["/f3v"].replacements[0].componentName);
      let variable4Anchor = cesc('#' + components["/f4v"].replacements[0].componentName);
      let variable5Anchor = cesc('#' + components["/f5v"].replacements[0].componentName);
      let variable6Anchor = cesc('#' + components["/f6v"].replacements[0].componentName);

      cy.get(variable1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('t')
      })
      cy.get(variable2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('t')
      })
      cy.get(variable3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('s')
      })
      cy.get(variable4Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('t')
      })
      cy.get(variable5Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('t')
      })
      cy.get(variable6Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('s')
      })
      cy.get("#\\/fOfu").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('su3')
      })
      cy.get("#\\/f2Ofu").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('su3')
      })
      cy.get("#\\/f3Ofu").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('ut3')
      })
      cy.get("#\\/f4Ofu").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('su3')
      })
      cy.get("#\\/f5Ofu").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('su3')
      })
      cy.get("#\\/f6Ofu").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('ut3')
      })

      cy.window().then(async (win) => {

        expect((await components["/f"].stateValues.variables)[0].tree).eq('t');
        expect((await components["/f2"].stateValues.variables)[0].tree).eq('t');
        expect((await components["/f3"].stateValues.variables)[0].tree).eq('s');
        expect((await components["/f4"].replacements[0].stateValues.variables)[0].tree).eq('t');
        expect((await components["/f5"].replacements[0].stateValues.variables)[0].tree).eq('t');
        expect((await components["/f6"].replacements[0].stateValues.variables)[0].tree).eq('s');

        expect((await components["/f"].stateValues.formula).tree).eqls(["*", "s", ["^", "t", 3]]);
        expect((await components["/f2"].stateValues.formula).tree).eqls(["*", "s", ["^", "t", 3]]);
        expect((await components["/f3"].stateValues.formula).tree).eqls(["*", "s", ["^", "t", 3]]);
        expect((await components["/f4"].replacements[0].stateValues.formula).tree).eqls(["*", "s", ["^", "t", 3]]);
        expect((await components["/f5"].replacements[0].stateValues.formula).tree).eqls(["*", "s", ["^", "t", 3]]);
        expect((await components["/f6"].replacements[0].stateValues.formula).tree).eqls(["*", "s", ["^", "t", 3]]);

        expect((await components["/fOfu"].activeChildren[0].stateValues.value).tree).eqls(["*", "s", ["^", "u", 3]]);
        expect((await components["/f2Ofu"].activeChildren[0].stateValues.value).tree).eqls(["*", "s", ["^", "u", 3]]);
        expect((await components["/f3Ofu"].activeChildren[0].stateValues.value).tree).eqls(["*", "u", ["^", "t", 3]]);
        expect((await components["/f4Ofu"].activeChildren[0].stateValues.value).tree).eqls(["*", "s", ["^", "u", 3]]);
        expect((await components["/f5Ofu"].activeChildren[0].stateValues.value).tree).eqls(["*", "s", ["^", "u", 3]]);
        expect((await components["/f6Ofu"].activeChildren[0].stateValues.value).tree).eqls(["*", "u", ["^", "t", 3]]);

      })
    });

  });

  it('function of interpolated function can redefine variable without changing function', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <function minima="(2)" name="f" />

    <function name="f2"><copy target="f"/></function>
    <function name="f3" variables="s"><copy target="f"/></function>

    <copy name="f4" target="f"/>
    <copy name="f5" target="f2"/>
    <copy name="f6" target="f3"/>

    <copy prop="variable" target="f" name="fv" />
    <copy prop="variable" target="f2" name="f2v" />
    <copy prop="variable" target="f3" name="f3v" />
    <copy prop="variable" target="f4" name="f4v" />
    <copy prop="variable" target="f5" name="f5v" />
    <copy prop="variable" target="f6" name="f6v" />

    <p name="fOf0">$$f(0)</p>
    <p name="f2Of0">$$f2(0)</p>
    <p name="f3Of0">$$f3(0)</p>
    <p name="f4Of0">$$f4(0)</p>
    <p name="f5Of0">$$f5(0)</p>
    <p name="f6Of0">$$f6(0)</p>

    <p name="fOf1">$$f(1)</p>
    <p name="f2Of1">$$f2(1)</p>
    <p name="f3Of1">$$f3(1)</p>
    <p name="f4Of1">$$f4(1)</p>
    <p name="f5Of1">$$f5(1)</p>
    <p name="f6Of1">$$f6(1)</p>

    <p name="fOf2">$$f(2)</p>
    <p name="f2Of2">$$f2(2)</p>
    <p name="f3Of2">$$f3(2)</p>
    <p name="f4Of2">$$f4(2)</p>
    <p name="f5Of2">$$f5(2)</p>
    <p name="f6Of2">$$f6(2)</p>

    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let variable1Anchor = cesc('#' + components["/fv"].replacements[0].componentName);
      let variable2Anchor = cesc('#' + components["/f2v"].replacements[0].componentName);
      let variable3Anchor = cesc('#' + components["/f3v"].replacements[0].componentName);
      let variable4Anchor = cesc('#' + components["/f4v"].replacements[0].componentName);
      let variable5Anchor = cesc('#' + components["/f5v"].replacements[0].componentName);
      let variable6Anchor = cesc('#' + components["/f6v"].replacements[0].componentName);

      cy.get(variable1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      })
      cy.get(variable2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      })
      cy.get(variable3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('s')
      })
      cy.get(variable4Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      })
      cy.get(variable5Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      })
      cy.get(variable6Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('s')
      })
      cy.get("#\\/fOf0").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
      cy.get("#\\/f2Of0").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
      cy.get("#\\/f3Of0").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
      cy.get("#\\/f4Of0").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
      cy.get("#\\/f5Of0").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
      cy.get("#\\/f6Of0").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
      cy.get("#\\/fOf1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get("#\\/f2Of1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get("#\\/f3Of1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get("#\\/f4Of1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get("#\\/f5Of1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get("#\\/f6Of1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get("#\\/fOf2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('6')
      })
      cy.get("#\\/f2Of2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('6')
      })
      cy.get("#\\/f3Of2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('6')
      })
      cy.get("#\\/f4Of2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('6')
      })
      cy.get("#\\/f5Of2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('6')
      })
      cy.get("#\\/f6Of2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('6')
      })

    });

  });


  it('extrema not resolved if not requested', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <function name="f">sin(x)</function>
    <copy assignNames="f2" target="f" />
    <function name="f3">$f</function>
    <function name="g" maxima="(1,2) (4,3)" />
    <copy assignNames="g2" target="g" />
    <function name="g3">$g</function>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');


    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      expect(components["/f"].state.formula.isResolved).eq(true);
      expect(components["/f"].state.symbolicfs.isResolved).eq(false);
      expect(components["/f"].state.numericalfs.isResolved).eq(false);
      expect(components["/f"].state.allMaxima.isResolved).eq(false);
      expect(components["/f"].state.allMinima.isResolved).eq(false);
      expect(components["/f"].state.allExtrema.isResolved).eq(false);
      expect(components["/f"].state.numberMaxima.isResolved).eq(false);
      expect(components["/f"].state.numberMinima.isResolved).eq(false);
      expect(components["/f"].state.numberExtrema.isResolved).eq(false);
      expect(components["/f"].state.maxima.isResolved).eq(false);
      expect(components["/f"].state.minima.isResolved).eq(false);
      expect(components["/f"].state.extrema.isResolved).eq(false);

      expect(components["/f2"].state.formula.isResolved).eq(true);
      expect(components["/f2"].state.symbolicfs.isResolved).eq(false);
      expect(components["/f2"].state.numericalfs.isResolved).eq(false);
      expect(components["/f2"].state.allMaxima.isResolved).eq(false);
      expect(components["/f2"].state.allMinima.isResolved).eq(false);
      expect(components["/f2"].state.allExtrema.isResolved).eq(false);
      expect(components["/f2"].state.numberMaxima.isResolved).eq(false);
      expect(components["/f2"].state.numberMinima.isResolved).eq(false);
      expect(components["/f2"].state.numberExtrema.isResolved).eq(false);
      expect(components["/f2"].state.maxima.isResolved).eq(false);
      expect(components["/f2"].state.minima.isResolved).eq(false);
      expect(components["/f2"].state.extrema.isResolved).eq(false);

      expect(components["/f3"].state.formula.isResolved).eq(true);
      expect(components["/f3"].state.symbolicfs.isResolved).eq(false);
      expect(components["/f3"].state.numericalfs.isResolved).eq(false);
      expect(components["/f3"].state.allMaxima.isResolved).eq(false);
      expect(components["/f3"].state.allMinima.isResolved).eq(false);
      expect(components["/f3"].state.allExtrema.isResolved).eq(false);
      expect(components["/f3"].state.numberMaxima.isResolved).eq(false);
      expect(components["/f3"].state.numberMinima.isResolved).eq(false);
      expect(components["/f3"].state.numberExtrema.isResolved).eq(false);
      expect(components["/f3"].state.maxima.isResolved).eq(false);
      expect(components["/f3"].state.minima.isResolved).eq(false);
      expect(components["/f3"].state.extrema.isResolved).eq(false);

      expect(components["/g"].state.formula.isResolved).eq(true);
      expect(components["/g"].state.symbolicfs.isResolved).eq(false);
      expect(components["/g"].state.numericalfs.isResolved).eq(false);
      expect(components["/g"].state.allMaxima.isResolved).eq(false);
      expect(components["/g"].state.allMinima.isResolved).eq(false);
      expect(components["/g"].state.allExtrema.isResolved).eq(false);
      expect(components["/g"].state.numberMaxima.isResolved).eq(false);
      expect(components["/g"].state.numberMinima.isResolved).eq(false);
      expect(components["/g"].state.numberExtrema.isResolved).eq(false);
      expect(components["/g"].state.maxima.isResolved).eq(false);
      expect(components["/g"].state.minima.isResolved).eq(false);
      expect(components["/g"].state.extrema.isResolved).eq(false);

      expect(components["/g2"].state.formula.isResolved).eq(true);
      expect(components["/g2"].state.symbolicfs.isResolved).eq(false);
      expect(components["/g2"].state.numericalfs.isResolved).eq(false);
      expect(components["/g2"].state.allMaxima.isResolved).eq(false);
      expect(components["/g2"].state.allMinima.isResolved).eq(false);
      expect(components["/g2"].state.allExtrema.isResolved).eq(false);
      expect(components["/g2"].state.numberMaxima.isResolved).eq(false);
      expect(components["/g2"].state.numberMinima.isResolved).eq(false);
      expect(components["/g2"].state.numberExtrema.isResolved).eq(false);
      expect(components["/g2"].state.maxima.isResolved).eq(false);
      expect(components["/g2"].state.minima.isResolved).eq(false);
      expect(components["/g2"].state.extrema.isResolved).eq(false);

      expect(components["/g3"].state.formula.isResolved).eq(true);
      expect(components["/g3"].state.symbolicfs.isResolved).eq(false);
      expect(components["/g3"].state.numericalfs.isResolved).eq(false);
      expect(components["/g3"].state.allMaxima.isResolved).eq(false);
      expect(components["/g3"].state.allMinima.isResolved).eq(false);
      expect(components["/g3"].state.allExtrema.isResolved).eq(false);
      expect(components["/g3"].state.numberMaxima.isResolved).eq(false);
      expect(components["/g3"].state.numberMinima.isResolved).eq(false);
      expect(components["/g3"].state.numberExtrema.isResolved).eq(false);
      expect(components["/g3"].state.maxima.isResolved).eq(false);
      expect(components["/g3"].state.minima.isResolved).eq(false);
      expect(components["/g3"].state.extrema.isResolved).eq(false);
    });

  });

  it('function determined by formula, specify 1 input', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <function nInputs="1">3/(1+e^(-x/2))</function>
    </graph>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(await components['/_function1'].stateValues.nInputs).eq(1);

      let f = (await components['/_function1'].stateValues.fs)[0];
      let numericalf = (await components['/_function1'].stateValues.numericalfs)[0];
      let symbolicf = (await components['/_function1'].stateValues.symbolicfs)[0];

      expect(f(-5)).closeTo(3 / (1 + Math.exp(5 / 2)), 1E-12);
      expect(f(1)).closeTo(3 / (1 + Math.exp(-1 / 2)), 1E-12);
      expect(numericalf(-5)).closeTo(3 / (1 + Math.exp(5 / 2)), 1E-12);
      expect(numericalf(1)).closeTo(3 / (1 + Math.exp(-1 / 2)), 1E-12);
      expect(symbolicf(-5).equals(me.fromText('3/(1+e^(5/2))'))).eq(true)
      expect(symbolicf(1).equals(me.fromText('3/(1+e^(-1/2))'))).eq(true)
      expect(symbolicf('z').equals(me.fromText('3/(1+e^(-z/2))'))).eq(true)

    })
  });

  it('function of two variables determined by formula', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <function nInputs="2">3/(y+e^(-x/2))</function>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(await components['/_function1'].stateValues.nInputs).eq(2);

      let f = (await components['/_function1'].stateValues.fs)[0];
      let numericalf = (await components['/_function1'].stateValues.numericalfs)[0];
      let symbolicf = (await components['/_function1'].stateValues.symbolicfs)[0];

      expect(f(-5, 7)).closeTo(3 / (7 + Math.exp(5 / 2)), 1E-12);
      expect(f(1, 4)).closeTo(3 / (4 + Math.exp(-1 / 2)), 1E-12);
      expect(numericalf(-5, 7)).closeTo(3 / (7 + Math.exp(5 / 2)), 1E-12);
      expect(numericalf(1, 4)).closeTo(3 / (4 + Math.exp(-1 / 2)), 1E-12);
      expect(symbolicf(-5, 7).equals(me.fromText('3/(7+e^(5/2))'))).eq(true)
      expect(symbolicf(1, 4).equals(me.fromText('3/(4+e^(-1/2))'))).eq(true)
      expect(symbolicf('z', 'a').equals(me.fromText('3/(a+e^(-z/2))'))).eq(true)

    })
  });

  it('function of two variables determined by formula, specify variables', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <function nInputs="2" variables="q r">3/(r+e^(-q/2))</function>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(await components['/_function1'].stateValues.nInputs).eq(2);

      let f = (await components['/_function1'].stateValues.fs)[0];
      let numericalf = (await components['/_function1'].stateValues.numericalfs)[0];
      let symbolicf = (await components['/_function1'].stateValues.symbolicfs)[0];

      expect(f(-5, 7)).closeTo(3 / (7 + Math.exp(5 / 2)), 1E-12);
      expect(f(1, 4)).closeTo(3 / (4 + Math.exp(-1 / 2)), 1E-12);
      expect(numericalf(-5, 7)).closeTo(3 / (7 + Math.exp(5 / 2)), 1E-12);
      expect(numericalf(1, 4)).closeTo(3 / (4 + Math.exp(-1 / 2)), 1E-12);
      expect(symbolicf(-5, 7).equals(me.fromText('3/(7+e^(5/2))'))).eq(true)
      expect(symbolicf(1, 4).equals(me.fromText('3/(4+e^(-1/2))'))).eq(true)
      expect(symbolicf('z', 'a').equals(me.fromText('3/(a+e^(-z/2))'))).eq(true)

    })
  });

  it('function of two variables determined by formula, specify variables, no nInputs specified', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <function variables="q r">3/(r+e^(-q/2))</function>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(await components['/_function1'].stateValues.nInputs).eq(2);

      let f = (await components['/_function1'].stateValues.fs)[0];
      let numericalf = (await components['/_function1'].stateValues.numericalfs)[0];
      let symbolicf = (await components['/_function1'].stateValues.symbolicfs)[0];

      expect(f(-5, 7)).closeTo(3 / (7 + Math.exp(5 / 2)), 1E-12);
      expect(f(1, 4)).closeTo(3 / (4 + Math.exp(-1 / 2)), 1E-12);
      expect(numericalf(-5, 7)).closeTo(3 / (7 + Math.exp(5 / 2)), 1E-12);
      expect(numericalf(1, 4)).closeTo(3 / (4 + Math.exp(-1 / 2)), 1E-12);
      expect(symbolicf(-5, 7).equals(me.fromText('3/(7+e^(5/2))'))).eq(true)
      expect(symbolicf(1, 4).equals(me.fromText('3/(4+e^(-1/2))'))).eq(true)
      expect(symbolicf('z', 'a').equals(me.fromText('3/(a+e^(-z/2))'))).eq(true)

    })
  });

  it('function of three variables determined by formula', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <function nInputs="3">z/(y+e^(-x/2))</function>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(await components['/_function1'].stateValues.nInputs).eq(3);

      let f = (await components['/_function1'].stateValues.fs)[0];
      let numericalf = (await components['/_function1'].stateValues.numericalfs)[0];
      let symbolicf = (await components['/_function1'].stateValues.symbolicfs)[0];

      expect(f(-5, 7, -2)).closeTo(-2 / (7 + Math.exp(5 / 2)), 1E-12);
      expect(f(1, 4, -9)).closeTo(-9 / (4 + Math.exp(-1 / 2)), 1E-12);
      expect(numericalf(-5, 7, -2)).closeTo(-2 / (7 + Math.exp(5 / 2)), 1E-12);
      expect(numericalf(1, 4, -9)).closeTo(-9 / (4 + Math.exp(-1 / 2)), 1E-12);
      expect(symbolicf(-5, 7, -2).equals(me.fromText('-2/(7+e^(5/2))'))).eq(true)
      expect(symbolicf(1, 4, -9).equals(me.fromText('-9/(4+e^(-1/2))'))).eq(true)
      expect(symbolicf('z', 'a', 'u').equals(me.fromText('u/(a+e^(-z/2))'))).eq(true)

    })
  });

  it('function of three variables determined by formula, specify variables', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <function variables="q r s">s/(r+e^(-q/2))</function>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(await components['/_function1'].stateValues.nInputs).eq(3);

      let f = (await components['/_function1'].stateValues.fs)[0];
      let numericalf = (await components['/_function1'].stateValues.numericalfs)[0];
      let symbolicf = (await components['/_function1'].stateValues.symbolicfs)[0];

      expect(f(-5, 7, -2)).closeTo(-2 / (7 + Math.exp(5 / 2)), 1E-12);
      expect(f(1, 4, -9)).closeTo(-9 / (4 + Math.exp(-1 / 2)), 1E-12);
      expect(numericalf(-5, 7, -2)).closeTo(-2 / (7 + Math.exp(5 / 2)), 1E-12);
      expect(numericalf(1, 4, -9)).closeTo(-9 / (4 + Math.exp(-1 / 2)), 1E-12);
      expect(symbolicf(-5, 7, -2).equals(me.fromText('-2/(7+e^(5/2))'))).eq(true)
      expect(symbolicf(1, 4, -9).equals(me.fromText('-9/(4+e^(-1/2))'))).eq(true)
      expect(symbolicf('z', 'a', 'u').equals(me.fromText('u/(a+e^(-z/2))'))).eq(true)

    })
  });

  it('function of four variables determined by formula', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <function nInputs="4">x_3/(x_2+e^(-x_1/2))+x_4</function>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(await components['/_function1'].stateValues.nInputs).eq(4);

      let f = (await components['/_function1'].stateValues.fs)[0];
      let numericalf = (await components['/_function1'].stateValues.numericalfs)[0];
      let symbolicf = (await components['/_function1'].stateValues.symbolicfs)[0];

      expect(f(-5, 7, -2, 6)).closeTo(-2 / (7 + Math.exp(5 / 2)) + 6, 1E-12);
      expect(f(1, 4, -9, -8)).closeTo(-9 / (4 + Math.exp(-1 / 2)) - 8, 1E-12);
      expect(numericalf(-5, 7, -2, 6)).closeTo(-2 / (7 + Math.exp(5 / 2)) + 6, 1E-12);
      expect(numericalf(1, 4, -9, -8)).closeTo(-9 / (4 + Math.exp(-1 / 2)) - 8, 1E-12);
      expect(symbolicf(-5, 7, -2, 6).equals(me.fromText('-2/(7+e^(5/2))+6'))).eq(true)
      expect(symbolicf(1, 4, -9, -8).equals(me.fromText('-9/(4+e^(-1/2))-8'))).eq(true)
      expect(symbolicf('z', 'a', 'u', 'p').equals(me.fromText('u/(a+e^(-z/2))+p'))).eq(true)

    })
  });

  it('function of four variables determined by formula, specify some variables', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <function nInputs="4" variables="x y z">z/(y+e^(-x/2))+x_4</function>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(await components['/_function1'].stateValues.nInputs).eq(4);

      let f = (await components['/_function1'].stateValues.fs)[0];
      let numericalf = (await components['/_function1'].stateValues.numericalfs)[0];
      let symbolicf = (await components['/_function1'].stateValues.symbolicfs)[0];

      expect(f(-5, 7, -2, 6)).closeTo(-2 / (7 + Math.exp(5 / 2)) + 6, 1E-12);
      expect(f(1, 4, -9, -8)).closeTo(-9 / (4 + Math.exp(-1 / 2)) - 8, 1E-12);
      expect(numericalf(-5, 7, -2, 6)).closeTo(-2 / (7 + Math.exp(5 / 2)) + 6, 1E-12);
      expect(numericalf(1, 4, -9, -8)).closeTo(-9 / (4 + Math.exp(-1 / 2)) - 8, 1E-12);
      expect(symbolicf(-5, 7, -2, 6).equals(me.fromText('-2/(7+e^(5/2))+6'))).eq(true)
      expect(symbolicf(1, 4, -9, -8).equals(me.fromText('-9/(4+e^(-1/2))-8'))).eq(true)
      expect(symbolicf('z', 'a', 'u', 'p').equals(me.fromText('u/(a+e^(-z/2))+p'))).eq(true)

    })
  });

  it('2D vector-valued function of a single variable', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <function>(x^2, x^3)</function>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(await components['/_function1'].stateValues.nInputs).eq(1);
      expect(await components['/_function1'].stateValues.nOutputs).eq(2);

      let f1 = (await components['/_function1'].stateValues.fs)[0];
      let f2 = (await components['/_function1'].stateValues.fs)[1];
      let numericalf1 = (await components['/_function1'].stateValues.numericalfs)[0];
      let numericalf2 = (await components['/_function1'].stateValues.numericalfs)[1];
      let symbolicf1 = (await components['/_function1'].stateValues.symbolicfs)[0];
      let symbolicf2 = (await components['/_function1'].stateValues.symbolicfs)[1];

      expect(f1(-5)).closeTo(25, 1E-12);
      expect(f2(-5)).closeTo(-125, 1E-12);
      expect(f1(3)).closeTo(9, 1E-12);
      expect(f2(3)).closeTo(27, 1E-12);
      expect(numericalf1(-5)).closeTo(25, 1E-12);
      expect(numericalf2(-5)).closeTo(-125, 1E-12);
      expect(numericalf1(3)).closeTo(9, 1E-12);
      expect(numericalf2(3)).closeTo(27, 1E-12);
      expect(symbolicf1(-5).equals(me.fromText('(-5)^2'))).eq(true);
      expect(symbolicf2(-5).equals(me.fromText('(-5)^3'))).eq(true);
      expect(symbolicf1(3).equals(me.fromText('3^2'))).eq(true);
      expect(symbolicf2(3).equals(me.fromText('3^3'))).eq(true);
      expect(symbolicf1('z').equals(me.fromText('z^2'))).eq(true);
      expect(symbolicf2('z').equals(me.fromText('z^3'))).eq(true);


    })
  })

  it('2D vector-valued function of a single variable, specify variable', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <function variables="t">(t^2, t^3)</function>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(await components['/_function1'].stateValues.nInputs).eq(1);
      expect(await components['/_function1'].stateValues.nOutputs).eq(2);

      let f1 = (await components['/_function1'].stateValues.fs)[0];
      let f2 = (await components['/_function1'].stateValues.fs)[1];
      let numericalf1 = (await components['/_function1'].stateValues.numericalfs)[0];
      let numericalf2 = (await components['/_function1'].stateValues.numericalfs)[1];
      let symbolicf1 = (await components['/_function1'].stateValues.symbolicfs)[0];
      let symbolicf2 = (await components['/_function1'].stateValues.symbolicfs)[1];

      expect(f1(-5)).closeTo(25, 1E-12);
      expect(f2(-5)).closeTo(-125, 1E-12);
      expect(f1(3)).closeTo(9, 1E-12);
      expect(f2(3)).closeTo(27, 1E-12);
      expect(numericalf1(-5)).closeTo(25, 1E-12);
      expect(numericalf2(-5)).closeTo(-125, 1E-12);
      expect(numericalf1(3)).closeTo(9, 1E-12);
      expect(numericalf2(3)).closeTo(27, 1E-12);
      expect(symbolicf1(-5).equals(me.fromText('(-5)^2'))).eq(true);
      expect(symbolicf2(-5).equals(me.fromText('(-5)^3'))).eq(true);
      expect(symbolicf1(3).equals(me.fromText('3^2'))).eq(true);
      expect(symbolicf2(3).equals(me.fromText('3^3'))).eq(true);
      expect(symbolicf1('z').equals(me.fromText('z^2'))).eq(true);
      expect(symbolicf2('z').equals(me.fromText('z^3'))).eq(true);


    })
  })

  it('2D vector-valued function of a single variable, specify nOutputs', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <function variables="t" nOutputs="2">(t^2, t^3)</function>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(await components['/_function1'].stateValues.nInputs).eq(1);
      expect(await components['/_function1'].stateValues.nOutputs).eq(2);

      let f1 = (await components['/_function1'].stateValues.fs)[0];
      let f2 = (await components['/_function1'].stateValues.fs)[1];
      let numericalf1 = (await components['/_function1'].stateValues.numericalfs)[0];
      let numericalf2 = (await components['/_function1'].stateValues.numericalfs)[1];
      let symbolicf1 = (await components['/_function1'].stateValues.symbolicfs)[0];
      let symbolicf2 = (await components['/_function1'].stateValues.symbolicfs)[1];

      expect(f1(-5)).closeTo(25, 1E-12);
      expect(f2(-5)).closeTo(-125, 1E-12);
      expect(f1(3)).closeTo(9, 1E-12);
      expect(f2(3)).closeTo(27, 1E-12);
      expect(numericalf1(-5)).closeTo(25, 1E-12);
      expect(numericalf2(-5)).closeTo(-125, 1E-12);
      expect(numericalf1(3)).closeTo(9, 1E-12);
      expect(numericalf2(3)).closeTo(27, 1E-12);
      expect(symbolicf1(-5).equals(me.fromText('(-5)^2'))).eq(true);
      expect(symbolicf2(-5).equals(me.fromText('(-5)^3'))).eq(true);
      expect(symbolicf1(3).equals(me.fromText('3^2'))).eq(true);
      expect(symbolicf2(3).equals(me.fromText('3^3'))).eq(true);
      expect(symbolicf1('z').equals(me.fromText('z^2'))).eq(true);
      expect(symbolicf2('z').equals(me.fromText('z^3'))).eq(true);


    })
  })

  it('3D vector-valued function of a single variable', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <function>(x^2, x^3, x^4)</function>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(await components['/_function1'].stateValues.nInputs).eq(1);
      expect(await components['/_function1'].stateValues.nOutputs).eq(3);

      let f1 = (await components['/_function1'].stateValues.fs)[0];
      let f2 = (await components['/_function1'].stateValues.fs)[1];
      let f3 = (await components['/_function1'].stateValues.fs)[2];
      let numericalf1 = (await components['/_function1'].stateValues.numericalfs)[0];
      let numericalf2 = (await components['/_function1'].stateValues.numericalfs)[1];
      let numericalf3 = (await components['/_function1'].stateValues.numericalfs)[2];
      let symbolicf1 = (await components['/_function1'].stateValues.symbolicfs)[0];
      let symbolicf2 = (await components['/_function1'].stateValues.symbolicfs)[1];
      let symbolicf3 = (await components['/_function1'].stateValues.symbolicfs)[2];

      expect(f1(-5)).closeTo(25, 1E-12);
      expect(f2(-5)).closeTo(-125, 1E-12);
      expect(f3(-5)).closeTo(625, 1E-12);
      expect(f1(3)).closeTo(9, 1E-12);
      expect(f2(3)).closeTo(27, 1E-12);
      expect(f3(3)).closeTo(81, 1E-12);
      expect(numericalf1(-5)).closeTo(25, 1E-12);
      expect(numericalf2(-5)).closeTo(-125, 1E-12);
      expect(numericalf3(-5)).closeTo(625, 1E-12);
      expect(numericalf1(3)).closeTo(9, 1E-12);
      expect(numericalf2(3)).closeTo(27, 1E-12);
      expect(numericalf3(3)).closeTo(81, 1E-12);
      expect(symbolicf1(-5).equals(me.fromText('(-5)^2'))).eq(true);
      expect(symbolicf2(-5).equals(me.fromText('(-5)^3'))).eq(true);
      expect(symbolicf3(-5).equals(me.fromText('(-5)^4'))).eq(true);
      expect(symbolicf1(3).equals(me.fromText('3^2'))).eq(true);
      expect(symbolicf2(3).equals(me.fromText('3^3'))).eq(true);
      expect(symbolicf3(3).equals(me.fromText('3^4'))).eq(true);
      expect(symbolicf1('z').equals(me.fromText('z^2'))).eq(true);
      expect(symbolicf2('z').equals(me.fromText('z^3'))).eq(true);
      expect(symbolicf3('z').equals(me.fromText('z^4'))).eq(true);


    })
  })

  it('3D vector-valued function of a single variable, specify variable', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <function variables="t">(t^2, t^3, t^4)</function>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(await components['/_function1'].stateValues.nInputs).eq(1);
      expect(await components['/_function1'].stateValues.nOutputs).eq(3);

      let f1 = (await components['/_function1'].stateValues.fs)[0];
      let f2 = (await components['/_function1'].stateValues.fs)[1];
      let f3 = (await components['/_function1'].stateValues.fs)[2];
      let numericalf1 = (await components['/_function1'].stateValues.numericalfs)[0];
      let numericalf2 = (await components['/_function1'].stateValues.numericalfs)[1];
      let numericalf3 = (await components['/_function1'].stateValues.numericalfs)[2];
      let symbolicf1 = (await components['/_function1'].stateValues.symbolicfs)[0];
      let symbolicf2 = (await components['/_function1'].stateValues.symbolicfs)[1];
      let symbolicf3 = (await components['/_function1'].stateValues.symbolicfs)[2];

      expect(f1(-5)).closeTo(25, 1E-12);
      expect(f2(-5)).closeTo(-125, 1E-12);
      expect(f3(-5)).closeTo(625, 1E-12);
      expect(f1(3)).closeTo(9, 1E-12);
      expect(f2(3)).closeTo(27, 1E-12);
      expect(f3(3)).closeTo(81, 1E-12);
      expect(numericalf1(-5)).closeTo(25, 1E-12);
      expect(numericalf2(-5)).closeTo(-125, 1E-12);
      expect(numericalf3(-5)).closeTo(625, 1E-12);
      expect(numericalf1(3)).closeTo(9, 1E-12);
      expect(numericalf2(3)).closeTo(27, 1E-12);
      expect(numericalf3(3)).closeTo(81, 1E-12);
      expect(symbolicf1(-5).equals(me.fromText('(-5)^2'))).eq(true);
      expect(symbolicf2(-5).equals(me.fromText('(-5)^3'))).eq(true);
      expect(symbolicf3(-5).equals(me.fromText('(-5)^4'))).eq(true);
      expect(symbolicf1(3).equals(me.fromText('3^2'))).eq(true);
      expect(symbolicf2(3).equals(me.fromText('3^3'))).eq(true);
      expect(symbolicf3(3).equals(me.fromText('3^4'))).eq(true);
      expect(symbolicf1('z').equals(me.fromText('z^2'))).eq(true);
      expect(symbolicf2('z').equals(me.fromText('z^3'))).eq(true);
      expect(symbolicf3('z').equals(me.fromText('z^4'))).eq(true);


    })
  })

  it('2D vector-valued function of two variables', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <function nInputs="2">(x^2y^3, x^3y^2)</function>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(await components['/_function1'].stateValues.nInputs).eq(2);
      expect(await components['/_function1'].stateValues.nOutputs).eq(2);

      let f1 = (await components['/_function1'].stateValues.fs)[0];
      let f2 = (await components['/_function1'].stateValues.fs)[1];
      let numericalf1 = (await components['/_function1'].stateValues.numericalfs)[0];
      let numericalf2 = (await components['/_function1'].stateValues.numericalfs)[1];
      let symbolicf1 = (await components['/_function1'].stateValues.symbolicfs)[0];
      let symbolicf2 = (await components['/_function1'].stateValues.symbolicfs)[1];

      expect(f1(-5, 2)).closeTo(200, 1E-12);
      expect(f2(-5, 2)).closeTo(-500, 1E-12);
      expect(f1(3, -4)).closeTo(-576, 1E-12);
      expect(f2(3, -4)).closeTo(432, 1E-12);
      expect(numericalf1(-5, 2)).closeTo(200, 1E-12);
      expect(numericalf2(-5, 2)).closeTo(-500, 1E-12);
      expect(numericalf1(3, -4)).closeTo(-576, 1E-12);
      expect(numericalf2(3, -4)).closeTo(432, 1E-12);
      expect(symbolicf1(-5, 2).equals(me.fromText('(-5)^2*2^3'))).eq(true);
      expect(symbolicf2(-5, 2).equals(me.fromText('(-5)^3*2^2'))).eq(true);
      expect(symbolicf1(3, -4).equals(me.fromText('3^2*(-4)^3'))).eq(true);
      expect(symbolicf2(3, -4).equals(me.fromText('3^3*(-4)^2'))).eq(true);
      expect(symbolicf1('z', 'w').equals(me.fromText('z^2w^3'))).eq(true);
      expect(symbolicf2('z', 'w').equals(me.fromText('z^3w^2'))).eq(true);


    })
  })

  it('3D vector-valued function of two variables', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <function variables="s t">(s^2t^3, s^3t^2, st)</function>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(await components['/_function1'].stateValues.nInputs).eq(2);
      expect(await components['/_function1'].stateValues.nOutputs).eq(3);

      let f1 = (await components['/_function1'].stateValues.fs)[0];
      let f2 = (await components['/_function1'].stateValues.fs)[1];
      let f3 = (await components['/_function1'].stateValues.fs)[2];
      let numericalf1 = (await components['/_function1'].stateValues.numericalfs)[0];
      let numericalf2 = (await components['/_function1'].stateValues.numericalfs)[1];
      let numericalf3 = (await components['/_function1'].stateValues.numericalfs)[2];
      let symbolicf1 = (await components['/_function1'].stateValues.symbolicfs)[0];
      let symbolicf2 = (await components['/_function1'].stateValues.symbolicfs)[1];
      let symbolicf3 = (await components['/_function1'].stateValues.symbolicfs)[2];

      expect(f1(-5, 2)).closeTo(200, 1E-12);
      expect(f2(-5, 2)).closeTo(-500, 1E-12);
      expect(f3(-5, 2)).closeTo(-10, 1E-12);
      expect(f1(3, -4)).closeTo(-576, 1E-12);
      expect(f2(3, -4)).closeTo(432, 1E-12);
      expect(f3(3, -4)).closeTo(-12, 1E-12);
      expect(numericalf1(-5, 2)).closeTo(200, 1E-12);
      expect(numericalf2(-5, 2)).closeTo(-500, 1E-12);
      expect(numericalf3(-5, 2)).closeTo(-10, 1E-12);
      expect(numericalf1(3, -4)).closeTo(-576, 1E-12);
      expect(numericalf2(3, -4)).closeTo(432, 1E-12);
      expect(numericalf3(3, -4)).closeTo(-12, 1E-12);
      expect(symbolicf1(-5, 2).equals(me.fromText('(-5)^2*2^3'))).eq(true);
      expect(symbolicf2(-5, 2).equals(me.fromText('(-5)^3*2^2'))).eq(true);
      expect(symbolicf3(-5, 2).equals(me.fromText('(-5)*2'))).eq(true);
      expect(symbolicf1(3, -4).equals(me.fromText('3^2*(-4)^3'))).eq(true);
      expect(symbolicf2(3, -4).equals(me.fromText('3^3*(-4)^2'))).eq(true);
      expect(symbolicf3(3, -4).equals(me.fromText('3*(-4)'))).eq(true);
      expect(symbolicf1('z', 'w').equals(me.fromText('z^2w^3'))).eq(true);
      expect(symbolicf2('z', 'w').equals(me.fromText('z^3w^2'))).eq(true);
      expect(symbolicf3('z', 'w').equals(me.fromText('zw'))).eq(true);


    })
  })

  it('copy function and overwrite symbolic attribute', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <function name="f1">x^2</function>
    <copy target="f1" symbolic assignNames="f2" />
    <copy target="f2" symbolic="false" assignNames="f3" />
    <function name="g1" symbolic>x^2</function>
    <copy target="g1" symbolic="false" assignNames="g2" />
    <copy target="g2" symbolic assignNames="g3" />

    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      expect(await components["/f1"].stateValues.symbolic).eq(false)
      expect(await components["/f2"].stateValues.symbolic).eq(true)
      expect(await components["/f3"].stateValues.symbolic).eq(false)
      expect(await components["/g1"].stateValues.symbolic).eq(true)
      expect(await components["/g2"].stateValues.symbolic).eq(false)
      expect(await components["/g3"].stateValues.symbolic).eq(true)

    })
  });

  it('copy function and overwrite nInputs', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <function name="f1" symbolic>xyz</function>
    <copy target="f1" nInputs="2" assignNames="f2" />
    <copy target="f2" nInputs="3" assignNames="f3" />
    
    <p name="p1">$$f1(a)</p>
    <p name="p2">$$f2(a,b)</p>
    <p name="p3">$$f3(a,b,c)</p>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get("#\\/p1 .mjx-mrow").eq(0).invoke("text").then(text => {
      expect(text).eq("ayz")
    })
    cy.get("#\\/p2 .mjx-mrow").eq(0).invoke("text").then(text => {
      expect(text).eq("abz")
    })
    cy.get("#\\/p3 .mjx-mrow").eq(0).invoke("text").then(text => {
      expect(text).eq("abc")
    })

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      expect(await components["/f1"].stateValues.nInputs).eq(1)
      expect(await components["/f2"].stateValues.nInputs).eq(2)
      expect(await components["/f3"].stateValues.nInputs).eq(3)
      expect((await components["/f1"].stateValues.variables).map(x => x.tree)).eqls(["x"])
      expect((await components["/f2"].stateValues.variables).map(x => x.tree)).eqls(["x", "y"])
      expect((await components["/f3"].stateValues.variables).map(x => x.tree)).eqls(["x", "y", "z"])

    })
  });

  it('copy function and overwrite variables', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <function name="f1" symbolic>xyz</function>
    <copy target="f1" variables="x y" assignNames="f2" />
    <copy target="f2" variables="x y z" assignNames="f3" />
    <copy target="f3" variables="z y" assignNames="f4" />
    <copy target="f4" variables="y" assignNames="f5" />
    
    <p name="p1">$$f1(a)</p>
    <p name="p2">$$f2(a,b)</p>
    <p name="p3">$$f3(a,b,c)</p>
    <p name="p4">$$f4(a,b)</p>
    <p name="p5">$$f5(a)</p>
    `}, "*");
    });

    //wait for window to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get("#\\/p1 .mjx-mrow").eq(0).invoke("text").then(text => {
      expect(text).eq("ayz")
    })
    cy.get("#\\/p2 .mjx-mrow").eq(0).invoke("text").then(text => {
      expect(text).eq("abz")
    })
    cy.get("#\\/p3 .mjx-mrow").eq(0).invoke("text").then(text => {
      expect(text).eq("abc")
    })
    cy.get("#\\/p4 .mjx-mrow").eq(0).invoke("text").then(text => {
      expect(text).eq("xba")
    })
    cy.get("#\\/p5 .mjx-mrow").eq(0).invoke("text").then(text => {
      expect(text).eq("xaz")
    })

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      expect(await components["/f1"].stateValues.nInputs).eq(1)
      expect(await components["/f2"].stateValues.nInputs).eq(2)
      expect(await components["/f3"].stateValues.nInputs).eq(3)
      expect(await components["/f4"].stateValues.nInputs).eq(2)
      expect(await components["/f5"].stateValues.nInputs).eq(1)
      expect((await components["/f1"].stateValues.variables).map(x => x.tree)).eqls(["x"])
      expect((await components["/f2"].stateValues.variables).map(x => x.tree)).eqls(["x", "y"])
      expect((await components["/f3"].stateValues.variables).map(x => x.tree)).eqls(["x", "y", "z"])
      expect((await components["/f4"].stateValues.variables).map(x => x.tree)).eqls(["z", "y"])
      expect((await components["/f5"].stateValues.variables).map(x => x.tree)).eqls(["y"])

    })
  });

});
