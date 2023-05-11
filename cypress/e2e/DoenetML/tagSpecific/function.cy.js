import me from "math-expressions";
import { createFunctionFromDefinition } from "../../../../src/Core/utils/function";
import { cesc } from "../../../../src/_utils/url";

function nInDOM(n) {
  if (n < 0) {
    return `−${Math.abs(n)}`;
  } else {
    return String(n);
  }
}

describe("Function Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("function with nothing", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function>
    </function>
    </graph>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      expect(f(0)).closeTo(0, 1e-12);
      expect(f(1)).closeTo(0, 1e-12);
      expect(f(2)).closeTo(0, 1e-12);
      expect(f(-1)).closeTo(0, 1e-12);
      expect(f(-2)).closeTo(0, 1e-12);
    });
  });

  it("function with single minimum as number", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function minima="(2)" />
    </graph>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      expect(f(0)).closeTo(2, 1e-12);
      expect(f(1)).closeTo(2 + 1, 1e-12);
      expect(f(2)).closeTo(2 + 4, 1e-12);
      expect(f(-1)).closeTo(2 + 1, 1e-12);
      expect(f(-2)).closeTo(2 + 4, 1e-12);
    });
  });

  it("function with single minimum as half-empty tuple", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function minima="( ,2)" />
    </graph>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      expect(f(0)).closeTo(2, 1e-12);
      expect(f(1)).closeTo(2 + 1, 1e-12);
      expect(f(2)).closeTo(2 + 4, 1e-12);
      expect(f(-1)).closeTo(2 + 1, 1e-12);
      expect(f(-2)).closeTo(2 + 4, 1e-12);
    });
  });

  it("function with single minimum as half-empty tuple (no space)", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function minima="(,2)" />
    </graph>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      expect(f(0)).closeTo(2, 1e-12);
      expect(f(1)).closeTo(2 + 1, 1e-12);
      expect(f(2)).closeTo(2 + 4, 1e-12);
      expect(f(-1)).closeTo(2 + 1, 1e-12);
      expect(f(-2)).closeTo(2 + 4, 1e-12);
    });
  });

  it("function with single minimum, change x-scale", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function xscale="3" minima="(2)" />
    </graph>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      expect(f(0)).closeTo(2, 1e-12);
      expect(f(3)).closeTo(2 + 1, 1e-12);
      expect(f(6)).closeTo(2 + 4, 1e-12);
      expect(f(-3)).closeTo(2 + 1, 1e-12);
      expect(f(-6)).closeTo(2 + 4, 1e-12);
    });
  });

  it("function with single minimum, change x-scale and y-scale", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function xscale="3" yscale="5" minima="(2)" />
    </graph>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      expect(f(0)).closeTo(2, 1e-12);
      expect(f(3)).closeTo(2 + 1 * 5, 1e-12);
      expect(f(6)).closeTo(2 + 4 * 5, 1e-12);
      expect(f(-3)).closeTo(2 + 1 * 5, 1e-12);
      expect(f(-6)).closeTo(2 + 4 * 5, 1e-12);
    });
  });

  it("function with single maximum", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function maxima="(3)" />
    </graph>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      expect(f(0)).closeTo(3, 1e-12);
      expect(f(1)).closeTo(3 - 1, 1e-12);
      expect(f(2)).closeTo(3 - 4, 1e-12);
      expect(f(-1)).closeTo(3 - 1, 1e-12);
      expect(f(-2)).closeTo(3 - 4, 1e-12);
    });
  });

  it("function with single maximum, change x-scale", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function xscale="3" maxima="(3)" />
    </graph>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      expect(f(0)).closeTo(3, 1e-12);
      expect(f(3)).closeTo(3 - 1, 1e-12);
      expect(f(6)).closeTo(3 - 4, 1e-12);
      expect(f(-3)).closeTo(3 - 1, 1e-12);
      expect(f(-6)).closeTo(3 - 4, 1e-12);
    });
  });

  it("function with single maximum, change x-scale and y-scale", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function xscale="3" yscale="5" maxima="(3)" />
    </graph>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      expect(f(0)).closeTo(3, 1e-12);
      expect(f(3)).closeTo(3 - 1 * 5, 1e-12);
      expect(f(6)).closeTo(3 - 4 * 5, 1e-12);
      expect(f(-3)).closeTo(3 - 1 * 5, 1e-12);
      expect(f(-6)).closeTo(3 - 4 * 5, 1e-12);
    });
  });

  it("function with single minimum, specify location as half-empty tuple", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function minima="(2, )" />
    </graph>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      expect(f(0)).closeTo(4, 1e-12);
      expect(f(1)).closeTo(1, 1e-12);
      expect(f(2)).closeTo(0, 1e-12);
      expect(f(3)).closeTo(1, 1e-12);
      expect(f(4)).closeTo(4, 1e-12);
    });
  });

  it("function with single minimum, specify location as half-empty tuple (no space)", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function minima="(2,)" />
    </graph>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      expect(f(0)).closeTo(4, 1e-12);
      expect(f(1)).closeTo(1, 1e-12);
      expect(f(2)).closeTo(0, 1e-12);
      expect(f(3)).closeTo(1, 1e-12);
      expect(f(4)).closeTo(4, 1e-12);
    });
  });

  it("function with single minimum, specify location and value as tuple", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function minima="(2, -3)" />
    </graph>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      expect(f(0)).closeTo(4 - 3, 1e-12);
      expect(f(1)).closeTo(1 - 3, 1e-12);
      expect(f(2)).closeTo(0 - 3, 1e-12);
      expect(f(3)).closeTo(1 - 3, 1e-12);
      expect(f(4)).closeTo(4 - 3, 1e-12);
    });
  });

  it("function with single extremum, specify location and value as tuple", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function extrema="(2, -3)" />
    </graph>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      expect(f(0)).closeTo(-4 - 3, 1e-12);
      expect(f(1)).closeTo(-1 - 3, 1e-12);
      expect(f(2)).closeTo(0 - 3, 1e-12);
      expect(f(3)).closeTo(-1 - 3, 1e-12);
      expect(f(4)).closeTo(-4 - 3, 1e-12);
    });
  });

  it("function with min and max", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function minima="(0,0)" maxima="(1,1)" />
    </graph>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      expect(f(0)).closeTo(0, 1e-12);
      expect(f(1)).closeTo(1, 1e-12);
      expect(f(0.5)).closeTo(0.5, 1e-12);
      // like parabola to left of minimum
      expect(f(-1)).closeTo(1, 1e-12);
      expect(f(-2)).closeTo(4, 1e-12);
      expect(f(-3)).closeTo(9, 1e-12);
      // like parabola to right of maximum
      expect(f(2)).closeTo(0, 1e-12);
      expect(f(3)).closeTo(-3, 1e-12);
      expect(f(4)).closeTo(-8, 1e-12);
    });
  });

  it("function with min and extremum", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function minima="(0,0)" extrema="(1,1)" />
    </graph>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      expect(f(0)).closeTo(0, 1e-12);
      expect(f(1)).closeTo(1, 1e-12);
      expect(f(0.5)).closeTo(0.5, 1e-12);
      // like parabola to left of minimum
      expect(f(-1)).closeTo(1, 1e-12);
      expect(f(-2)).closeTo(4, 1e-12);
      expect(f(-3)).closeTo(9, 1e-12);
      // like parabola to right of maximum
      expect(f(2)).closeTo(0, 1e-12);
      expect(f(3)).closeTo(-3, 1e-12);
      expect(f(4)).closeTo(-8, 1e-12);
    });
  });

  it("function with extremum and max", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function extrema="(0,0)" maxima="(1,1)" />
    </graph>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      expect(f(0)).closeTo(0, 1e-12);
      expect(f(1)).closeTo(1, 1e-12);
      expect(f(0.5)).closeTo(0.5, 1e-12);
      // like parabola to left of minimum
      expect(f(-1)).closeTo(1, 1e-12);
      expect(f(-2)).closeTo(4, 1e-12);
      expect(f(-3)).closeTo(9, 1e-12);
      // like parabola to right of maximum
      expect(f(2)).closeTo(0, 1e-12);
      expect(f(3)).closeTo(-3, 1e-12);
      expect(f(4)).closeTo(-8, 1e-12);
    });
  });

  it("function two extrema, same height", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function extrema="(0,0) (1,0)" />
    </graph>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      expect(f(0)).closeTo(0, 1e-12);
      expect(f(1)).closeTo(0, 1e-12);
      expect(f(0.5)).closeTo(-1, 1e-12);
      // like parabola to left of maximum
      expect(f(-1)).closeTo(-1, 1e-12);
      expect(f(-2)).closeTo(-4, 1e-12);
      expect(f(-3)).closeTo(-9, 1e-12);
      // like parabola to right of maximum
      expect(f(2)).closeTo(-1, 1e-12);
      expect(f(3)).closeTo(-4, 1e-12);
      expect(f(4)).closeTo(-9, 1e-12);
    });
  });

  it("function two extrema, second higher", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function extrema="(0,0) (1,2)" />
    </graph>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      expect(f(0)).closeTo(0, 1e-12);
      expect(f(1)).closeTo(2, 1e-12);
      expect(f(0.5)).closeTo(1, 1e-12);
      // like parabola to left of minimum
      expect(f(-1)).closeTo(1, 1e-12);
      expect(f(-2)).closeTo(4, 1e-12);
      expect(f(-3)).closeTo(9, 1e-12);
      // like parabola to right of maximum
      expect(f(2)).closeTo(1, 1e-12);
      expect(f(3)).closeTo(-2, 1e-12);
      expect(f(4)).closeTo(-7, 1e-12);
    });
  });

  it("function two extrema, second lower", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function extrema="(0,0) (1,-2)" />
    </graph>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      expect(f(0)).closeTo(0, 1e-12);
      expect(f(1)).closeTo(-2, 1e-12);
      expect(f(0.5)).closeTo(-1, 1e-12);
      // like parabola to left of maximum
      expect(f(-1)).closeTo(-1, 1e-12);
      expect(f(-2)).closeTo(-4, 1e-12);
      expect(f(-3)).closeTo(-9, 1e-12);
      // like parabola to right of minimum
      expect(f(2)).closeTo(-1, 1e-12);
      expect(f(3)).closeTo(2, 1e-12);
      expect(f(4)).closeTo(7, 1e-12);
    });
  });

  it("function with two minima", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function minima='(-2, ) (2, 1)' />
    </graph>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      expect(f(-2)).closeTo(1, 1e-12);
      expect(f(2)).closeTo(1, 1e-12);
      expect(f(0)).closeTo(2, 1e-12);
      // like parabola to left of minimum
      expect(f(-3)).closeTo(1 + 1, 1e-12);
      expect(f(-4)).closeTo(4 + 1, 1e-12);
      expect(f(-5)).closeTo(9 + 1, 1e-12);
      // like parabola to right of minimum
      expect(f(3)).closeTo(1 + 1, 1e-12);
      expect(f(4)).closeTo(4 + 1, 1e-12);
      expect(f(5)).closeTo(9 + 1, 1e-12);
    });
  });

  it("function with two minima and maximum with specified height", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function minima="(-2, )  (2,1)" maxima="( , 5)" />
    </graph>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      expect(f(-2)).closeTo(1, 1e-12);
      expect(f(2)).closeTo(1, 1e-12);
      expect(f(0)).closeTo(5, 1e-12);
      // like parabola to left of minimum
      expect(f(-3)).closeTo(1 + 1, 1e-12);
      expect(f(-4)).closeTo(4 + 1, 1e-12);
      expect(f(-5)).closeTo(9 + 1, 1e-12);
      // like parabola to right of minimum
      expect(f(3)).closeTo(1 + 1, 1e-12);
      expect(f(4)).closeTo(4 + 1, 1e-12);
      expect(f(5)).closeTo(9 + 1, 1e-12);
    });
  });

  it("function with two minima and extremum with specified height", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function minima="(-2,) (2, 1) " extrema="(,5)" />
    </graph>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      expect(f(-2)).closeTo(1, 1e-12);
      expect(f(2)).closeTo(1, 1e-12);
      expect(f(0)).closeTo(5, 1e-12);
      // like parabola to left of minimum
      expect(f(-3)).closeTo(1 + 1, 1e-12);
      expect(f(-4)).closeTo(4 + 1, 1e-12);
      expect(f(-5)).closeTo(9 + 1, 1e-12);
      // like parabola to right of minimum
      expect(f(3)).closeTo(1 + 1, 1e-12);
      expect(f(4)).closeTo(4 + 1, 1e-12);
      expect(f(5)).closeTo(9 + 1, 1e-12);
    });
  });

  it("function with maximum and higher minimum", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function maxima="(-2,1)" minima="(2,2)" />
    </graph>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      expect(f(-2)).closeTo(1, 1e-12);
      expect(f(-3)).closeTo(0, 1e-12);
      expect(f(-2 + 4 / 3)).closeTo(0, 1e-12);

      expect(f(2)).closeTo(2, 1e-12);
      expect(f(3)).closeTo(3, 1e-12);
      expect(f(2 - 4 / 3)).closeTo(3, 1e-12);

      expect(f(0)).closeTo(1.5, 1e-12);
    });
  });

  it("function with maximum and higher extremum", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function maxima="(-2,1)" extrema="(2,2)" />
    </graph>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      expect(f(-2)).closeTo(1, 1e-12);
      expect(f(-3)).closeTo(0, 1e-12);
      expect(f(0)).closeTo(0, 1e-12);

      expect(f(2)).closeTo(2, 1e-12);
      expect(f(3)).closeTo(1, 1e-12);
    });
  });

  it("function with minimum and lower maximum", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function minima="(-2,3)" maxima="(2,2)" />
    </graph>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      expect(f(-2)).closeTo(3, 1e-12);
      expect(f(-3)).closeTo(4, 1e-12);
      expect(f(-2 + 4 / 3)).closeTo(4, 1e-12);

      expect(f(2)).closeTo(2, 1e-12);
      expect(f(3)).closeTo(1, 1e-12);
      expect(f(2 - 4 / 3)).closeTo(1, 1e-12);

      expect(f(0)).closeTo(2.5, 1e-12);
    });
  });

  it("function with minimum and lower extremum", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function minima="(-2,3)" extrema="(2,2)" />
    </graph>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      expect(f(-2)).closeTo(3, 1e-12);
      expect(f(-3)).closeTo(4, 1e-12);
      expect(f(0)).closeTo(4, 1e-12);

      expect(f(2)).closeTo(2, 1e-12);
      expect(f(3)).closeTo(3, 1e-12);
    });
  });

  it("function with extremum and lower maximum", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function extrema="(-2,3)" maxima="(2,2)" />
    </graph>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      expect(f(-2)).closeTo(3, 1e-12);
      expect(f(-3)).closeTo(2, 1e-12);
      expect(f(0)).closeTo(1, 1e-12);

      expect(f(2)).closeTo(2, 1e-12);
      expect(f(3)).closeTo(1, 1e-12);
    });
  });

  it("functions with copied extrema that overwrite attributes", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <extremum name="ex1" location="3" value="-2" />
    <copy target="ex1" location="5" assignNames="ex2" />
    <copy target="ex1" value="2" assignNames="ex3" />
    
    <graph>
      <function extrema="$ex1 $ex2" />
      <function extrema="$ex2 $ex3" />
    </graph>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      expect(f(3)).closeTo(-2, 1e-12);
      expect(f(5)).closeTo(-2, 1e-12);

      expect(f(2)).closeTo(-3, 1e-12);
      expect(f(4)).closeTo(-3, 1e-12);
      expect(f(6)).closeTo(-3, 1e-12);

      let g = createFunctionFromDefinition(
        stateVariables["/_function2"].stateValues.fDefinitions[0],
      );
      expect(g(3)).closeTo(2, 1e-12);
      expect(g(5)).closeTo(-2, 1e-12);

      expect(g(2)).closeTo(1, 1e-12);
      expect(g(4)).closeTo(0, 1e-12);
      expect(g(6)).closeTo(-1, 1e-12);
    });
  });

  it("copy function and overwrite extrema", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
      <function minima="(2,3)" maxima="(4,4)" name="f" />
      <copy target="f" maxima="(0,4)" assignNames="g" styleNumber="2" />
      <copy target="f" minima="(6,3)" assignNames="h" styleNumber="3" />
    </graph>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = createFunctionFromDefinition(
        stateVariables["/f"].stateValues.fDefinitions[0],
      );
      expect(f(2)).closeTo(3, 1e-12);
      expect(f(4)).closeTo(4, 1e-12);

      expect(f(1)).closeTo(4, 1e-12);
      expect(f(3)).closeTo(3.5, 1e-12);
      expect(f(5)).closeTo(3, 1e-12);

      let g = createFunctionFromDefinition(
        stateVariables["/g"].stateValues.fDefinitions[0],
      );
      expect(g(0)).closeTo(4, 1e-12);
      expect(g(2)).closeTo(3, 1e-12);

      expect(g(-1)).closeTo(3, 1e-12);
      expect(g(1)).closeTo(3.5, 1e-12);
      expect(g(3)).closeTo(4, 1e-12);

      let h = createFunctionFromDefinition(
        stateVariables["/h"].stateValues.fDefinitions[0],
      );
      expect(h(4)).closeTo(4, 1e-12);
      expect(h(6)).closeTo(3, 1e-12);

      expect(h(3)).closeTo(3, 1e-12);
      expect(h(5)).closeTo(3.5, 1e-12);
      expect(h(7)).closeTo(4, 1e-12);
    });
  });

  it("function with maximum through points", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function maxima="(-2,2)" through="(-5,0) (-6,-1) (0, 0) (1, 0)" />
    </graph>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      expect(f(-2)).closeTo(2, 1e-12);
      expect(f(-5)).closeTo(0, 1e-12);
      expect(f(-6)).closeTo(-1, 1e-12);

      // extrapolates linearly
      let slope = f(-6) - f(-7);
      expect(f(-8)).closeTo(-1 - slope * 2, 1e-12);
      expect(f(-9)).closeTo(-1 - slope * 3, 1e-12);
      expect(f(-10)).closeTo(-1 - slope * 4, 1e-12);

      expect(f(0)).closeTo(0, 1e-12);
      expect(f(1)).closeTo(0, 1e-12);
      // extrapolates linearly
      expect(f(2)).closeTo(0, 1e-12);
      expect(f(3)).closeTo(0, 1e-12);
    });
  });

  it("function with single through point", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function through="(-6,-1)" />
    </graph>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      expect(f(-6)).closeTo(-1, 1e-12);
      expect(f(-2)).closeTo(-1, 1e-12);
      expect(f(-12)).closeTo(-1, 1e-12);
      expect(f(12)).closeTo(-1, 1e-12);
    });
  });

  it("function with single through point with slope", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function through="(-6,-1)" throughSlopes="3" />
    </graph>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      expect(f(-6)).closeTo(-1, 1e-12);
      expect(f(-2)).closeTo(-1 + 3 * (-2 + 6), 1e-12);
      expect(f(-12)).closeTo(-1 + 3 * (-12 + 6), 1e-12);
      expect(f(12)).closeTo(-1 + 3 * (12 + 6), 1e-12);
    });
  });

  it("function with single through point with dynamic slope", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>slope: <mathinput/></p>
    <graph>
    <function throughSlopes="$_mathinput1" through="(-6,-1)" />
    </graph>
    <p><copy prop="value" target="_mathinput1" assignNames="m1" /></p>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/m1")).should("contain.text", "\uff3f");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      expect(f(-6)).closeTo(-1, 1e-12);
      expect(f(-2)).closeTo(-1 + 0 * (-2 + 6), 1e-12);
      expect(f(-12)).closeTo(-1 + 0 * (-12 + 6), 1e-12);
      expect(f(12)).closeTo(-1 + 0 * (12 + 6), 1e-12);
    });

    cy.get(cesc("#\\/_mathinput1") + " textarea").type("2{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/m1")).should("contain.text", "2");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      expect(f(-6)).closeTo(-1, 1e-12);
      expect(f(-2)).closeTo(-1 + 2 * (-2 + 6), 1e-12);
      expect(f(-12)).closeTo(-1 + 2 * (-12 + 6), 1e-12);
      expect(f(12)).closeTo(-1 + 2 * (12 + 6), 1e-12);
    });

    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      "{end}{backspace}-3{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/m1")).should("contain.text", "−3");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      expect(f(-6)).closeTo(-1, 1e-12);
      expect(f(-2)).closeTo(-1 - 3 * (-2 + 6), 1e-12);
      expect(f(-12)).closeTo(-1 - 3 * (-12 + 6), 1e-12);
      expect(f(12)).closeTo(-1 - 3 * (12 + 6), 1e-12);
    });

    cy.get(cesc("#\\/_mathinput1") + " textarea")
      .type("{end}{backspace}{backspace}", { force: true })
      .blur();
    cy.get(cesc("#\\/m1")).should("contain.text", "＿");
    cy.wait(100);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      expect(f(-6)).closeTo(-1, 1e-12);
      expect(f(-2)).closeTo(-1 + 0 * (-2 + 6), 1e-12);
      expect(f(-12)).closeTo(-1 + 0 * (-12 + 6), 1e-12);
      expect(f(12)).closeTo(-1 + 0 * (12 + 6), 1e-12);
    });
  });

  it("function with two through points with dynamic slope", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>slope: <mathinput/></p>
    <graph>
    <function throughSlopes="$_mathinput1 $_mathinput1" through="(-6,-1) (3,8)" />
    </graph>
    <p><copy prop="value" target="_mathinput1" assignNames="m1" /></p>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.log("with undefined slope, get line through points");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      expect(f(-6)).closeTo(-1, 1e-12);
      expect(f(-2)).closeTo(-1 + 1 * (-2 + 6), 1e-12);
      expect(f(-12)).closeTo(-1 + 1 * (-12 + 6), 1e-12);
      expect(f(12)).closeTo(-1 + 1 * (12 + 6), 1e-12);
    });

    cy.get(cesc("#\\/_mathinput1") + " textarea").type("2{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/m1")).should("contain.text", "2");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      expect(f(-6 - 0.01)).closeTo(-1 - 0.01 * 2, 1e-3);
      expect(f(-6)).closeTo(-1, 1e-12);
      expect(f(-6 + 0.01)).closeTo(-1 + 0.01 * 2, 1e-3);

      expect(f(3 - 0.01)).closeTo(8 - 0.01 * 2, 1e-3);
      expect(f(3)).closeTo(8, 1e-12);
      expect(f(3 + 0.01)).closeTo(8 + 0.01 * 2, 1e-3);

      // extrapolate linearly
      expect(f(-6 - 3)).closeTo(-1 - 3 * 2, 1e-12);
      expect(f(3 + 3)).closeTo(8 + 3 * 2, 1e-12);
    });

    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      "{end}{backspace}-3{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/m1")).should("contain.text", "−3");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      expect(f(-6 - 0.01)).closeTo(-1 - 0.01 * -3, 1e-3);
      expect(f(-6)).closeTo(-1, 1e-12);
      expect(f(-6 + 0.01)).closeTo(-1 + 0.01 * -3, 1e-3);

      expect(f(3 - 0.01)).closeTo(8 - 0.01 * -3, 1e-3);
      expect(f(3)).closeTo(8, 1e-12);
      expect(f(3 + 0.01)).closeTo(8 + 0.01 * -3, 1e-3);

      // extrapolate linearly
      expect(f(-6 - 3)).closeTo(-1 - 3 * -3, 1e-12);
      expect(f(3 + 3)).closeTo(8 + 3 * -3, 1e-12);
    });

    cy.get(cesc("#\\/_mathinput1") + " textarea")
      .type("{end}{backspace}{backspace}", { force: true })
      .blur();
    cy.get(cesc("#\\/m1")).should("contain.text", "＿");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      expect(f(-6)).closeTo(-1, 1e-12);
      expect(f(-2)).closeTo(-1 + 1 * (-2 + 6), 1e-12);
      expect(f(-12)).closeTo(-1 + 1 * (-12 + 6), 1e-12);
      expect(f(12)).closeTo(-1 + 1 * (12 + 6), 1e-12);
    });
  });

  it("function through three points", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function through="(0,2) (2,1) (3,2)" />
    </graph>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      expect(f(0)).closeTo(2, 1e-12);
      expect(f(2)).closeTo(1, 1e-12);
      expect(f(3)).closeTo(2, 1e-12);
      // extrapolate linearly
      let slope = f(4) - f(3);
      expect(f(5)).closeTo(2 + slope * 2, 1e-12);
      expect(f(6)).closeTo(2 + slope * 3, 1e-12);
      expect(f(7)).closeTo(2 + slope * 4, 1e-12);
      slope = f(0) - f(-1);
      expect(f(-2)).closeTo(2 - slope * 2, 1e-12);
      expect(f(-3)).closeTo(2 - slope * 3, 1e-12);
      expect(f(-4)).closeTo(2 - slope * 4, 1e-12);
    });
  });

  it("function through three points, label with math", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function through="(0,2) (2,1) (3,2)" >
      <label><m>\\int f</m></label>
    </function>
    </graph>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      expect(f(0)).closeTo(2, 1e-12);
      expect(f(2)).closeTo(1, 1e-12);
      expect(f(3)).closeTo(2, 1e-12);
      // extrapolate linearly
      let slope = f(4) - f(3);
      expect(f(5)).closeTo(2 + slope * 2, 1e-12);
      expect(f(6)).closeTo(2 + slope * 3, 1e-12);
      expect(f(7)).closeTo(2 + slope * 4, 1e-12);
      slope = f(0) - f(-1);
      expect(f(-2)).closeTo(2 - slope * 2, 1e-12);
      expect(f(-3)).closeTo(2 - slope * 3, 1e-12);
      expect(f(-4)).closeTo(2 - slope * 4, 1e-12);

      expect(stateVariables["/_function1"].stateValues.label).eq(
        "\\(\\int f\\)",
      );
    });
  });

  it("function through three points with slopes", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <point>(2,1)</point>
    <function through="(0,2) (2,1) (3,2)" throughSlopes="0.5 2 -1" />
    </graph>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      expect(f(-0.01)).closeTo(2 - 0.01 * 0.5, 1e-3);
      expect(f(0)).closeTo(2, 1e-12);
      expect(f(0.01)).closeTo(2 + 0.01 * 0.5, 1e-3);

      expect(f(2 - 0.01)).closeTo(1 - 0.01 * 2, 1e-3);
      expect(f(2)).closeTo(1, 1e-12);
      expect(f(2 + 0.01)).closeTo(1 + 0.01 * 2, 1e-3);

      expect(f(3 - 0.01)).closeTo(2 - 0.01 * -1, 1e-3);
      expect(f(3)).closeTo(2, 1e-12);
      expect(f(3 + 0.01)).closeTo(2 + 0.01 * -1, 1e-3);

      // extrapolate linearly
      let slope = -1;
      expect(f(5)).closeTo(2 + slope * 2, 1e-12);
      expect(f(6)).closeTo(2 + slope * 3, 1e-12);
      expect(f(7)).closeTo(2 + slope * 4, 1e-12);
      slope = 0.5;
      expect(f(-2)).closeTo(2 - slope * 2, 1e-12);
      expect(f(-3)).closeTo(2 - slope * 3, 1e-12);
      expect(f(-4)).closeTo(2 - slope * 4, 1e-12);
    });
  });

  it("function with conflicting points", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function through="(0,2) (2,1) (2,2)" />
    </graph>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      assert.isNaN(f(0));
      assert.isNaN(f(1));
      assert.isNaN(f(2));
    });
  });

  it("copy function and overwrite through points and slopes", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function through="(0,2) (2,1) (3,2)" name="f" styleNumber="1" />
    <copy target="f" through="(1,5) (4,2)" assignNames="g" styleNumber="2" />
    <copy target="f" throughslopes="1 2 -3" assignNames="h" styleNumber="3" />
    </graph>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = createFunctionFromDefinition(
        stateVariables["/f"].stateValues.fDefinitions[0],
      );
      expect(f(0)).closeTo(2, 1e-12);
      expect(f(2)).closeTo(1, 1e-12);
      expect(f(3)).closeTo(2, 1e-12);
      // extrapolate linearly
      let slope = f(4) - f(3);
      expect(f(5)).closeTo(2 + slope * 2, 1e-12);
      expect(f(6)).closeTo(2 + slope * 3, 1e-12);
      expect(f(7)).closeTo(2 + slope * 4, 1e-12);
      slope = f(0) - f(-1);
      expect(f(-2)).closeTo(2 - slope * 2, 1e-12);
      expect(f(-3)).closeTo(2 - slope * 3, 1e-12);
      expect(f(-4)).closeTo(2 - slope * 4, 1e-12);

      let g = createFunctionFromDefinition(
        stateVariables["/g"].stateValues.fDefinitions[0],
      );
      expect(g(1)).closeTo(5, 1e-12);
      expect(g(4)).closeTo(2, 1e-12);
      // linear function
      slope = g(1) - g(0);
      expect(g(2)).closeTo(5 + slope * 1, 1e-12);
      expect(g(3)).closeTo(5 + slope * 2, 1e-12);
      expect(g(4)).closeTo(5 + slope * 3, 1e-12);
      expect(g(0)).closeTo(5 + slope * -1, 1e-12);
      expect(g(-1)).closeTo(5 + slope * -2, 1e-12);
      expect(g(-2)).closeTo(5 + slope * -3, 1e-12);

      let h = createFunctionFromDefinition(
        stateVariables["/h"].stateValues.fDefinitions[0],
      );
      expect(h(0)).closeTo(2, 1e-12);
      expect(h(2)).closeTo(1, 1e-12);
      expect(h(3)).closeTo(2, 1e-12);
      // extrapolate linearly at given slopes
      slope = -3;
      expect(h(5)).closeTo(2 + slope * 2, 1e-12);
      expect(h(6)).closeTo(2 + slope * 3, 1e-12);
      expect(h(7)).closeTo(2 + slope * 4, 1e-12);
      slope = 1;
      expect(h(-2)).closeTo(2 - slope * 2, 1e-12);
      expect(h(-3)).closeTo(2 - slope * 3, 1e-12);
      expect(h(-4)).closeTo(2 - slope * 4, 1e-12);
      // close to given slope near middle point
      slope = 2;
      expect(h(2.0001)).closeTo(1 + slope * 0.0001, 1e-7);
      expect(h(1.9999)).closeTo(1 + slope * -0.0001, 1e-7);
    });
  });

  it("check monotonicity", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function through="(-5,0) (-4,0.1) (-3,0.3) (-2,3) (-1,3.1) (0,3.2) (1,5)" maxima="(6,6)" />
    </graph>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      for (let x = -5; x <= 6; x += 0.1) {
        expect(f(x - 0.1)).lessThan(f(x));
      }
      expect(f(-5)).closeTo(0, 1e-12);
      expect(f(-4)).closeTo(0.1, 1e-12);
      expect(f(-3)).closeTo(0.3, 1e-12);
      expect(f(-2)).closeTo(3, 1e-12);
      expect(f(-1)).closeTo(3.1, 1e-12);
      expect(f(0)).closeTo(3.2, 1e-12);
      expect(f(1)).closeTo(5, 1e-12);
      expect(f(6)).closeTo(6, 1e-12);
      expect(f(7)).closeTo(5, 1e-12);
      expect(f(8)).closeTo(2, 1e-12);
    });
  });

  it("point constrained to function", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
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
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let p = stateVariables["/_point1"];

      let x = me.fromAst(p.stateValues.xs[0]).evaluate_to_constant();
      let y = me.fromAst(p.stateValues.xs[1]).evaluate_to_constant();

      expect(6 - ((x - 5) * (x - 5)) / 25).closeTo(y, 1e-5);

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -8, y: 8 },
      });

      stateVariables = await win.returnAllStateVariables1();

      p = stateVariables["/_point1"];

      x = me.fromAst(p.stateValues.xs[0]).evaluate_to_constant();
      y = me.fromAst(p.stateValues.xs[1]).evaluate_to_constant();

      expect(6 - ((x - 5) * (x - 5)) / 25).closeTo(y, 1e-5);

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 8, y: 8 },
      });

      stateVariables = await win.returnAllStateVariables1();

      p = stateVariables["/_point1"];

      x = me.fromAst(p.stateValues.xs[0]).evaluate_to_constant();
      y = me.fromAst(p.stateValues.xs[1]).evaluate_to_constant();

      expect(6 - (x - 5) * (x - 5) * (2 / 9)).closeTo(y, 1e-5);
    });
  });

  it("point constrained to function, symbolic initial x", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
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
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let p = stateVariables["/_point1"];

      expect(me.fromAst(p.stateValues.xs[0]).evaluate_to_constant()).closeTo(
        Math.sqrt(2),
        1e-6,
      );
      expect(me.fromAst(p.stateValues.xs[1]).evaluate_to_constant()).closeTo(
        2,
        1e-6,
      );

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -2, y: 2 },
      });

      stateVariables = await win.returnAllStateVariables1();

      p = stateVariables["/_point1"];

      expect(me.fromAst(p.stateValues.xs[0]).evaluate_to_constant()).closeTo(
        -2,
        1e-6,
      );
      expect(me.fromAst(p.stateValues.xs[1]).evaluate_to_constant()).closeTo(
        4,
        1e-6,
      );
    });
  });

  it("point constrained to function, restrict to closed domain", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function maxima="(5,6)" through="(0,5) (8,4)" domain="[-4,7]" />

    <point x="1" y="2">
      <constraints>
        <constrainTo><copy target="_function1" /></constrainTo>
      </constraints>
    </point>
    </graph>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let p = stateVariables["/_point1"];

      let x = me.fromAst(p.stateValues.xs[0]).evaluate_to_constant();
      let y = me.fromAst(p.stateValues.xs[1]).evaluate_to_constant();

      expect(x).closeTo(1, 1e-12);
      expect(6 - ((x - 5) * (x - 5)) / 25).closeTo(y, 1e-5);

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -8, y: 8 },
      });

      stateVariables = await win.returnAllStateVariables1();

      p = stateVariables["/_point1"];

      x = me.fromAst(p.stateValues.xs[0]).evaluate_to_constant();
      y = me.fromAst(p.stateValues.xs[1]).evaluate_to_constant();

      expect(x).closeTo(-4, 1e-12);
      expect(6 - ((x - 5) * (x - 5)) / 25).closeTo(y, 1e-5);

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 6, y: 8 },
      });

      stateVariables = await win.returnAllStateVariables1();

      p = stateVariables["/_point1"];

      x = me.fromAst(p.stateValues.xs[0]).evaluate_to_constant();
      y = me.fromAst(p.stateValues.xs[1]).evaluate_to_constant();

      expect(x).closeTo(6, 1e-12);
      expect(6 - (x - 5) * (x - 5) * (2 / 9)).closeTo(y, 1e-5);

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 8, y: -4 },
      });

      stateVariables = await win.returnAllStateVariables1();

      p = stateVariables["/_point1"];

      x = me.fromAst(p.stateValues.xs[0]).evaluate_to_constant();
      y = me.fromAst(p.stateValues.xs[1]).evaluate_to_constant();

      expect(x).closeTo(7, 1e-12);
      expect(6 - (x - 5) * (x - 5) * (2 / 9)).closeTo(y, 1e-5);
    });
  });

  it("point constrained to function, restrict to open domain", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
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
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let p = stateVariables["/_point1"];

      let x = me.fromAst(p.stateValues.xs[0]).evaluate_to_constant();
      let y = me.fromAst(p.stateValues.xs[1]).evaluate_to_constant();

      expect(x).closeTo(1, 1e-12);
      expect(6 - ((x - 5) * (x - 5)) / 25).closeTo(y, 1e-5);

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -8, y: 8 },
      });

      stateVariables = await win.returnAllStateVariables1();

      p = stateVariables["/_point1"];

      x = me.fromAst(p.stateValues.xs[0]).evaluate_to_constant();
      y = me.fromAst(p.stateValues.xs[1]).evaluate_to_constant();

      expect(x).greaterThan(-4 + 1e-12);
      expect(x).lessThan(-4 + 1e-3);
      expect(6 - ((x - 5) * (x - 5)) / 25).closeTo(y, 1e-5);

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 6, y: 8 },
      });

      stateVariables = await win.returnAllStateVariables1();

      p = stateVariables["/_point1"];

      x = me.fromAst(p.stateValues.xs[0]).evaluate_to_constant();
      y = me.fromAst(p.stateValues.xs[1]).evaluate_to_constant();

      expect(x).closeTo(6, 1e-12);
      expect(6 - (x - 5) * (x - 5) * (2 / 9)).closeTo(y, 1e-5);

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 8, y: -4 },
      });

      stateVariables = await win.returnAllStateVariables1();

      p = stateVariables["/_point1"];

      x = me.fromAst(p.stateValues.xs[0]).evaluate_to_constant();
      y = me.fromAst(p.stateValues.xs[1]).evaluate_to_constant();

      expect(x).lessThan(7 - 1e-12);
      expect(x).greaterThan(7 - 1e-3);
      expect(6 - (x - 5) * (x - 5) * (2 / 9)).closeTo(y, 1e-5);
    });
  });

  it("point constrained to function with restricted domain, not explicit", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
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
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");
    let f = (x) => Math.sqrt(x) * Math.sqrt(5 - x);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let p = stateVariables["/_point1"];
      expect(me.fromAst(p.stateValues.xs[0]).evaluate_to_constant()).closeTo(
        1,
        1e-6,
      );
      expect(me.fromAst(p.stateValues.xs[1]).evaluate_to_constant()).closeTo(
        f(1),
        1e-6,
      );

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -1, y: 8 },
      });

      stateVariables = await win.returnAllStateVariables1();

      p = stateVariables["/_point1"];

      let x = me.fromAst(p.stateValues.xs[0]).evaluate_to_constant();
      let y = me.fromAst(p.stateValues.xs[1]).evaluate_to_constant();

      expect(y).closeTo(f(x), 1e-6);

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 6, y: 8 },
      });

      stateVariables = await win.returnAllStateVariables1();

      p = stateVariables["/_point1"];

      x = me.fromAst(p.stateValues.xs[0]).evaluate_to_constant();
      y = me.fromAst(p.stateValues.xs[1]).evaluate_to_constant();

      expect(y).closeTo(f(x), 1e-6);

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 8, y: -4 },
      });

      stateVariables = await win.returnAllStateVariables1();

      p = stateVariables["/_point1"];

      x = me.fromAst(p.stateValues.xs[0]).evaluate_to_constant();
      y = me.fromAst(p.stateValues.xs[1]).evaluate_to_constant();

      expect(y).closeTo(f(x), 1e-6);

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -1, y: -6 },
      });

      stateVariables = await win.returnAllStateVariables1();

      p = stateVariables["/_point1"];

      x = me.fromAst(p.stateValues.xs[0]).evaluate_to_constant();
      y = me.fromAst(p.stateValues.xs[1]).evaluate_to_constant();

      expect(y).closeTo(f(x), 1e-6);
    });
  });

  it("function determined by formula via sugar", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function>
    3/(1+e^(-x/2))
    </function>
    </graph>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_function1"].stateValues.nInputs).eq(1);

      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      // let numericalf = (stateVariables['/_function1'].stateValues.numericalfs)[0];
      // let symbolicf = (stateVariables['/_function1'].stateValues.symbolicfs)[0];

      expect(f(-5)).closeTo(3 / (1 + Math.exp(5 / 2)), 1e-12);
      expect(f(1)).closeTo(3 / (1 + Math.exp(-1 / 2)), 1e-12);
      // expect(numericalf(-5)).closeTo(3 / (1 + Math.exp(5 / 2)), 1E-12);
      // expect(numericalf(1)).closeTo(3 / (1 + Math.exp(-1 / 2)), 1E-12);
      // expect(symbolicf(-5).equals(me.fromText('3/(1+e^(5/2))'))).eq(true)
      // expect(symbolicf(1).equals(me.fromText('3/(1+e^(-1/2))'))).eq(true)
      // expect(symbolicf('z').equals(me.fromText('3/(1+e^(-z/2))'))).eq(true)
    });
  });

  it("function determined by formula via sugar, label with math", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function>
    3/(1+e^(-x/2))
    <label>Hello <copy prop="formula" target="_function1" /></label>
    </function>
    </graph>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_function1"].stateValues.nInputs).eq(1);

      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );

      expect(f(-5)).closeTo(3 / (1 + Math.exp(5 / 2)), 1e-12);
      expect(f(1)).closeTo(3 / (1 + Math.exp(-1 / 2)), 1e-12);

      expect(stateVariables["/_function1"].stateValues.label).eq(
        "Hello \\(\\frac{3}{1 + e^{-\\frac{x}{2}}}\\)",
      );
    });
  });

  it("function determined by formula via sugar, with strings and macros", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function>
    $a/(1+e^(-x/$b))
    </function>
    </graph>
    <number name="a">3</number>
    <math name="b">2</math>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_function1"].stateValues.nInputs).eq(1);

      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      // let numericalf = (stateVariables['/_function1'].stateValues.numericalfs)[0];
      // let symbolicf = (stateVariables['/_function1'].stateValues.symbolicfs)[0];

      expect(f(-5)).closeTo(3 / (1 + Math.exp(5 / 2)), 1e-12);
      expect(f(1)).closeTo(3 / (1 + Math.exp(-1 / 2)), 1e-12);
      // expect(numericalf(-5)).closeTo(3 / (1 + Math.exp(5 / 2)), 1E-12);
      // expect(numericalf(1)).closeTo(3 / (1 + Math.exp(-1 / 2)), 1E-12);
      // expect(symbolicf(-5).equals(me.fromText('3/(1+e^(5/2))'))).eq(true)
      // expect(symbolicf(1).equals(me.fromText('3/(1+e^(-1/2))'))).eq(true)
      // expect(symbolicf('z').equals(me.fromText('3/(1+e^(-z/2))'))).eq(true)
    });
  });

  it("function determined by formula via sugar, with strings and maths", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function>
    <number>3</number>/(1+e^(-x/<math>2</math>))
    </function>
    </graph>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_function1"].stateValues.nInputs).eq(1);

      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      // let numericalf = (stateVariables['/_function1'].stateValues.numericalfs)[0];
      // let symbolicf = (stateVariables['/_function1'].stateValues.symbolicfs)[0];

      expect(f(-5)).closeTo(3 / (1 + Math.exp(5 / 2)), 1e-12);
      expect(f(1)).closeTo(3 / (1 + Math.exp(-1 / 2)), 1e-12);
      // expect(numericalf(-5)).closeTo(3 / (1 + Math.exp(5 / 2)), 1E-12);
      // expect(numericalf(1)).closeTo(3 / (1 + Math.exp(-1 / 2)), 1E-12);
      // expect(symbolicf(-5).equals(me.fromText('3/(1+e^(5/2))'))).eq(true)
      // expect(symbolicf(1).equals(me.fromText('3/(1+e^(-1/2))'))).eq(true)
      // expect(symbolicf('z').equals(me.fromText('3/(1+e^(-z/2))'))).eq(true)
    });
  });

  it("function determined by formula via sugar, with strings and copies", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function>
    <copy target="a" />/(1+e^(-x/<copy target="b" />))
    </function>
    </graph>
    <number name="a">3</number>
    <math name="b">2</math>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_function1"].stateValues.nInputs).eq(1);

      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      // let numericalf = (stateVariables['/_function1'].stateValues.numericalfs)[0];
      // let symbolicf = (stateVariables['/_function1'].stateValues.symbolicfs)[0];

      expect(f(-5)).closeTo(3 / (1 + Math.exp(5 / 2)), 1e-12);
      expect(f(1)).closeTo(3 / (1 + Math.exp(-1 / 2)), 1e-12);
      // expect(numericalf(-5)).closeTo(3 / (1 + Math.exp(5 / 2)), 1E-12);
      // expect(numericalf(1)).closeTo(3 / (1 + Math.exp(-1 / 2)), 1E-12);
      // expect(symbolicf(-5).equals(me.fromText('3/(1+e^(5/2))'))).eq(true)
      // expect(symbolicf(1).equals(me.fromText('3/(1+e^(-1/2))'))).eq(true)
      // expect(symbolicf('z').equals(me.fromText('3/(1+e^(-z/2))'))).eq(true)
    });
  });

  it("function determined by math formula", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function><math>3/(1+e^(-x/2))</math></function>
    </graph>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_function1"].stateValues.nInputs).eq(1);

      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      // let numericalf = (stateVariables['/_function1'].stateValues.numericalfs)[0];
      // let symbolicf = (stateVariables['/_function1'].stateValues.symbolicfs)[0];

      expect(f(-5)).closeTo(3 / (1 + Math.exp(5 / 2)), 1e-12);
      expect(f(1)).closeTo(3 / (1 + Math.exp(-1 / 2)), 1e-12);
      // expect(numericalf(-5)).closeTo(3 / (1 + Math.exp(5 / 2)), 1E-12);
      // expect(numericalf(1)).closeTo(3 / (1 + Math.exp(-1 / 2)), 1E-12);
      // expect(symbolicf(-5).equals(me.fromText('3/(1+e^(5/2))'))).eq(true)
      // expect(symbolicf(1).equals(me.fromText('3/(1+e^(-1/2))'))).eq(true)
      // expect(symbolicf('z').equals(me.fromText('3/(1+e^(-z/2))'))).eq(true)
    });
  });

  it("function determined by math formula, label with math", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function>
      <label>Hello <copy prop="formula" target="_function1" /></label>
      <math>3/(1+e^(-x/2))</math>
    </function>
    </graph>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_function1"].stateValues.nInputs).eq(1);

      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );

      expect(f(-5)).closeTo(3 / (1 + Math.exp(5 / 2)), 1e-12);
      expect(f(1)).closeTo(3 / (1 + Math.exp(-1 / 2)), 1e-12);

      expect(stateVariables["/_function1"].stateValues.label).eq(
        "Hello \\(\\frac{3}{1 + e^{-\\frac{x}{2}}}\\)",
      );
    });
  });

  it("function determined by math formula, with explicit copy tags", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function>
    <math><copy target="a"/>/(1+e^(-x/<copy target="b"/>))</math>
    </function>
    </graph>
    <number name="a">3</number>
    <math name="b">2</math>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_function1"].stateValues.nInputs).eq(1);

      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      // let numericalf = (stateVariables['/_function1'].stateValues.numericalfs)[0];
      // let symbolicf = (stateVariables['/_function1'].stateValues.symbolicfs)[0];

      expect(f(-5)).closeTo(3 / (1 + Math.exp(5 / 2)), 1e-12);
      expect(f(1)).closeTo(3 / (1 + Math.exp(-1 / 2)), 1e-12);
      // expect(numericalf(-5)).closeTo(3 / (1 + Math.exp(5 / 2)), 1E-12);
      // expect(numericalf(1)).closeTo(3 / (1 + Math.exp(-1 / 2)), 1E-12);
      // expect(symbolicf(-5).equals(me.fromText('3/(1+e^(5/2))'))).eq(true)
      // expect(symbolicf(1).equals(me.fromText('3/(1+e^(-1/2))'))).eq(true)
      // expect(symbolicf('z').equals(me.fromText('3/(1+e^(-z/2))'))).eq(true)
    });
  });

  it("symbolic function determined by formula via sugar", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function symbolic>
    3/(1+e^(-x/2))
    </function>
    </graph>
    <evaluate function="$_function1" input="z" name="fz" />
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let numericalf = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      // let numericalf = (stateVariables['/_function1'].stateValues.numericalfs)[0];
      // let symbolicf = (stateVariables['/_function1'].stateValues.symbolicfs)[0];

      // expect(f(-5).equals(me.fromText('3/(1+e^(5/2))'))).eq(true)
      // expect(f(1).equals(me.fromText('3/(1+e^(-1/2))'))).eq(true)
      // expect(f('z').equals(me.fromText('3/(1+e^(-z/2))'))).eq(true)
      expect(
        me
          .fromAst(stateVariables["/fz"].stateValues.value)
          .equals(me.fromText("3/(1+e^(-z/2))")),
      ).eq(true);
      expect(numericalf(-5)).closeTo(3 / (1 + Math.exp(5 / 2)), 1e-12);
      expect(numericalf(1)).closeTo(3 / (1 + Math.exp(-1 / 2)), 1e-12);
      // expect(symbolicf(-5).equals(me.fromText('3/(1+e^(5/2))'))).eq(true)
      // expect(symbolicf(1).equals(me.fromText('3/(1+e^(-1/2))'))).eq(true)
      // expect(symbolicf('z').equals(me.fromText('3/(1+e^(-z/2))'))).eq(true)
    });
  });

  it("symbolic function determined by formula via sugar, with strings and macro", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function symbolic>
    3/(1+e^(-$var/2))
    </function>
    </graph>
    <math name="var">x</math>
    <evaluate function="$_function1" input="z" name="fz" />
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let numericalf = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      // let numericalf = (stateVariables['/_function1'].stateValues.numericalfs)[0];
      // let symbolicf = (stateVariables['/_function1'].stateValues.symbolicfs)[0];

      // expect(f(-5).equals(me.fromText('3/(1+e^(5/2))'))).eq(true)
      // expect(f(1).equals(me.fromText('3/(1+e^(-1/2))'))).eq(true)
      // expect(f('z').equals(me.fromText('3/(1+e^(-z/2))'))).eq(true)
      expect(
        me
          .fromAst(stateVariables["/fz"].stateValues.value)
          .equals(me.fromText("3/(1+e^(-z/2))")),
      ).eq(true);
      expect(numericalf(-5)).closeTo(3 / (1 + Math.exp(5 / 2)), 1e-12);
      expect(numericalf(1)).closeTo(3 / (1 + Math.exp(-1 / 2)), 1e-12);
      // expect(symbolicf(-5).equals(me.fromText('3/(1+e^(5/2))'))).eq(true)
      // expect(symbolicf(1).equals(me.fromText('3/(1+e^(-1/2))'))).eq(true)
      // expect(symbolicf('z').equals(me.fromText('3/(1+e^(-z/2))'))).eq(true)
    });
  });

  it("symbolic function determined by math formula", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function symbolic><math>3/(1+e^(-x/2))</math></function>
    </graph>
    <evaluate function="$_function1" input="z" name="fz" />
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let numericalf = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      // let numericalf = (stateVariables['/_function1'].stateValues.numericalfs)[0];
      // let symbolicf = (stateVariables['/_function1'].stateValues.symbolicfs)[0];

      // expect(f(-5).equals(me.fromText('3/(1+e^(5/2))'))).eq(true)
      // expect(f(1).equals(me.fromText('3/(1+e^(-1/2))'))).eq(true)
      // expect(f('z').equals(me.fromText('3/(1+e^(-z/2))'))).eq(true)
      expect(
        me
          .fromAst(stateVariables["/fz"].stateValues.value)
          .equals(me.fromText("3/(1+e^(-z/2))")),
      ).eq(true);
      expect(numericalf(-5)).closeTo(3 / (1 + Math.exp(5 / 2)), 1e-12);
      expect(numericalf(1)).closeTo(3 / (1 + Math.exp(-1 / 2)), 1e-12);
      // expect(symbolicf(-5).equals(me.fromText('3/(1+e^(5/2))'))).eq(true)
      // expect(symbolicf(1).equals(me.fromText('3/(1+e^(-1/2))'))).eq(true)
    });
  });

  it("function determined by sugar formula in different variable", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function variables="q">
      q^2 sin(pi q/2)/100
    </function>

    </graph>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      // let numericalf = (stateVariables['/_function1'].stateValues.numericalfs)[0];
      // let symbolicf = (stateVariables['/_function1'].stateValues.symbolicfs)[0];

      expect(f(-5)).closeTo((25 * Math.sin(0.5 * Math.PI * -5)) / 100, 1e-12);
      expect(f(3)).closeTo((9 * Math.sin(0.5 * Math.PI * 3)) / 100, 1e-12);
      // expect(numericalf(-5)).closeTo(25 * Math.sin(0.5 * Math.PI * (-5)) / 100, 1E-12);
      // expect(numericalf(3)).closeTo(9 * Math.sin(0.5 * Math.PI * (3)) / 100, 1E-12);
      // expect(symbolicf(-5).equals(me.fromText('(-5)^2sin(pi(-5)/2)/100'))).eq(true)
      // expect(symbolicf(3).equals(me.fromText('(3)^2sin(pi(3)/2)/100'))).eq(true)
      // expect(symbolicf('p').equals(me.fromText('p^2sin(pi p/2)/100'))).eq(true)
    });
  });

  it("function determined by sugar formula in different variable, with strings and macros", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function variable="$var">
      $var^$c sin(pi $var/$c)/$d
    </function>

    </graph>
    <math name="var">q</math>
    <number name="c">2</number>
    <number name="d">100</number>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      // let numericalf = (stateVariables['/_function1'].stateValues.numericalfs)[0];
      // let symbolicf = (stateVariables['/_function1'].stateValues.symbolicfs)[0];

      expect(f(-5)).closeTo((25 * Math.sin(0.5 * Math.PI * -5)) / 100, 1e-12);
      expect(f(3)).closeTo((9 * Math.sin(0.5 * Math.PI * 3)) / 100, 1e-12);
      // expect(numericalf(-5)).closeTo(25 * Math.sin(0.5 * Math.PI * (-5)) / 100, 1E-12);
      // expect(numericalf(3)).closeTo(9 * Math.sin(0.5 * Math.PI * (3)) / 100, 1E-12);
      // expect(symbolicf(-5).equals(me.fromText('(-5)^2sin(pi(-5)/2)/100'))).eq(true)
      // expect(symbolicf(3).equals(me.fromText('(3)^2sin(pi(3)/2)/100'))).eq(true)
      // expect(symbolicf('p').equals(me.fromText('p^2sin(pi p/2)/100'))).eq(true)
    });
  });

  it("function determined by math formula in different variable", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
      <function variables="q"><math>q^2 sin(pi q/2)/100</math></function>
    </graph>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      // let numericalf = (stateVariables['/_function1'].stateValues.numericalfs)[0];
      // let symbolicf = (stateVariables['/_function1'].stateValues.symbolicfs)[0];

      expect(f(-5)).closeTo((25 * Math.sin(0.5 * Math.PI * -5)) / 100, 1e-12);
      expect(f(3)).closeTo((9 * Math.sin(0.5 * Math.PI * 3)) / 100, 1e-12);
      // expect(numericalf(-5)).closeTo(25 * Math.sin(0.5 * Math.PI * (-5)) / 100, 1E-12);
      // expect(numericalf(3)).closeTo(9 * Math.sin(0.5 * Math.PI * (3)) / 100, 1E-12);
      // expect(symbolicf(-5).equals(me.fromText('(-5)^2sin(pi(-5)/2)/100'))).eq(true)
      // expect(symbolicf(3).equals(me.fromText('(3)^2sin(pi(3)/2)/100'))).eq(true)
      // expect(symbolicf('p').equals(me.fromText('p^2sin(pi p/2)/100'))).eq(true)
    });
  });

  it("function with empty variables attribute", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function variables="">
      x^2 sin(pi x/2)/100
    </function>

    </graph>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      // let numericalf = (stateVariables['/_function1'].stateValues.numericalfs)[0];
      // let symbolicf = (stateVariables['/_function1'].stateValues.symbolicfs)[0];

      expect(f(-5)).closeTo((25 * Math.sin(0.5 * Math.PI * -5)) / 100, 1e-12);
      expect(f(3)).closeTo((9 * Math.sin(0.5 * Math.PI * 3)) / 100, 1e-12);
      // expect(numericalf(-5)).closeTo(25 * Math.sin(0.5 * Math.PI * (-5)) / 100, 1E-12);
      // expect(numericalf(3)).closeTo(9 * Math.sin(0.5 * Math.PI * (3)) / 100, 1E-12);
      // expect(symbolicf(-5).equals(me.fromText('(-5)^2sin(pi(-5)/2)/100'))).eq(true)
      // expect(symbolicf(3).equals(me.fromText('(3)^2sin(pi(3)/2)/100'))).eq(true)
      // expect(symbolicf('p').equals(me.fromText('p^2sin(pi p/2)/100'))).eq(true)
    });
  });

  it("function determined by function", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <function variable="q"><math>q^2 sin(pi q/2)/100</math></function>
    <graph>
      <function>
        $_function1
      </function>
    </graph>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = createFunctionFromDefinition(
        stateVariables["/_function2"].stateValues.fDefinitions[0],
      );
      // let numericalf = (stateVariables['/_function2'].stateValues.numericalfs)[0];
      // let symbolicf = (stateVariables['/_function2'].stateValues.symbolicfs)[0];

      expect(f(-5)).closeTo((25 * Math.sin(0.5 * Math.PI * -5)) / 100, 1e-12);
      expect(f(3)).closeTo((9 * Math.sin(0.5 * Math.PI * 3)) / 100, 1e-12);
      // expect(numericalf(-5)).closeTo(25 * Math.sin(0.5 * Math.PI * (-5)) / 100, 1E-12);
      // expect(numericalf(3)).closeTo(9 * Math.sin(0.5 * Math.PI * (3)) / 100, 1E-12);
      // expect(symbolicf(-5).equals(me.fromText('(-5)^2sin(pi(-5)/2)/100'))).eq(true)
      // expect(symbolicf(3).equals(me.fromText('(3)^2sin(pi(3)/2)/100'))).eq(true)
      // expect(symbolicf('p').equals(me.fromText('p^2sin(pi p/2)/100'))).eq(true)
    });
  });

  it("function determined by function, label with math", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <function variables="q"><math>q^2 sin(pi q/2)/100</math></function>
    <graph>
      <function>
        $_function1
        <label><copy prop="formula" target="_function2" /></label>
      </function>
    </graph>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = createFunctionFromDefinition(
        stateVariables["/_function2"].stateValues.fDefinitions[0],
      );

      expect(f(-5)).closeTo((25 * Math.sin(0.5 * Math.PI * -5)) / 100, 1e-12);
      expect(f(3)).closeTo((9 * Math.sin(0.5 * Math.PI * 3)) / 100, 1e-12);

      expect(
        stateVariables["/_function2"].stateValues.label
          .replaceAll("\\,", "")
          .replaceAll(" ", ""),
      ).eq("\\(\\frac{q^{2}\\sin\\left(\\frac{\\piq}{2}\\right)}{100}\\)");
    });
  });

  it("point constrained to function in different variable", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function variable="u">
      log(2u)
    </function>
    <point x="-3" y="5">
      <constraints>
        <constrainTo><copy target="_function1" /></constrainTo>
      </constraints>
    </point>

    </graph>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let p = stateVariables["/_point1"];

      let x = me.fromAst(p.stateValues.xs[0]).evaluate_to_constant();
      let y = me.fromAst(p.stateValues.xs[1]).evaluate_to_constant();

      expect(Math.log(2 * x)).closeTo(y, 1e-5);

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 8, y: 8 },
      });

      stateVariables = await win.returnAllStateVariables1();

      p = stateVariables["/_point1"];

      x = me.fromAst(p.stateValues.xs[0]).evaluate_to_constant();
      y = me.fromAst(p.stateValues.xs[1]).evaluate_to_constant();

      expect(Math.log(2 * x)).closeTo(y, 1e-5);

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -8, y: -8 },
      });

      stateVariables = await win.returnAllStateVariables1();

      p = stateVariables["/_point1"];

      x = me.fromAst(p.stateValues.xs[0]).evaluate_to_constant();
      y = me.fromAst(p.stateValues.xs[1]).evaluate_to_constant();

      expect(Math.log(2 * x)).closeTo(y, 1e-5);
    });
  });

  it("point constrained to function in different variable, restrict left-open domain", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function variables="u" domain="(0.1, 6]" >
      log(2u)
    </function>
    <point x="-3" y="5">
      <constraints>
        <constrainTo><copy target="_function1" /></constrainTo>
      </constraints>
    </point>

    </graph>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let p = stateVariables["/_point1"];

      let x = me.fromAst(p.stateValues.xs[0]).evaluate_to_constant();
      let y = me.fromAst(p.stateValues.xs[1]).evaluate_to_constant();

      expect(x).greaterThan(0.1 + 1e-12);
      expect(x).lessThan(0.1 + 1e-3);
      expect(Math.log(2 * x)).closeTo(y, 1e-5);

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 4, y: 6 },
      });

      stateVariables = await win.returnAllStateVariables1();

      p = stateVariables["/_point1"];

      x = me.fromAst(p.stateValues.xs[0]).evaluate_to_constant();
      y = me.fromAst(p.stateValues.xs[1]).evaluate_to_constant();

      expect(x).closeTo(4, 1e-12);
      expect(Math.log(2 * x)).closeTo(y, 1e-5);

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 8, y: 8 },
      });

      stateVariables = await win.returnAllStateVariables1();

      p = stateVariables["/_point1"];

      x = me.fromAst(p.stateValues.xs[0]).evaluate_to_constant();
      y = me.fromAst(p.stateValues.xs[1]).evaluate_to_constant();

      expect(x).closeTo(6, 1e-12);
      expect(Math.log(2 * x)).closeTo(y, 1e-5);

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -8, y: -8 },
      });

      stateVariables = await win.returnAllStateVariables1();

      p = stateVariables["/_point1"];

      x = me.fromAst(p.stateValues.xs[0]).evaluate_to_constant();
      y = me.fromAst(p.stateValues.xs[1]).evaluate_to_constant();

      expect(x).greaterThan(0.1 + 1e-12);
      expect(x).lessThan(0.1 + 1e-3);
      expect(Math.log(2 * x)).closeTo(y, 1e-5);
    });
  });

  it("point constrained to function in different variable, restrict right-open domain", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function variable="u" domain="[0.1, 6)" >
      log(2u)
    </function>
    <point x="-3" y="5">
      <constraints>
        <constrainTo><copy target="_function1" /></constrainTo>
      </constraints>
    </point>

    </graph>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let p = stateVariables["/_point1"];

      let x = me.fromAst(p.stateValues.xs[0]).evaluate_to_constant();
      let y = me.fromAst(p.stateValues.xs[1]).evaluate_to_constant();

      expect(x).eq(0.1);
      expect(Math.log(2 * x)).closeTo(y, 1e-5);

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 4, y: 6 },
      });

      stateVariables = await win.returnAllStateVariables1();

      p = stateVariables["/_point1"];

      x = me.fromAst(p.stateValues.xs[0]).evaluate_to_constant();
      y = me.fromAst(p.stateValues.xs[1]).evaluate_to_constant();

      expect(x).closeTo(4, 1e-12);
      expect(Math.log(2 * x)).closeTo(y, 1e-5);

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 8, y: 8 },
      });

      stateVariables = await win.returnAllStateVariables1();

      p = stateVariables["/_point1"];

      x = me.fromAst(p.stateValues.xs[0]).evaluate_to_constant();
      y = me.fromAst(p.stateValues.xs[1]).evaluate_to_constant();

      expect(x).lessThan(6 - 1e-12);
      expect(x).greaterThan(6 - 1e-3);
      expect(Math.log(2 * x)).closeTo(y, 1e-5);

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -8, y: -8 },
      });

      stateVariables = await win.returnAllStateVariables1();

      p = stateVariables["/_point1"];

      x = me.fromAst(p.stateValues.xs[0]).evaluate_to_constant();
      y = me.fromAst(p.stateValues.xs[1]).evaluate_to_constant();

      expect(x).closeTo(0.1, 1e-12);
      expect(Math.log(2 * x)).closeTo(y, 1e-5);
    });
  });

  it("calculated extrema from spline", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <!--<graph>-->
    <point>(0.7, 5.43)</point>
    <point>(3,4)</point>
    <point>(5,6)</point>
    <point>(-5,6)</point>
    <function through="$_point1 $_point2" maxima="$_point3" minima="$_point4" />
    <copy prop="maxima" target="_function1" />
    <copy prop="minima" target="_function1" />
    <!--</graph>-->

    <p>Number of maxima: <copy prop="numMaxima" assignNames="numMaxima" target="_function1" /></p>
    <p>Maxima: <math simplify="none"><copy prop="maxima" target="_function1" /></math></p>
    <p>Number of minima: <copy prop="numMinima" assignNames="numMinima" target="_function1" /></p>
    <p>Minima: <math simplify="none"><copy prop="minima" target="_function1" /></math></p>
    <p>Number of extrema: <copy prop="numExtrema" assignNames="numExtrema" target="_function1" /></p>
    <p>Extrema: <math simplify="none"><copy prop="extrema" target="_function1" /></math></p>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/numMaxima")).should("have.text", "2");
    cy.get(cesc("#\\/_math1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("((−2.15,7),(5,6))");
      });
    cy.get(cesc("#\\/numMinima")).should("have.text", "2");
    cy.get(cesc("#\\/_math2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("((−5,6),(3,4))");
      });
    cy.get(cesc("#\\/numExtrema")).should("have.text", "4");

    cy.get(cesc("#\\/_math3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("((−5,6),(−2.15,7),(3,4),(5,6))");
      });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 2, y: 2 },
      });

      cy.get(cesc("#\\/numMaxima")).should("have.text", "2");
      cy.get(cesc("#\\/_math1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("((−1.5,7),(5,6))");
        });
      cy.get(cesc("#\\/numMinima")).should("have.text", "2");
      cy.get(cesc("#\\/_math2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("((−5,6),(2,2))");
        });
      cy.get(cesc("#\\/numExtrema")).should("have.text", "4");
      cy.get(cesc("#\\/_math3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("((−5,6),(−1.5,7),(2,2),(5,6))");
        });
    });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 3.6, y: 5.1 },
      });

      cy.get(cesc("#\\/numMaxima")).should("have.text", "3");
      cy.get(cesc("#\\/_math1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("((−1,7),(3.6,5.1),(5,6))");
        });
      cy.get(cesc("#\\/numMinima")).should("have.text", "3");
      cy.get(cesc("#\\/_math2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("((−5,6),(3,4),(4.3,5))");
        });
      cy.get(cesc("#\\/numExtrema")).should("have.text", "6");
      cy.get(cesc("#\\/_math3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal(
            "((−5,6),(−1,7),(3,4),(3.6,5.1),(4.3,5),(5,6))",
          );
        });
    });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 8, y: 9 },
      });

      cy.get(cesc("#\\/numMaxima")).should("have.text", "2");
      cy.get(cesc("#\\/_math1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("((−1,7),(5,6))");
        });
      cy.get(cesc("#\\/numMinima")).should("have.text", "3");
      cy.get(cesc("#\\/_math2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("((−5,6),(3,4),(6.5,5))");
        });
      cy.get(cesc("#\\/numExtrema")).should("have.text", "5");
      cy.get(cesc("#\\/_math3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("((−5,6),(−1,7),(3,4),(5,6),(6.5,5))");
        });
    });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 5, y: 2 },
      });

      cy.get(cesc("#\\/numMaxima")).should("have.text", "0");
      cy.get(cesc("#\\/_math1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("＿");
        });
      cy.get(cesc("#\\/numMinima")).should("have.text", "0");
      cy.get(cesc("#\\/_math2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("＿");
        });
      cy.get(cesc("#\\/numExtrema")).should("have.text", "0");
      cy.get(cesc("#\\/_math3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("＿");
        });
    });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -9, y: 0 },
      });

      cy.get(cesc("#\\/numMaxima")).should("have.text", "3");
      cy.get(cesc("#\\/_math1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("((−7,7),(−1,7),(5,6))");
        });
      cy.get(cesc("#\\/numMinima")).should("have.text", "2");
      cy.get(cesc("#\\/_math2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("((−5,6),(3,4))");
        });
      cy.get(cesc("#\\/numExtrema")).should("have.text", "5");
      cy.get(cesc("#\\/_math3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("((−7,7),(−5,6),(−1,7),(3,4),(5,6))");
        });
    });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point4",
        args: { x: 8, y: 3 },
      });

      cy.get(cesc("#\\/numMaxima")).should("have.text", "1");
      cy.get(cesc("#\\/_math1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(5,6)");
        });
      cy.get(cesc("#\\/numMinima")).should("have.text", "1");
      cy.get(cesc("#\\/_math2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(8,3)");
        });
      cy.get(cesc("#\\/numExtrema")).should("have.text", "2");
      cy.get(cesc("#\\/_math3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("((5,6),(8,3))");
        });
    });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point4",
        args: { x: 8, y: 6 },
      });

      cy.get(cesc("#\\/numMaxima")).should("have.text", "2");
      cy.get(cesc("#\\/_math1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("((5,6),(7,7))");
        });
      cy.get(cesc("#\\/numMinima")).should("have.text", "2");
      cy.get(cesc("#\\/_math2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("((6,5),(8,6))");
        });
      cy.get(cesc("#\\/numExtrema")).should("have.text", "4");
      cy.get(cesc("#\\/_math3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("((5,6),(6,5),(7,7),(8,6))");
        });
    });
  });

  it("calculated extrema from spline, restrict to right-open domain", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>xmin = <mathinput name="xmin" prefill="-4" />
    xmax = <mathinput name="xmax" prefill="7" /></p>
    <graph>
    <point>(0.7, 5.43)</point>
    <point>(3,4)</point>
    <point>(5,6)</point>
    <point>(-5,6)</point>
    <function through="$_point1 $_point2" maxima="$_point3" minima="$_point4" domain="[$xmin, $xmax)" />
    <copy prop="maxima" target="_function1" />
    <copy prop="minima" target="_function1" />
    </graph>

    <p>Number of maxima: <copy prop="numMaxima" assignNames="numMaxima" target="_function1" /></p>
    <p>Maxima: <math simplify="none"><copy prop="maxima" target="_function1" /></math></p>
    <p>Number of minima: <copy prop="numMinima" assignNames="numMinima" target="_function1" /></p>
    <p>Minima: <math simplify="none"><copy prop="minima" target="_function1" /></math></p>
    <p>Number of extrema: <copy prop="numExtrema" assignNames="numExtrema" target="_function1" /></p>
    <p>Extrema: <math simplify="none"><copy prop="extrema" target="_function1" /></math></p>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/numMaxima")).should("have.text", "2");
    cy.get(cesc("#\\/_math1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("((−2.15,7),(5,6))");
      });
    cy.get(cesc("#\\/numMinima")).should("have.text", "1");
    cy.get(cesc("#\\/_math2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(3,4)");
      });
    cy.get(cesc("#\\/numExtrema")).should("have.text", "3");

    cy.get(cesc("#\\/_math3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("((−2.15,7),(3,4),(5,6))");
      });

    cy.get(cesc("#\\/xmin") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/xmax") + " textarea").type("{end}{backspace}4{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/numMaxima")).should("have.text", "0");
    cy.get(cesc("#\\/_math1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("＿");
      });
    cy.get(cesc("#\\/numMinima")).should("have.text", "1");
    cy.get(cesc("#\\/_math2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(3,4)");
      });
    cy.get(cesc("#\\/numExtrema")).should("have.text", "1");

    cy.get(cesc("#\\/_math3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(3,4)");
      });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 2, y: 2 },
      });

      cy.get(cesc("#\\/numMaxima")).should("have.text", "1");
      cy.get(cesc("#\\/_math1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−1.5,7)");
        });
      cy.get(cesc("#\\/numMinima")).should("have.text", "1");
      cy.get(cesc("#\\/_math2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(2,2)");
        });
      cy.get(cesc("#\\/numExtrema")).should("have.text", "2");
      cy.get(cesc("#\\/_math3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("((−1.5,7),(2,2))");
        });

      cy.get(cesc("#\\/xmin") + " textarea").type("{end}{backspace}6{enter}", {
        force: true,
      });
      cy.get(cesc("#\\/xmax") + " textarea").type("{end}{backspace}8{enter}", {
        force: true,
      });

      cy.get(cesc("#\\/numMaxima")).should("have.text", "2");
      cy.get(cesc("#\\/_math1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("((−1.5,7),(5,6))");
        });
      cy.get(cesc("#\\/numMinima")).should("have.text", "2");
      cy.get(cesc("#\\/_math2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("((−5,6),(2,2))");
        });
      cy.get(cesc("#\\/numExtrema")).should("have.text", "4");
      cy.get(cesc("#\\/_math3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("((−5,6),(−1.5,7),(2,2),(5,6))");
        });
    });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 3.6, y: 5.1 },
      });

      cy.get(cesc("#\\/numMaxima")).should("have.text", "3");
      cy.get(cesc("#\\/_math1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("((−1,7),(3.6,5.1),(5,6))");
        });
      cy.get(cesc("#\\/numMinima")).should("have.text", "3");
      cy.get(cesc("#\\/_math2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("((−5,6),(3,4),(4.3,5))");
        });
      cy.get(cesc("#\\/numExtrema")).should("have.text", "6");
      cy.get(cesc("#\\/_math3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal(
            "((−5,6),(−1,7),(3,4),(3.6,5.1),(4.3,5),(5,6))",
          );
        });

      cy.get(cesc("#\\/xmin") + " textarea").type("{end}{backspace}1{enter}", {
        force: true,
      });
      cy.get(cesc("#\\/xmax") + " textarea").type("{end}{backspace}4{enter}", {
        force: true,
      });

      cy.get(cesc("#\\/numMaxima")).should("have.text", "2");
      cy.get(cesc("#\\/_math1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("((−1,7),(3.6,5.1))");
        });
      cy.get(cesc("#\\/numMinima")).should("have.text", "1");
      cy.get(cesc("#\\/_math2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(3,4)");
        });
      cy.get(cesc("#\\/numExtrema")).should("have.text", "3");
      cy.get(cesc("#\\/_math3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("((−1,7),(3,4),(3.6,5.1))");
        });
    });
  });

  it("calculated extrema from spline, restrict to left-open domain", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>xmin = <mathinput name="xmin" prefill="-4" />
    xmax = <mathinput name="xmax" prefill="7" /></p>
    <graph>
    <point>(0.7, 5.43)</point>
    <point>(3,4)</point>
    <point>(5,6)</point>
    <point>(-5,6)</point>
    <function through="$_point1 $_point2" maxima="$_point3" minima="$_point4" domain="($xmin, $xmax]" />
    <copy prop="maxima" target="_function1" />
    <copy prop="minima" target="_function1" />
    </graph>

    <p>Number of maxima: <copy prop="numMaxima" assignNames="numMaxima" target="_function1" /></p>
    <p>Maxima: <math simplify="none"><copy prop="maxima" target="_function1" /></math></p>
    <p>Number of minima: <copy prop="numMinima" assignNames="numMinima" target="_function1" /></p>
    <p>Minima: <math simplify="none"><copy prop="minima" target="_function1" /></math></p>
    <p>Number of extrema: <copy prop="numExtrema" assignNames="numExtrema" target="_function1" /></p>
    <p>Extrema: <math simplify="none"><copy prop="extrema" target="_function1" /></math></p>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/numMaxima")).should("have.text", "2");
    cy.get(cesc("#\\/_math1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("((−2.15,7),(5,6))");
      });
    cy.get(cesc("#\\/numMinima")).should("have.text", "1");
    cy.get(cesc("#\\/_math2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(3,4)");
      });
    cy.get(cesc("#\\/numExtrema")).should("have.text", "3");

    cy.get(cesc("#\\/_math3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("((−2.15,7),(3,4),(5,6))");
      });

    cy.get(cesc("#\\/xmin") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/xmax") + " textarea").type("{end}{backspace}4{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/numMaxima")).should("have.text", "0");
    cy.get(cesc("#\\/_math1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("＿");
      });
    cy.get(cesc("#\\/numMinima")).should("have.text", "1");
    cy.get(cesc("#\\/_math2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(3,4)");
      });
    cy.get(cesc("#\\/numExtrema")).should("have.text", "1");

    cy.get(cesc("#\\/_math3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(3,4)");
      });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 2, y: 2 },
      });

      cy.get(cesc("#\\/numMaxima")).should("have.text", "1");
      cy.get(cesc("#\\/_math1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−1.5,7)");
        });
      cy.get(cesc("#\\/numMinima")).should("have.text", "1");
      cy.get(cesc("#\\/_math2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(2,2)");
        });
      cy.get(cesc("#\\/numExtrema")).should("have.text", "2");
      cy.get(cesc("#\\/_math3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("((−1.5,7),(2,2))");
        });

      cy.get(cesc("#\\/xmin") + " textarea").type("{end}{backspace}6{enter}", {
        force: true,
      });
      cy.get(cesc("#\\/xmax") + " textarea").type("{end}{backspace}8{enter}", {
        force: true,
      });

      cy.get(cesc("#\\/numMaxima")).should("have.text", "2");
      cy.get(cesc("#\\/_math1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("((−1.5,7),(5,6))");
        });
      cy.get(cesc("#\\/numMinima")).should("have.text", "2");
      cy.get(cesc("#\\/_math2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("((−5,6),(2,2))");
        });
      cy.get(cesc("#\\/numExtrema")).should("have.text", "4");
      cy.get(cesc("#\\/_math3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("((−5,6),(−1.5,7),(2,2),(5,6))");
        });
    });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 3.6, y: 5.1 },
      });

      cy.get(cesc("#\\/numMaxima")).should("have.text", "3");
      cy.get(cesc("#\\/_math1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("((−1,7),(3.6,5.1),(5,6))");
        });
      cy.get(cesc("#\\/numMinima")).should("have.text", "3");
      cy.get(cesc("#\\/_math2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("((−5,6),(3,4),(4.3,5))");
        });
      cy.get(cesc("#\\/numExtrema")).should("have.text", "6");
      cy.get(cesc("#\\/_math3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal(
            "((−5,6),(−1,7),(3,4),(3.6,5.1),(4.3,5),(5,6))",
          );
        });

      cy.get(cesc("#\\/xmin") + " textarea").type("{end}{backspace}1{enter}", {
        force: true,
      });
      cy.get(cesc("#\\/xmax") + " textarea").type("{end}{backspace}4{enter}", {
        force: true,
      });

      cy.get(cesc("#\\/numMaxima")).should("have.text", "1");
      cy.get(cesc("#\\/_math1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(3.6,5.1)");
        });
      cy.get(cesc("#\\/numMinima")).should("have.text", "1");
      cy.get(cesc("#\\/_math2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(3,4)");
        });
      cy.get(cesc("#\\/numExtrema")).should("have.text", "2");
      cy.get(cesc("#\\/_math3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("((3,4),(3.6,5.1))");
        });
    });
  });

  it("calculated extrema from spline, restrict domain, just through points", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
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

    <p>Number of maxima: <copy prop="numMaxima" assignNames="numMaxima" target="_function1" /></p>
    <p>Maxima: <math simplify="none"><copy prop="maxima" target="_function1" /></math></p>
    <p>Number of minima: <copy prop="numMinima" assignNames="numMinima" target="_function1" /></p>
    <p>Minima: <math simplify="none"><copy prop="minima" target="_function1" /></math></p>
    <p>Number of extrema: <copy prop="numExtrema" assignNames="numExtrema" target="_function1" /></p>
    <p>Extrema: <math simplify="none"><copy prop="extrema" target="_function1" /></math></p>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    // it is set up so that minimum of quadratic interpolating between first two points
    // is past maximum of domain
    // check for bug where this stopped looking for minima
    cy.get(cesc("#\\/numMaxima")).should("have.text", "0");
    cy.get(cesc("#\\/numMinima")).should("have.text", "1");
    cy.get(cesc("#\\/_math2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(5,−4)");
      });
    cy.get(cesc("#\\/numExtrema")).should("have.text", "1");

    cy.get(cesc("#\\/_math3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(5,−4)");
      });

    cy.window().then(async (win) => {
      // now move points so that the minimum of the cubic interpolating between
      // the first two points is past maximum of the domain
      // check for bug where this stopped looking for minima

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 0, y: -0.35 },
      });
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: 1.8, y: -1.36 },
      });
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point5",
        args: { x: 1, y: -0.866 },
      });

      cy.get(cesc("#\\/numMaxima")).should("have.text", "0");
      cy.get(cesc("#\\/numMinima")).should("have.text", "1");
      cy.get(cesc("#\\/_math2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(5,−4)");
        });
      cy.get(cesc("#\\/numExtrema")).should("have.text", "1");
      cy.get(cesc("#\\/_math3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(5,−4)");
        });
    });

    cy.window().then(async (win) => {
      // now move points so that maximum of quadratic interpolating between first two points
      // is past maximum of domain
      // check for bug where this stopped looking for maxima

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 0, y: 0 },
      });
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: 2, y: 1.8 },
      });
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: 5, y: 4 },
      });
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point5",
        args: { x: 8, y: -1 },
      });

      cy.get(cesc("#\\/numMaxima")).should("have.text", "1");
      cy.get(cesc("#\\/_math1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(5,4)");
        });
      cy.get(cesc("#\\/numMinima")).should("have.text", "0");
      cy.get(cesc("#\\/numExtrema")).should("have.text", "1");
      cy.get(cesc("#\\/_math3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(5,4)");
        });
    });

    cy.window().then(async (win) => {
      // now move points so that the maximum of the cubic interpolating between
      // the first two points is past maximum of the domain
      // check for bug where this stopped looking for maximum

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 0, y: 0.35 },
      });
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: 1.8, y: 1.36 },
      });
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point5",
        args: { x: 1, y: 0.866 },
      });

      cy.get(cesc("#\\/numMaxima")).should("have.text", "1");
      cy.get(cesc("#\\/_math1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(5,4)");
        });
      cy.get(cesc("#\\/numMinima")).should("have.text", "0");
      cy.get(cesc("#\\/numExtrema")).should("have.text", "1");
      cy.get(cesc("#\\/_math3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(5,4)");
        });
    });
  });

  it("calculated extrema from gaussians", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <point layer="2">(0,1)</point>
    <point layer="2">(3,1)</point>
    <function>$_point1.y exp(-(x-$_point1.x)^2)+$_point2.y exp(-(x-$_point2.x)^2)</function>
    <copy prop="extrema" target="_function1" />
    </graph>
    
    <p>Number of maxima: <copy prop="numMaxima" assignNames="numMaxima" target="_function1" /></p>
    <p>Maximum locations: <copy prop="maximumlocation1" assignNames="maximumlocation1" target="_function1" />,
    <copy prop="maximumlocation2" assignNames="maximumlocation2" target="_function1" /></p>
    <p>Maximum values: <copy prop="maximumvalue1" assignNames="maximumvalue1" target="_function1" />,
    <copy prop="maximumvalue2" assignNames="maximumvalue2" target="_function1" /></p>
    <p>Number of minima: <copy prop="numMinima" assignNames="numMinima" target="_function1" /></p>
    <p>Minimum locations: <copy prop="minimumlocation1" assignNames="minimumlocation1" target="_function1" />,
    <copy prop="minimumlocation2" assignNames="minimumlocation2" target="_function1" /></p>
    <p>Minimum values: <copy prop="minimumvalue1" assignNames="minimumvalue1" target="_function1" />,
    <copy prop="minimumvalue2" assignNames="minimumvalue2" target="_function1" /></p>
    <p>Number of extrema: <copy prop="numExtrema" assignNames="numExtrema" target="_function1" /></p>
    <p>Extremum locations: <copy prop="extremumlocation1" assignNames="extremumlocation1" target="_function1" />,
    <copy prop="extremumlocation2" assignNames="extremumlocation2" target="_function1" />,
    <copy prop="extremumlocation3" assignNames="extremumlocation3" target="_function1" /></p>
    <p>Extremum values: <copy prop="extremumvalue1" assignNames="extremumvalue1" target="_function1" />,
    <copy prop="extremumvalue2" assignNames="extremumvalue2" target="_function1" />,
    <copy prop="extremumvalue3" assignNames="extremumvalue3" target="_function1" /></p>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/numMaxima")).should("have.text", "2");
    cy.get(cesc("#\\/maximumlocation1"))
      .invoke("text")
      .then((text) => {
        expect(Number(text.replace(/−/, "-"))).closeTo(0, 0.01);
      });
    cy.get(cesc("#\\/maximumlocation2"))
      .invoke("text")
      .then((text) => {
        expect(Number(text.replace(/−/, "-"))).closeTo(3, 0.01);
      });
    cy.get(cesc("#\\/maximumvalue1"))
      .invoke("text")
      .then((text) => {
        expect(Number(text.replace(/−/, "-"))).closeTo(1, 0.01);
      });
    cy.get(cesc("#\\/maximumvalue2"))
      .invoke("text")
      .then((text) => {
        expect(Number(text.replace(/−/, "-"))).closeTo(1, 0.01);
      });

    cy.get(cesc("#\\/numMinima")).should("have.text", "1");
    cy.get(cesc("#\\/minimumlocation1"))
      .invoke("text")
      .then((text) => {
        expect(Number(text.replace(/−/, "-"))).closeTo(1.5, 0.01);
      });
    cy.get(cesc("#\\/minimumvalue1"))
      .invoke("text")
      .then((text) => {
        expect(Number(text.replace(/−/, "-"))).closeTo(0.21, 0.01);
      });

    cy.get(cesc("#\\/numExtrema")).should("have.text", "3");
    cy.get(cesc("#\\/extremumlocation1"))
      .invoke("text")
      .then((text) => {
        expect(Number(text.replace(/−/, "-"))).closeTo(0, 0.01);
      });
    cy.get(cesc("#\\/extremumlocation2"))
      .invoke("text")
      .then((text) => {
        expect(Number(text.replace(/−/, "-"))).closeTo(1.5, 0.01);
      });
    cy.get(cesc("#\\/extremumlocation3"))
      .invoke("text")
      .then((text) => {
        expect(Number(text.replace(/−/, "-"))).closeTo(3, 0.01);
      });
    cy.get(cesc("#\\/extremumvalue1"))
      .invoke("text")
      .then((text) => {
        expect(Number(text.replace(/−/, "-"))).closeTo(1, 0.01);
      });
    cy.get(cesc("#\\/extremumvalue2"))
      .invoke("text")
      .then((text) => {
        expect(Number(text.replace(/−/, "-"))).closeTo(0.21, 0.01);
      });
    cy.get(cesc("#\\/extremumvalue3"))
      .invoke("text")
      .then((text) => {
        expect(Number(text.replace(/−/, "-"))).closeTo(1, 0.01);
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: 3, y: -1 },
      });

      cy.get(cesc("#\\/numMaxima")).should("have.text", "1");
      cy.get(cesc("#\\/maximumlocation1"))
        .invoke("text")
        .then((text) => {
          expect(Number(text.replace(/−/, "-"))).closeTo(0, 0.01);
        });
      cy.get(cesc("#\\/maximumlocation2")).should("not.exist");
      cy.get(cesc("#\\/maximumvalue1"))
        .invoke("text")
        .then((text) => {
          expect(Number(text.replace(/−/, "-"))).closeTo(1, 0.01);
        });
      cy.get(cesc("#\\/maximumvalue2")).should("not.exist");

      cy.get(cesc("#\\/numMinima")).should("have.text", "1");
      cy.get(cesc("#\\/minimumlocation1"))
        .invoke("text")
        .then((text) => {
          expect(Number(text.replace(/−/, "-"))).closeTo(3, 0.01);
        });
      cy.get(cesc("#\\/minimumvalue1"))
        .invoke("text")
        .then((text) => {
          expect(Number(text.replace(/−/, "-"))).closeTo(-1, 0.01);
        });

      cy.get(cesc("#\\/numExtrema")).should("have.text", "2");
      cy.get(cesc("#\\/extremumlocation1"))
        .invoke("text")
        .then((text) => {
          expect(Number(text.replace(/−/, "-"))).closeTo(0, 0.01);
        });
      cy.get(cesc("#\\/extremumlocation2"))
        .invoke("text")
        .then((text) => {
          expect(Number(text.replace(/−/, "-"))).closeTo(3, 0.01);
        });
      cy.get(cesc("#\\/extremumlocation3")).should("not.exist");
      cy.get(cesc("#\\/extremumvalue1"))
        .invoke("text")
        .then((text) => {
          expect(Number(text.replace(/−/, "-"))).closeTo(1, 0.01);
        });
      cy.get(cesc("#\\/extremumvalue2"))
        .invoke("text")
        .then((text) => {
          expect(Number(text.replace(/−/, "-"))).closeTo(-1, 0.01);
        });
      cy.get(cesc("#\\/extremumvalue3")).should("not.exist");
    });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 0, y: -1 },
      });

      cy.get(cesc("#\\/numMaxima")).should("have.text", "1");
      cy.get(cesc("#\\/maximumlocation1"))
        .invoke("text")
        .then((text) => {
          expect(Number(text.replace(/−/, "-"))).closeTo(1.5, 0.01);
        });
      cy.get(cesc("#\\/maximumlocation2")).should("not.exist");
      cy.get(cesc("#\\/maximumvalue1"))
        .invoke("text")
        .then((text) => {
          expect(Number(text.replace(/−/, "-"))).closeTo(-0.21, 0.01);
        });
      cy.get(cesc("#\\/maximumvalue2")).should("not.exist");

      cy.get(cesc("#\\/numMinima")).should("have.text", "2");
      cy.get(cesc("#\\/minimumlocation1"))
        .invoke("text")
        .then((text) => {
          expect(Number(text.replace(/−/, "-"))).closeTo(0, 0.01);
        });
      cy.get(cesc("#\\/minimumlocation2"))
        .invoke("text")
        .then((text) => {
          expect(Number(text.replace(/−/, "-"))).closeTo(3, 0.01);
        });
      cy.get(cesc("#\\/minimumvalue1"))
        .invoke("text")
        .then((text) => {
          expect(Number(text.replace(/−/, "-"))).closeTo(-1, 0.01);
        });
      cy.get(cesc("#\\/minimumvalue2"))
        .invoke("text")
        .then((text) => {
          expect(Number(text.replace(/−/, "-"))).closeTo(-1, 0.01);
        });

      cy.get(cesc("#\\/numExtrema")).should("have.text", "3");
      cy.get(cesc("#\\/extremumlocation1"))
        .invoke("text")
        .then((text) => {
          expect(Number(text.replace(/−/, "-"))).closeTo(0, 0.01);
        });
      cy.get(cesc("#\\/extremumlocation2"))
        .invoke("text")
        .then((text) => {
          expect(Number(text.replace(/−/, "-"))).closeTo(1.5, 0.01);
        });
      cy.get(cesc("#\\/extremumlocation3"))
        .invoke("text")
        .then((text) => {
          expect(Number(text.replace(/−/, "-"))).closeTo(3, 0.01);
        });
      cy.get(cesc("#\\/extremumvalue1"))
        .invoke("text")
        .then((text) => {
          expect(Number(text.replace(/−/, "-"))).closeTo(-1, 0.01);
        });
      cy.get(cesc("#\\/extremumvalue2"))
        .invoke("text")
        .then((text) => {
          expect(Number(text.replace(/−/, "-"))).closeTo(-0.21, 0.01);
        });
      cy.get(cesc("#\\/extremumvalue3"))
        .invoke("text")
        .then((text) => {
          expect(Number(text.replace(/−/, "-"))).closeTo(-1, 0.01);
        });
    });
  });

  it("calculated extrema from sinusoid", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
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
    <p><copy prop="value" target="_mathinput1" assignNames="m1" /></p>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let f = stateVariables["/_function1"];

      expect(f.stateValues.numMaxima).eq(0);
      expect(f.stateValues.numMinima).eq(0);
      expect(f.stateValues.numExtrema).eq(0);
    });

    cy.get(cesc("#\\/_mathinput1") + " textarea").type("10{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/m1")).should("contain.text", "10");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let period = 10;

      let f = stateVariables["/_function1"];

      expect(f.stateValues.numMaxima).eq(200 / period);

      let maximumLocations = f.stateValues.maximumLocations;
      for (let m of maximumLocations) {
        expect(((m % period) + period) % period).closeTo(period / 4, 0.0001);
      }

      let maximumValues = f.stateValues.maximumValues;
      for (let m of maximumValues) {
        expect(m).closeTo(1, 0.0001);
      }

      expect(f.stateValues.numMinima).eq(200 / period);

      let minimumLocations = f.stateValues.minimumLocations;
      for (let m of minimumLocations) {
        expect(((m % period) + period) % period).closeTo(
          (3 * period) / 4,
          0.0001,
        );
      }

      let minimumValues = f.stateValues.minimumValues;
      for (let m of minimumValues) {
        expect(m).closeTo(-1, 0.0001);
      }

      expect(f.stateValues.numExtrema).eq(400 / period);

      let extremumLocations = f.stateValues.minimumLocations;
      for (let m of extremumLocations) {
        expect(((m % (period / 2)) + period / 2) % (period / 2)).closeTo(
          period / 4,
          0.0001,
        );
      }

      let extremumValues = f.stateValues.minimumValues;
      for (let m of extremumValues) {
        expect(Math.abs(m)).closeTo(1, 0.0001);
      }
    });

    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      "{end}{backspace}{backspace}5{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/m1")).should("contain.text", "5");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let period = 5;

      let f = stateVariables["/_function1"];

      expect(f.stateValues.numMaxima).eq(200 / period);

      let maximumLocations = f.stateValues.maximumLocations;
      for (let m of maximumLocations) {
        expect(((m % period) + period) % period).closeTo(period / 4, 0.0001);
      }

      let maximumValues = f.stateValues.maximumValues;
      for (let m of maximumValues) {
        expect(m).closeTo(1, 0.0001);
      }

      expect(f.stateValues.numMinima).eq(200 / period);

      let minimumLocations = f.stateValues.minimumLocations;
      for (let m of minimumLocations) {
        expect(((m % period) + period) % period).closeTo(
          (3 * period) / 4,
          0.0001,
        );
      }

      let minimumValues = f.stateValues.minimumValues;
      for (let m of minimumValues) {
        expect(m).closeTo(-1, 0.0001);
      }

      expect(f.stateValues.numExtrema).eq(400 / period);

      let extremumLocations = f.stateValues.minimumLocations;
      for (let m of extremumLocations) {
        expect(((m % (period / 2)) + period / 2) % (period / 2)).closeTo(
          period / 4,
          0.0001,
        );
      }

      let extremumValues = f.stateValues.minimumValues;
      for (let m of extremumValues) {
        expect(Math.abs(m)).closeTo(1, 0.0001);
      }
    });
  });

  it("calculated extrema from sinusoid, restrict domain", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
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
    <p><copy prop="value" target="_mathinput1" assignNames="m1" /></p>
    <p><copy prop="value" target="xmax" assignNames="xmax2" /></p>

    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let f = stateVariables["/_function1"];

      expect(f.stateValues.numMaxima).eq(0);
      expect(f.stateValues.numMinima).eq(0);
      expect(f.stateValues.numExtrema).eq(0);
    });

    cy.get(cesc("#\\/_mathinput1") + " textarea").type("10{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/m1")).should("contain.text", "10");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let period = 10;

      let f = stateVariables["/_function1"];

      expect(f.stateValues.numMaxima).eq(20 / period);

      let maximumLocations = f.stateValues.maximumLocations;
      for (let m of maximumLocations) {
        expect(((m % period) + period) % period).closeTo(period / 4, 0.0001);
      }

      let maximumValues = f.stateValues.maximumValues;
      for (let m of maximumValues) {
        expect(m).closeTo(1, 0.0001);
      }

      expect(f.stateValues.numMinima).eq(20 / period);

      let minimumLocations = f.stateValues.minimumLocations;
      for (let m of minimumLocations) {
        expect(((m % period) + period) % period).closeTo(
          (3 * period) / 4,
          0.0001,
        );
      }

      let minimumValues = f.stateValues.minimumValues;
      for (let m of minimumValues) {
        expect(m).closeTo(-1, 0.0001);
      }

      expect(f.stateValues.numExtrema).eq(40 / period);

      let extremumLocations = f.stateValues.minimumLocations;
      for (let m of extremumLocations) {
        expect(((m % (period / 2)) + period / 2) % (period / 2)).closeTo(
          period / 4,
          0.0001,
        );
      }

      let extremumValues = f.stateValues.minimumValues;
      for (let m of extremumValues) {
        expect(Math.abs(m)).closeTo(1, 0.0001);
      }
    });

    cy.get(cesc("#\\/xmin") + " textarea").type(
      "{end}{backspace}{backspace}5{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/xmax") + " textarea").type(
      "{end}{backspace}{backspace}25{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/xmax2")).should("contain.text", "25");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let period = 10;

      let f = stateVariables["/_function1"];

      expect(f.stateValues.numMaxima).eq(30 / period);

      let maximumLocations = f.stateValues.maximumLocations;
      for (let m of maximumLocations) {
        expect(((m % period) + period) % period).closeTo(period / 4, 0.0001);
      }

      let maximumValues = f.stateValues.maximumValues;
      for (let m of maximumValues) {
        expect(m).closeTo(1, 0.0001);
      }

      expect(f.stateValues.numMinima).eq(30 / period);

      let minimumLocations = f.stateValues.minimumLocations;
      for (let m of minimumLocations) {
        expect(((m % period) + period) % period).closeTo(
          (3 * period) / 4,
          0.0001,
        );
      }

      let minimumValues = f.stateValues.minimumValues;
      for (let m of minimumValues) {
        expect(m).closeTo(-1, 0.0001);
      }

      expect(f.stateValues.numExtrema).eq(60 / period);

      let extremumLocations = f.stateValues.minimumLocations;
      for (let m of extremumLocations) {
        expect(((m % (period / 2)) + period / 2) % (period / 2)).closeTo(
          period / 4,
          0.0001,
        );
      }

      let extremumValues = f.stateValues.minimumValues;
      for (let m of extremumValues) {
        expect(Math.abs(m)).closeTo(1, 0.0001);
      }
    });

    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      "{end}{backspace}{backspace}5{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/m1")).should("contain.text", "5");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let period = 5;

      let f = stateVariables["/_function1"];

      expect(f.stateValues.numMaxima).eq(30 / period);

      let maximumLocations = f.stateValues.maximumLocations;
      for (let m of maximumLocations) {
        expect(((m % period) + period) % period).closeTo(period / 4, 0.0001);
      }

      let maximumValues = f.stateValues.maximumValues;
      for (let m of maximumValues) {
        expect(m).closeTo(1, 0.0001);
      }

      expect(f.stateValues.numMinima).eq(30 / period);

      let minimumLocations = f.stateValues.minimumLocations;
      for (let m of minimumLocations) {
        expect(((m % period) + period) % period).closeTo(
          (3 * period) / 4,
          0.0001,
        );
      }

      let minimumValues = f.stateValues.minimumValues;
      for (let m of minimumValues) {
        expect(m).closeTo(-1, 0.0001);
      }

      expect(f.stateValues.numExtrema).eq(60 / period);

      let extremumLocations = f.stateValues.minimumLocations;
      for (let m of extremumLocations) {
        expect(((m % (period / 2)) + period / 2) % (period / 2)).closeTo(
          period / 4,
          0.0001,
        );
      }

      let extremumValues = f.stateValues.minimumValues;
      for (let m of extremumValues) {
        expect(Math.abs(m)).closeTo(1, 0.0001);
      }
    });

    cy.get(cesc("#\\/xmin") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/xmax") + " textarea").type(
      "{end}{backspace}{backspace}9{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/xmax2")).should("contain.text", "9");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let period = 5;

      let f = stateVariables["/_function1"];

      expect(f.stateValues.numMaxima).eq(10 / period);

      let maximumLocations = f.stateValues.maximumLocations;
      for (let m of maximumLocations) {
        expect(((m % period) + period) % period).closeTo(period / 4, 0.0001);
      }

      let maximumValues = f.stateValues.maximumValues;
      for (let m of maximumValues) {
        expect(m).closeTo(1, 0.0001);
      }

      expect(f.stateValues.numMinima).eq(10 / period);

      let minimumLocations = f.stateValues.minimumLocations;
      for (let m of minimumLocations) {
        expect(((m % period) + period) % period).closeTo(
          (3 * period) / 4,
          0.0001,
        );
      }

      let minimumValues = f.stateValues.minimumValues;
      for (let m of minimumValues) {
        expect(m).closeTo(-1, 0.0001);
      }

      expect(f.stateValues.numExtrema).eq(20 / period);

      let extremumLocations = f.stateValues.minimumLocations;
      for (let m of extremumLocations) {
        expect(((m % (period / 2)) + period / 2) % (period / 2)).closeTo(
          period / 4,
          0.0001,
        );
      }

      let extremumValues = f.stateValues.minimumValues;
      for (let m of extremumValues) {
        expect(Math.abs(m)).closeTo(1, 0.0001);
      }
    });
  });

  it("no extrema with horizontal asymptote", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function>
      1/(1+exp(-10*x))
    </function>
    <copy prop="minima" target="_function1" />
    <copy prop="maxima" target="_function1" />
    </graph>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let f = stateVariables["/_function1"];

      expect(await f.stateValues.numMaxima).eq(0);
      expect(await f.stateValues.numMinima).eq(0);
      expect(await f.stateValues.numExtrema).eq(0);
    });
  });

  it("extrema of rational function", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
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

    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let f = stateVariables["/_function1"];

      // values of extrema computed in Sage
      let minimumLocations = [-2.29152990292159];
      let minimumValues = [0.150710261517204];
      let maximumLocations = [
        -11.6660173492088, 3.18454272065031, 9.77300453148004,
      ];
      let maximumValues = [
        0.00247762462709702, -1.9201441781587, 0.012920204644976,
      ];

      expect(f.stateValues.numMaxima).eq(3);
      expect(f.stateValues.numMinima).eq(1);
      expect(f.stateValues.numExtrema).eq(4);

      // Note: since just one value, the arrayEntries minimumValues and minimumLocations
      // are not arrays.
      expect(f.stateValues.minimumValues).closeTo(minimumValues[0], 0.000001);
      expect(f.stateValues.minimumLocations).closeTo(
        minimumLocations[0],
        0.000001,
      );
      for (let i in maximumLocations) {
        expect(f.stateValues.maximumValues[i]).closeTo(
          maximumValues[i],
          0.000001,
        );
        expect(f.stateValues.maximumLocations[i]).closeTo(
          maximumLocations[i],
          0.000001,
        );
      }
    });
  });

  it("intervals of extrema are not counted", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function through="(-8,7) (-7,2) (-6,2) (-4,3) (-2,5) (8,5) (10,4)" />
    <copy prop="extrema" target="_function1" />
    </graph>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let f = stateVariables["/_function1"];
      expect(f.stateValues.numMaxima).eq(0);
      expect(f.stateValues.numMinima).eq(0);
      expect(f.stateValues.numExtrema).eq(0);
    });
  });

  it("extrema of function with restricted domain, not explicit", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
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

    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let f = stateVariables["/_function1"];
      expect(f.stateValues.numMaxima).eq(1);
      expect(f.stateValues.numMinima).eq(0);
      expect(f.stateValues.numExtrema).eq(1);

      expect(f.stateValues.maximumLocations).closeTo(2.614, 0.001);
      expect(f.stateValues.maximumValues).closeTo(3.82, 0.001);
    });
  });

  it("extrema in flat regions of functions", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
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


    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let f1 = stateVariables["/f1"];
      let f2 = stateVariables["/f2"];
      let f3 = stateVariables["/f3"];
      expect(f1.stateValues.numMaxima).eq(1);
      expect(f1.stateValues.numMinima).eq(0);
      expect(f1.stateValues.numExtrema).eq(1);
      expect((await f1.stateValues.maxima)[0][0]).closeTo(1.0131, 1e-6);
      expect(f1.stateValues.maxima[0][1]).eq(2);
      expect((await f1.stateValues.extrema)[0][0]).closeTo(1.0131, 1e-6);
      expect(f1.stateValues.extrema[0][1]).eq(2);

      expect(f2.stateValues.numMaxima).eq(0);
      expect(f2.stateValues.numMinima).eq(1);
      expect(f2.stateValues.numExtrema).eq(1);
      expect((await f2.stateValues.minima)[0][0]).closeTo(-Math.PI, 1e-6);
      expect(f2.stateValues.minima[0][1]).eq(3);
      expect((await f2.stateValues.extrema)[0][0]).closeTo(-Math.PI, 1e-6);
      expect(f2.stateValues.extrema[0][1]).eq(3);

      expect(f3.stateValues.numMaxima).eq(2);
      expect(f3.stateValues.numMinima).eq(2);
      expect(f3.stateValues.numExtrema).eq(4);
      expect((await f3.stateValues.minima)[0][0]).closeTo(
        (3 * Math.PI) / 6,
        1e-6,
      );
      expect(f3.stateValues.minima[0][1]).eq(-8);
      expect(f3.stateValues.minima[1][0]).closeTo((7 * Math.PI) / 6, 1e-6);
      expect(f3.stateValues.minima[1][1]).eq(-8);
      expect((await f3.stateValues.maxima)[0][0]).closeTo(
        (5 * Math.PI) / 6,
        1e-6,
      );
      expect(f3.stateValues.maxima[0][1]).eq(-5);
      expect(f3.stateValues.maxima[1][0]).closeTo((9 * Math.PI) / 6, 1e-6);
      expect(f3.stateValues.maxima[1][1]).eq(-5);
      expect((await f3.stateValues.extrema)[0][0]).closeTo(
        (3 * Math.PI) / 6,
        1e-6,
      );
      expect(f3.stateValues.extrema[0][1]).eq(-8);
      expect(f3.stateValues.extrema[1][0]).closeTo((5 * Math.PI) / 6, 1e-6);
      expect(f3.stateValues.extrema[1][1]).eq(-5);
      expect(f3.stateValues.extrema[2][0]).closeTo((7 * Math.PI) / 6, 1e-6);
      expect(f3.stateValues.extrema[2][1]).eq(-8);
      expect(f3.stateValues.extrema[3][0]).closeTo((9 * Math.PI) / 6, 1e-6);
      expect(f3.stateValues.extrema[3][1]).eq(-5);
    });
  });

  it("extrema at domain endpoints, function from formula", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
      <function name="f1" domain="(-pi,2pi)" displayDecimals="5" displaySmallAsZero="10^(-6)">cos(x)</function>
      <function name="f2" domain="[-pi,2pi]" displayDecimals="5" displaySmallAsZero="10^(-6)">cos(x)+1</function>
      <function name="f3" domain="(-3pi/2,3pi/2]" displayDecimals="5" displaySmallAsZero="10^(-6)">sin(x)+2</function>
      <function name="f4" domain="[-3pi/2,3pi/2)" displayDecimals="5" displaySmallAsZero="10^(-6)">sin(x)+3</function>
    </graph>
    <p><copy prop="extrema" target="f1" assignNames="f1e1 f1e2 f1e3" /></p>
    <p><copy prop="extrema" target="f2" assignNames="f2e1 f2e2 f2e3 f2e4 f2e5" /></p>
    <p><copy prop="extrema" target="f3" assignNames="f3e1 f3e2 f3e3 f3e4" /></p>
    <p><copy prop="extrema" target="f4" assignNames="f4e1 f4e2 f4e3 f4e4" /></p>

    <graph>
      <function name="f1a" domain="[-pi+10^(-6),2pi-10^(-6)]" displayDecimals="5" displaySmallAsZero="10^(-6)">cos(x)</function>
      <function name="f3a" domain="[-3pi/2+10^(-6),3pi/2]" displayDecimals="5" displaySmallAsZero="10^(-6)">sin(x)+2</function>
      <function name="f4a" domain="[-3pi/2,3pi/2-10^(-6)]" displayDecimals="5" displaySmallAsZero="10^(-6)">sin(x)+3</function>
    </graph>
    <p><copy prop="extrema" target="f1a" assignNames="f1ae1 f1ae2 f1ae3" /></p>
    <p><copy prop="extrema" target="f3a" assignNames="f3ae1 f3ae2 f3ae3 f3ae4" /></p>
    <p><copy prop="extrema" target="f4a" assignNames="f4ae1 f4ae2 f4ae3 f4ae4" /></p>

    <graph>
      <function name="f5" domain="(0,3pi)" displayDecimals="5" displaySmallAsZero="10^(-6)">cos(x)</function>
      <function name="f6" domain="[0,3pi]" displayDecimals="5" displaySmallAsZero="10^(-6)">cos(x)+1</function>
      <function name="f7" domain="(0,3pi]" displayDecimals="5" displaySmallAsZero="10^(-6)">cos(x-pi)+4</function>
      <function name="f8" domain="[0,3pi)" displayDecimals="5" displaySmallAsZero="10^(-6)">cos(x-pi)+5</function>
      
    </graph>
    <p><copy prop="extrema" target="f5" assignNames="f5e1 f5e2 f5e3" /></p>
    <p><copy prop="extrema" target="f6" assignNames="f6e1 f6e2 f6e3 f6e4 f6e5" /></p>
    <p><copy prop="extrema" target="f7" assignNames="f7e1 f7e2 f7e3 f7e4" /></p>
    <p><copy prop="extrema" target="f8" assignNames="f8e1 f8e2 f8e3 f8e4" /></p>

    <graph>
      <function name="f9" domain="(-3pi, 0)" displayDecimals="5" displaySmallAsZero="10^(-6)">cos(x)</function>
      <function name="f10" domain="[-3pi, 0]" displayDecimals="5" displaySmallAsZero="10^(-6)">cos(x)+1</function>
      <function name="f11" domain="(-3pi, 0]" displayDecimals="5" displaySmallAsZero="10^(-6)">cos(x-pi)+4</function>
      <function name="f12" domain="[-3pi, 0)" displayDecimals="5" displaySmallAsZero="10^(-6)">cos(x-pi)+5</function>
      
    </graph>
    <p><copy prop="extrema" target="f9" assignNames="f9e1 f9e2 f9e3" /></p>
    <p><copy prop="extrema" target="f10" assignNames="f10e1 f10e2 f10e3 f10e4 f10e5" /></p>
    <p><copy prop="extrema" target="f11" assignNames="f11e1 f11e2 f11e3 f11e4" /></p>
    <p><copy prop="extrema" target="f12" assignNames="f12e1 f12e2 f12e3 f12e4" /></p>


    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/f1e1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(`(0,1)`);
      });
    cy.get(cesc("#\\/f1e2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(Math.PI * 10 ** 5) / 10 ** 5)},${nInDOM(-1)})`,
        );
      });
    cy.get(cesc("#\\/f1e3")).should("not.exist");

    cy.get(cesc("#\\/f2e1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(-Math.PI * 10 ** 5) / 10 ** 5)},0)`,
        );
      });
    cy.get(cesc("#\\/f2e2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(`(0,2)`);
      });
    cy.get(cesc("#\\/f2e3") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(Math.PI * 10 ** 5) / 10 ** 5)},0)`,
        );
      });
    cy.get(cesc("#\\/f2e4") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(2 * Math.PI * 10 ** 5) / 10 ** 5)},2)`,
        );
      });
    cy.get(cesc("#\\/f2e5")).should("not.exist");

    cy.get(cesc("#\\/f3e1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(-0.5 * Math.PI * 10 ** 5) / 10 ** 5)},1)`,
        );
      });
    cy.get(cesc("#\\/f3e2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(0.5 * Math.PI * 10 ** 5) / 10 ** 5)},3)`,
        );
      });
    cy.get(cesc("#\\/f3e3") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(1.5 * Math.PI * 10 ** 5) / 10 ** 5)},1)`,
        );
      });
    cy.get(cesc("#\\/f3e4")).should("not.exist");

    cy.get(cesc("#\\/f4e1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(-1.5 * Math.PI * 10 ** 5) / 10 ** 5)},4)`,
        );
      });
    cy.get(cesc("#\\/f4e2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(-0.5 * Math.PI * 10 ** 5) / 10 ** 5)},2)`,
        );
      });
    cy.get(cesc("#\\/f4e3") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(0.5 * Math.PI * 10 ** 5) / 10 ** 5)},4)`,
        );
      });
    cy.get(cesc("#\\/f4e4")).should("not.exist");

    cy.get(cesc("#\\/f1ae1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(`(0,1)`);
      });
    cy.get(cesc("#\\/f1ae2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(Math.PI * 10 ** 5) / 10 ** 5)},${nInDOM(-1)})`,
        );
      });
    cy.get(cesc("#\\/f1ae3")).should("not.exist");

    cy.get(cesc("#\\/f3ae1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(-0.5 * Math.PI * 10 ** 5) / 10 ** 5)},1)`,
        );
      });
    cy.get(cesc("#\\/f3ae2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(0.5 * Math.PI * 10 ** 5) / 10 ** 5)},3)`,
        );
      });
    cy.get(cesc("#\\/f3ae3") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(1.5 * Math.PI * 10 ** 5) / 10 ** 5)},1)`,
        );
      });
    cy.get(cesc("#\\/f3ae4")).should("not.exist");

    cy.get(cesc("#\\/f4ae1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(-1.5 * Math.PI * 10 ** 5) / 10 ** 5)},4)`,
        );
      });
    cy.get(cesc("#\\/f4ae2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(-0.5 * Math.PI * 10 ** 5) / 10 ** 5)},2)`,
        );
      });
    cy.get(cesc("#\\/f4ae3") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(0.5 * Math.PI * 10 ** 5) / 10 ** 5)},4)`,
        );
      });
    cy.get(cesc("#\\/f4ae4")).should("not.exist");

    cy.get(cesc("#\\/f5e1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(Math.PI * 10 ** 5) / 10 ** 5)},${nInDOM(-1)})`,
        );
      });
    cy.get(cesc("#\\/f5e2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(2 * Math.PI * 10 ** 5) / 10 ** 5)},${nInDOM(
            1,
          )})`,
        );
      });
    cy.get(cesc("#\\/f5e3")).should("not.exist");

    cy.get(cesc("#\\/f6e1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(`(0,2)`);
      });
    cy.get(cesc("#\\/f6e2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(Math.PI * 10 ** 5) / 10 ** 5)},0)`,
        );
      });
    cy.get(cesc("#\\/f6e3") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(2 * Math.PI * 10 ** 5) / 10 ** 5)},2)`,
        );
      });
    cy.get(cesc("#\\/f6e4") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(3 * Math.PI * 10 ** 5) / 10 ** 5)},0)`,
        );
      });
    cy.get(cesc("#\\/f6e5")).should("not.exist");

    cy.get(cesc("#\\/f7e1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(Math.PI * 10 ** 5) / 10 ** 5)},5)`,
        );
      });
    cy.get(cesc("#\\/f7e2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(2 * Math.PI * 10 ** 5) / 10 ** 5)},3)`,
        );
      });
    cy.get(cesc("#\\/f7e3") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(3 * Math.PI * 10 ** 5) / 10 ** 5)},5)`,
        );
      });
    cy.get(cesc("#\\/f7e4")).should("not.exist");

    cy.get(cesc("#\\/f8e1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(`(0,4)`);
      });
    cy.get(cesc("#\\/f8e2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(Math.PI * 10 ** 5) / 10 ** 5)},6)`,
        );
      });
    cy.get(cesc("#\\/f8e3") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(2 * Math.PI * 10 ** 5) / 10 ** 5)},4)`,
        );
      });
    cy.get(cesc("#\\/f8e4")).should("not.exist");

    cy.get(cesc("#\\/f9e1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(-2 * Math.PI * 10 ** 5) / 10 ** 5)},${nInDOM(
            1,
          )})`,
        );
      });
    cy.get(cesc("#\\/f9e2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(-Math.PI * 10 ** 5) / 10 ** 5)},${nInDOM(-1)})`,
        );
      });
    cy.get(cesc("#\\/f9e3")).should("not.exist");

    cy.get(cesc("#\\/f10e1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(-3 * Math.PI * 10 ** 5) / 10 ** 5)},0)`,
        );
      });
    cy.get(cesc("#\\/f10e2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(-2 * Math.PI * 10 ** 5) / 10 ** 5)},2)`,
        );
      });
    cy.get(cesc("#\\/f10e3") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(-Math.PI * 10 ** 5) / 10 ** 5)},0)`,
        );
      });
    cy.get(cesc("#\\/f10e4") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(`(0,2)`);
      });
    cy.get(cesc("#\\/f10e5")).should("not.exist");

    cy.get(cesc("#\\/f11e1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(-2 * Math.PI * 10 ** 5) / 10 ** 5)},3)`,
        );
      });
    cy.get(cesc("#\\/f11e2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(-Math.PI * 10 ** 5) / 10 ** 5)},5)`,
        );
      });
    cy.get(cesc("#\\/f11e3") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(`(0,3)`);
      });
    cy.get(cesc("#\\/f11e4")).should("not.exist");

    cy.get(cesc("#\\/f12e1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(-3 * Math.PI * 10 ** 5) / 10 ** 5)},6)`,
        );
      });
    cy.get(cesc("#\\/f12e2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(-2 * Math.PI * 10 ** 5) / 10 ** 5)},4)`,
        );
      });
    cy.get(cesc("#\\/f12e3") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(-Math.PI * 10 ** 5) / 10 ** 5)},6)`,
        );
      });
    cy.get(cesc("#\\/f12e4")).should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let f1 = stateVariables["/f1"];
      let f2 = stateVariables["/f2"];
      let f3 = stateVariables["/f3"];
      let f4 = stateVariables["/f4"];
      expect(f1.stateValues.numMaxima).eq(1);
      expect(f1.stateValues.numMinima).eq(1);
      expect(f1.stateValues.numExtrema).eq(2);
      expect(f1.stateValues.minima[0][0]).closeTo(Math.PI, 1e-6);
      expect(f1.stateValues.minima[0][1]).eq(-1);
      expect(f1.stateValues.maxima[0][0]).closeTo(0, 1e-6);
      expect(f1.stateValues.maxima[0][1]).eq(1);
      expect(f1.stateValues.extrema[0][0]).closeTo(0, 1e-6);
      expect(f1.stateValues.extrema[0][1]).eq(1);
      expect(f1.stateValues.extrema[1][0]).closeTo(Math.PI, 1e-6);
      expect(f1.stateValues.extrema[1][1]).eq(-1);

      expect(f2.stateValues.numMaxima).eq(2);
      expect(f2.stateValues.numMinima).eq(2);
      expect(f2.stateValues.numExtrema).eq(4);
      expect(f2.stateValues.minima[0][0]).closeTo(-Math.PI, 1e-6);
      expect(f2.stateValues.minima[0][1]).eq(0);
      expect(f2.stateValues.minima[1][0]).closeTo(Math.PI, 1e-6);
      expect(f2.stateValues.minima[1][1]).eq(0);
      expect(f2.stateValues.maxima[0][0]).closeTo(0, 1e-6);
      expect(f2.stateValues.maxima[0][1]).eq(2);
      expect(f2.stateValues.maxima[1][0]).closeTo(2 * Math.PI, 1e-6);
      expect(f2.stateValues.maxima[1][1]).eq(2);
      expect(f2.stateValues.extrema[0][0]).closeTo(-Math.PI, 1e-6);
      expect(f2.stateValues.extrema[0][1]).eq(0);
      expect(f2.stateValues.extrema[1][0]).closeTo(0, 1e-6);
      expect(f2.stateValues.extrema[1][1]).eq(2);
      expect(f2.stateValues.extrema[2][0]).closeTo(Math.PI, 1e-6);
      expect(f2.stateValues.extrema[2][1]).eq(0);
      expect(f2.stateValues.extrema[3][0]).closeTo(2 * Math.PI, 1e-6);
      expect(f2.stateValues.extrema[3][1]).eq(2);

      expect(f3.stateValues.numMaxima).eq(1);
      expect(f3.stateValues.numMinima).eq(2);
      expect(f3.stateValues.numExtrema).eq(3);
      expect(f3.stateValues.minima[0][0]).closeTo(-0.5 * Math.PI, 1e-6);
      expect(f3.stateValues.minima[0][1]).eq(1);
      expect(f3.stateValues.minima[1][0]).closeTo(1.5 * Math.PI, 1e-6);
      expect(f3.stateValues.minima[1][1]).eq(1);
      expect(f3.stateValues.maxima[0][0]).closeTo(0.5 * Math.PI, 1e-6);
      expect(f3.stateValues.maxima[0][1]).eq(3);
      expect(f3.stateValues.extrema[0][0]).closeTo(-0.5 * Math.PI, 1e-6);
      expect(f3.stateValues.extrema[0][1]).eq(1);
      expect(f3.stateValues.extrema[1][0]).closeTo(0.5 * Math.PI, 1e-6);
      expect(f3.stateValues.extrema[1][1]).eq(3);
      expect(f3.stateValues.extrema[2][0]).closeTo(1.5 * Math.PI, 1e-6);
      expect(f3.stateValues.extrema[2][1]).eq(1);

      expect(f4.stateValues.numMaxima).eq(2);
      expect(f4.stateValues.numMinima).eq(1);
      expect(f4.stateValues.numExtrema).eq(3);
      expect(f4.stateValues.minima[0][0]).closeTo(-0.5 * Math.PI, 1e-6);
      expect(f4.stateValues.minima[0][1]).eq(2);
      expect(f4.stateValues.maxima[0][0]).closeTo(-1.5 * Math.PI, 1e-6);
      expect(f4.stateValues.maxima[0][1]).eq(4);
      expect(f4.stateValues.maxima[1][0]).closeTo(0.5 * Math.PI, 1e-6);
      expect(f4.stateValues.maxima[1][1]).eq(4);
      expect(f4.stateValues.extrema[0][0]).closeTo(-1.5 * Math.PI, 1e-6);
      expect(f4.stateValues.extrema[0][1]).eq(4);
      expect(f4.stateValues.extrema[1][0]).closeTo(-0.5 * Math.PI, 1e-6);
      expect(f4.stateValues.extrema[1][1]).eq(2);
      expect(f4.stateValues.extrema[2][0]).closeTo(0.5 * Math.PI, 1e-6);
      expect(f4.stateValues.extrema[2][1]).eq(4);

      let f1a = stateVariables["/f1a"];
      let f2a = stateVariables["/f2a"];
      let f3a = stateVariables["/f3a"];
      let f4a = stateVariables["/f4a"];
      expect(f1a.stateValues.numMaxima).eq(1);
      expect(f1a.stateValues.numMinima).eq(1);
      expect(f1a.stateValues.numExtrema).eq(2);
      expect(f1a.stateValues.minima[0][0]).closeTo(Math.PI, 1e-6);
      expect(f1a.stateValues.minima[0][1]).eq(-1);
      expect(f1a.stateValues.maxima[0][0]).closeTo(0, 1e-6);
      expect(f1a.stateValues.maxima[0][1]).eq(1);
      expect(f1a.stateValues.extrema[0][0]).closeTo(0, 1e-6);
      expect(f1a.stateValues.extrema[0][1]).eq(1);
      expect(f1a.stateValues.extrema[1][0]).closeTo(Math.PI, 1e-6);
      expect(f1a.stateValues.extrema[1][1]).eq(-1);

      expect(f3a.stateValues.numMaxima).eq(1);
      expect(f3a.stateValues.numMinima).eq(2);
      expect(f3a.stateValues.numExtrema).eq(3);
      expect(f3a.stateValues.minima[0][0]).closeTo(-0.5 * Math.PI, 1e-6);
      expect(f3a.stateValues.minima[0][1]).eq(1);
      expect(f3a.stateValues.minima[1][0]).closeTo(1.5 * Math.PI, 1e-6);
      expect(f3a.stateValues.minima[1][1]).eq(1);
      expect(f3a.stateValues.maxima[0][0]).closeTo(0.5 * Math.PI, 1e-6);
      expect(f3a.stateValues.maxima[0][1]).eq(3);
      expect(f3a.stateValues.extrema[0][0]).closeTo(-0.5 * Math.PI, 1e-6);
      expect(f3a.stateValues.extrema[0][1]).eq(1);
      expect(f3a.stateValues.extrema[1][0]).closeTo(0.5 * Math.PI, 1e-6);
      expect(f3a.stateValues.extrema[1][1]).eq(3);
      expect(f3a.stateValues.extrema[2][0]).closeTo(1.5 * Math.PI, 1e-6);
      expect(f3a.stateValues.extrema[2][1]).eq(1);

      expect(f4a.stateValues.numMaxima).eq(2);
      expect(f4a.stateValues.numMinima).eq(1);
      expect(f4a.stateValues.numExtrema).eq(3);
      expect(f4a.stateValues.minima[0][0]).closeTo(-0.5 * Math.PI, 1e-6);
      expect(f4a.stateValues.minima[0][1]).eq(2);
      expect(f4a.stateValues.maxima[0][0]).closeTo(-1.5 * Math.PI, 1e-6);
      expect(f4a.stateValues.maxima[0][1]).eq(4);
      expect(f4a.stateValues.maxima[1][0]).closeTo(0.5 * Math.PI, 1e-6);
      expect(f4a.stateValues.maxima[1][1]).eq(4);
      expect(f4a.stateValues.extrema[0][0]).closeTo(-1.5 * Math.PI, 1e-6);
      expect(f4a.stateValues.extrema[0][1]).eq(4);
      expect(f4a.stateValues.extrema[1][0]).closeTo(-0.5 * Math.PI, 1e-6);
      expect(f4a.stateValues.extrema[1][1]).eq(2);
      expect(f4a.stateValues.extrema[2][0]).closeTo(0.5 * Math.PI, 1e-6);
      expect(f4a.stateValues.extrema[2][1]).eq(4);

      let f5 = stateVariables["/f5"];
      let f6 = stateVariables["/f6"];
      let f7 = stateVariables["/f7"];
      let f8 = stateVariables["/f8"];
      expect(f5.stateValues.numMaxima).eq(1);
      expect(f5.stateValues.numMinima).eq(1);
      expect(f5.stateValues.numExtrema).eq(2);
      expect(f5.stateValues.minima[0][0]).closeTo(Math.PI, 1e-6);
      expect(f5.stateValues.minima[0][1]).eq(-1);
      expect(f5.stateValues.maxima[0][0]).closeTo(2 * Math.PI, 1e-6);
      expect(f5.stateValues.maxima[0][1]).eq(1);
      expect(f5.stateValues.extrema[0][0]).closeTo(Math.PI, 1e-6);
      expect(f5.stateValues.extrema[0][1]).eq(-1);
      expect(f5.stateValues.extrema[1][0]).closeTo(2 * Math.PI, 1e-6);
      expect(f5.stateValues.extrema[1][1]).eq(1);

      expect(f6.stateValues.numMaxima).eq(2);
      expect(f6.stateValues.numMinima).eq(2);
      expect(f6.stateValues.numExtrema).eq(4);
      expect(f6.stateValues.minima[0][0]).closeTo(Math.PI, 1e-6);
      expect(f6.stateValues.minima[0][1]).eq(0);
      expect(f6.stateValues.minima[1][0]).closeTo(3 * Math.PI, 1e-6);
      expect(f6.stateValues.minima[1][1]).eq(0);
      expect(f6.stateValues.maxima[0][0]).closeTo(0, 1e-6);
      expect(f6.stateValues.maxima[0][1]).eq(2);
      expect(f6.stateValues.maxima[1][0]).closeTo(2 * Math.PI, 1e-6);
      expect(f6.stateValues.maxima[1][1]).eq(2);
      expect(f6.stateValues.extrema[0][0]).closeTo(0, 1e-6);
      expect(f6.stateValues.extrema[0][1]).eq(2);
      expect(f6.stateValues.extrema[1][0]).closeTo(Math.PI, 1e-6);
      expect(f6.stateValues.extrema[1][1]).eq(0);
      expect(f6.stateValues.extrema[2][0]).closeTo(2 * Math.PI, 1e-6);
      expect(f6.stateValues.extrema[2][1]).eq(2);
      expect(f6.stateValues.extrema[3][0]).closeTo(3 * Math.PI, 1e-6);
      expect(f6.stateValues.extrema[3][1]).eq(0);

      expect(f7.stateValues.numMaxima).eq(2);
      expect(f7.stateValues.numMinima).eq(1);
      expect(f7.stateValues.numExtrema).eq(3);
      expect(f7.stateValues.minima[0][0]).closeTo(2 * Math.PI, 1e-6);
      expect(f7.stateValues.minima[0][1]).eq(3);
      expect(f7.stateValues.maxima[0][0]).closeTo(Math.PI, 1e-6);
      expect(f7.stateValues.maxima[0][1]).eq(5);
      expect(f7.stateValues.maxima[1][0]).closeTo(3 * Math.PI, 1e-6);
      expect(f7.stateValues.maxima[1][1]).eq(5);
      expect(f7.stateValues.extrema[0][0]).closeTo(Math.PI, 1e-6);
      expect(f7.stateValues.extrema[0][1]).eq(5);
      expect(f7.stateValues.extrema[1][0]).closeTo(2 * Math.PI, 1e-6);
      expect(f7.stateValues.extrema[1][1]).eq(3);
      expect(f7.stateValues.extrema[2][0]).closeTo(3 * Math.PI, 1e-6);
      expect(f7.stateValues.extrema[2][1]).eq(5);

      expect(f8.stateValues.numMaxima).eq(1);
      expect(f8.stateValues.numMinima).eq(2);
      expect(f8.stateValues.numExtrema).eq(3);
      expect(f8.stateValues.minima[0][0]).closeTo(0, 1e-6);
      expect(f8.stateValues.minima[0][1]).eq(4);
      expect(f8.stateValues.minima[1][0]).closeTo(2 * Math.PI, 1e-6);
      expect(f8.stateValues.minima[1][1]).eq(4);
      expect(f8.stateValues.maxima[0][0]).closeTo(Math.PI, 1e-6);
      expect(f8.stateValues.maxima[0][1]).eq(6);
      expect(f8.stateValues.extrema[0][0]).closeTo(0, 1e-6);
      expect(f8.stateValues.extrema[0][1]).eq(4);
      expect(f8.stateValues.extrema[1][0]).closeTo(Math.PI, 1e-6);
      expect(f8.stateValues.extrema[1][1]).eq(6);
      expect(f8.stateValues.extrema[2][0]).closeTo(2 * Math.PI, 1e-6);
      expect(f8.stateValues.extrema[2][1]).eq(4);

      let f9 = stateVariables["/f9"];
      let f10 = stateVariables["/f10"];
      let f11 = stateVariables["/f11"];
      let f12 = stateVariables["/f12"];
      expect(f9.stateValues.numMaxima).eq(1);
      expect(f9.stateValues.numMinima).eq(1);
      expect(f9.stateValues.numExtrema).eq(2);
      expect(f9.stateValues.minima[0][0]).closeTo(-Math.PI, 1e-6);
      expect(f9.stateValues.minima[0][1]).eq(-1);
      expect(f9.stateValues.maxima[0][0]).closeTo(-2 * Math.PI, 1e-6);
      expect(f9.stateValues.maxima[0][1]).eq(1);
      expect(f9.stateValues.extrema[0][0]).closeTo(-2 * Math.PI, 1e-6);
      expect(f9.stateValues.extrema[0][1]).eq(1);
      expect(f9.stateValues.extrema[1][0]).closeTo(-Math.PI, 1e-6);
      expect(f9.stateValues.extrema[1][1]).eq(-1);

      expect(f10.stateValues.numMaxima).eq(2);
      expect(f10.stateValues.numMinima).eq(2);
      expect(f10.stateValues.numExtrema).eq(4);
      expect(f10.stateValues.minima[0][0]).closeTo(-3 * Math.PI, 1e-6);
      expect(f10.stateValues.minima[0][1]).eq(0);
      expect(f10.stateValues.minima[1][0]).closeTo(-Math.PI, 1e-6);
      expect(f10.stateValues.minima[1][1]).eq(0);
      expect(f10.stateValues.maxima[0][0]).closeTo(-2 * Math.PI, 1e-6);
      expect(f10.stateValues.maxima[0][1]).eq(2);
      expect(f10.stateValues.maxima[1][0]).closeTo(0, 1e-6);
      expect(f10.stateValues.maxima[1][1]).eq(2);
      expect(f10.stateValues.extrema[0][0]).closeTo(-3 * Math.PI, 1e-6);
      expect(f10.stateValues.extrema[0][1]).eq(0);
      expect(f10.stateValues.extrema[1][0]).closeTo(-2 * Math.PI, 1e-6);
      expect(f10.stateValues.extrema[1][1]).eq(2);
      expect(f10.stateValues.extrema[2][0]).closeTo(-Math.PI, 1e-6);
      expect(f10.stateValues.extrema[2][1]).eq(0);
      expect(f10.stateValues.extrema[3][0]).closeTo(0, 1e-6);
      expect(f10.stateValues.extrema[3][1]).eq(2);

      expect(f11.stateValues.numMaxima).eq(1);
      expect(f11.stateValues.numMinima).eq(2);
      expect(f11.stateValues.numExtrema).eq(3);
      expect(f11.stateValues.minima[0][0]).closeTo(-2 * Math.PI, 1e-6);
      expect(f11.stateValues.minima[0][1]).eq(3);
      expect(f11.stateValues.minima[1][0]).closeTo(0, 1e-6);
      expect(f11.stateValues.minima[1][1]).eq(3);
      expect(f11.stateValues.maxima[0][0]).closeTo(-Math.PI, 1e-6);
      expect(f11.stateValues.maxima[0][1]).eq(5);
      expect(f11.stateValues.extrema[0][0]).closeTo(-2 * Math.PI, 1e-6);
      expect(f11.stateValues.extrema[0][1]).eq(3);
      expect(f11.stateValues.extrema[1][0]).closeTo(-Math.PI, 1e-6);
      expect(f11.stateValues.extrema[1][1]).eq(5);
      expect(f11.stateValues.extrema[2][0]).closeTo(0, 1e-6);
      expect(f11.stateValues.extrema[2][1]).eq(3);

      expect(f12.stateValues.numMaxima).eq(2);
      expect(f12.stateValues.numMinima).eq(1);
      expect(f12.stateValues.numExtrema).eq(3);
      expect(f12.stateValues.minima[0][0]).closeTo(-2 * Math.PI, 1e-6);
      expect(f12.stateValues.minima[0][1]).eq(4);
      expect(f12.stateValues.maxima[0][0]).closeTo(-3 * Math.PI, 1e-6);
      expect(f12.stateValues.maxima[0][1]).eq(6);
      expect(f12.stateValues.maxima[1][0]).closeTo(-Math.PI, 1e-6);
      expect(f12.stateValues.maxima[1][1]).eq(6);
      expect(f12.stateValues.extrema[0][0]).closeTo(-3 * Math.PI, 1e-6);
      expect(f12.stateValues.extrema[0][1]).eq(6);
      expect(f12.stateValues.extrema[1][0]).closeTo(-2 * Math.PI, 1e-6);
      expect(f12.stateValues.extrema[1][1]).eq(4);
      expect(f12.stateValues.extrema[2][0]).closeTo(-Math.PI, 1e-6);
      expect(f12.stateValues.extrema[2][1]).eq(6);
    });
  });

  it("extrema at domain endpoints, function from formula, link=false", () => {
    // Note: checking to see if rounding attributes are properly copied
    // for wrapped array state variables when link="false"
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
      <function name="f1" domain="(-pi,2pi)" displayDecimals="5" displaySmallAsZero="10^(-6)">cos(x)</function>
      <function name="f2" domain="[-pi,2pi]" displayDecimals="5" displaySmallAsZero="10^(-6)">cos(x)+1</function>
      <function name="f3" domain="(-3pi/2,3pi/2]" displayDecimals="5" displaySmallAsZero="10^(-6)">sin(x)+2</function>
      <function name="f4" domain="[-3pi/2,3pi/2)" displayDecimals="5" displaySmallAsZero="10^(-6)">sin(x)+3</function>
    </graph>
    <p><copy prop="extrema" target="f1" assignNames="f1e1 f1e2 f1e3" link="false" /></p>
    <p><copy prop="extrema" target="f2" assignNames="f2e1 f2e2 f2e3 f2e4 f2e5" link="false" /></p>
    <p><copy prop="extrema" target="f3" assignNames="f3e1 f3e2 f3e3 f3e4" link="false" /></p>
    <p><copy prop="extrema" target="f4" assignNames="f4e1 f4e2 f4e3 f4e4" link="false" /></p>

    <graph>
      <function name="f1a" domain="[-pi+10^(-6),2pi-10^(-6)]" displayDecimals="5" displaySmallAsZero="10^(-6)">cos(x)</function>
      <function name="f3a" domain="[-3pi/2+10^(-6),3pi/2]" displayDecimals="5" displaySmallAsZero="10^(-6)">sin(x)+2</function>
      <function name="f4a" domain="[-3pi/2,3pi/2-10^(-6)]" displayDecimals="5" displaySmallAsZero="10^(-6)">sin(x)+3</function>
    </graph>
    <p><copy prop="extrema" target="f1a" assignNames="f1ae1 f1ae2 f1ae3" link="false" /></p>
    <p><copy prop="extrema" target="f3a" assignNames="f3ae1 f3ae2 f3ae3 f3ae4" link="false" /></p>
    <p><copy prop="extrema" target="f4a" assignNames="f4ae1 f4ae2 f4ae3 f4ae4" link="false" /></p>

    <graph>
      <function name="f5" domain="(0,3pi)" displayDecimals="5" displaySmallAsZero="10^(-6)">cos(x)</function>
      <function name="f6" domain="[0,3pi]" displayDecimals="5" displaySmallAsZero="10^(-6)">cos(x)+1</function>
      <function name="f7" domain="(0,3pi]" displayDecimals="5" displaySmallAsZero="10^(-6)">cos(x-pi)+4</function>
      <function name="f8" domain="[0,3pi)" displayDecimals="5" displaySmallAsZero="10^(-6)">cos(x-pi)+5</function>
      
    </graph>
    <p><copy prop="extrema" target="f5" assignNames="f5e1 f5e2 f5e3" link="false" /></p>
    <p><copy prop="extrema" target="f6" assignNames="f6e1 f6e2 f6e3 f6e4 f6e5" link="false" /></p>
    <p><copy prop="extrema" target="f7" assignNames="f7e1 f7e2 f7e3 f7e4" link="false" /></p>
    <p><copy prop="extrema" target="f8" assignNames="f8e1 f8e2 f8e3 f8e4" link="false" /></p>

    <graph>
      <function name="f9" domain="(-3pi, 0)" displayDecimals="5" displaySmallAsZero="10^(-6)">cos(x)</function>
      <function name="f10" domain="[-3pi, 0]" displayDecimals="5" displaySmallAsZero="10^(-6)">cos(x)+1</function>
      <function name="f11" domain="(-3pi, 0]" displayDecimals="5" displaySmallAsZero="10^(-6)">cos(x-pi)+4</function>
      <function name="f12" domain="[-3pi, 0)" displayDecimals="5" displaySmallAsZero="10^(-6)">cos(x-pi)+5</function>
      
    </graph>
    <p><copy prop="extrema" target="f9" assignNames="f9e1 f9e2 f9e3" link="false" /></p>
    <p><copy prop="extrema" target="f10" assignNames="f10e1 f10e2 f10e3 f10e4 f10e5" link="false" /></p>
    <p><copy prop="extrema" target="f11" assignNames="f11e1 f11e2 f11e3 f11e4" link="false" /></p>
    <p><copy prop="extrema" target="f12" assignNames="f12e1 f12e2 f12e3 f12e4" link="false" /></p>


    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/f1e1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(`(0,1)`);
      });
    cy.get(cesc("#\\/f1e2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(Math.PI * 10 ** 5) / 10 ** 5)},${nInDOM(-1)})`,
        );
      });
    cy.get(cesc("#\\/f1e3")).should("not.exist");

    cy.get(cesc("#\\/f2e1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(-Math.PI * 10 ** 5) / 10 ** 5)},0)`,
        );
      });
    cy.get(cesc("#\\/f2e2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(`(0,2)`);
      });
    cy.get(cesc("#\\/f2e3") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(Math.PI * 10 ** 5) / 10 ** 5)},0)`,
        );
      });
    cy.get(cesc("#\\/f2e4") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(2 * Math.PI * 10 ** 5) / 10 ** 5)},2)`,
        );
      });
    cy.get(cesc("#\\/f2e5")).should("not.exist");

    cy.get(cesc("#\\/f3e1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(-0.5 * Math.PI * 10 ** 5) / 10 ** 5)},1)`,
        );
      });
    cy.get(cesc("#\\/f3e2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(0.5 * Math.PI * 10 ** 5) / 10 ** 5)},3)`,
        );
      });
    cy.get(cesc("#\\/f3e3") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(1.5 * Math.PI * 10 ** 5) / 10 ** 5)},1)`,
        );
      });
    cy.get(cesc("#\\/f3e4")).should("not.exist");

    cy.get(cesc("#\\/f4e1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(-1.5 * Math.PI * 10 ** 5) / 10 ** 5)},4)`,
        );
      });
    cy.get(cesc("#\\/f4e2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(-0.5 * Math.PI * 10 ** 5) / 10 ** 5)},2)`,
        );
      });
    cy.get(cesc("#\\/f4e3") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(0.5 * Math.PI * 10 ** 5) / 10 ** 5)},4)`,
        );
      });
    cy.get(cesc("#\\/f4e4")).should("not.exist");

    cy.get(cesc("#\\/f1ae1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(`(0,1)`);
      });
    cy.get(cesc("#\\/f1ae2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(Math.PI * 10 ** 5) / 10 ** 5)},${nInDOM(-1)})`,
        );
      });
    cy.get(cesc("#\\/f1ae3")).should("not.exist");

    cy.get(cesc("#\\/f3ae1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(-0.5 * Math.PI * 10 ** 5) / 10 ** 5)},1)`,
        );
      });
    cy.get(cesc("#\\/f3ae2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(0.5 * Math.PI * 10 ** 5) / 10 ** 5)},3)`,
        );
      });
    cy.get(cesc("#\\/f3ae3") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(1.5 * Math.PI * 10 ** 5) / 10 ** 5)},1)`,
        );
      });
    cy.get(cesc("#\\/f3ae4")).should("not.exist");

    cy.get(cesc("#\\/f4ae1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(-1.5 * Math.PI * 10 ** 5) / 10 ** 5)},4)`,
        );
      });
    cy.get(cesc("#\\/f4ae2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(-0.5 * Math.PI * 10 ** 5) / 10 ** 5)},2)`,
        );
      });
    cy.get(cesc("#\\/f4ae3") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(0.5 * Math.PI * 10 ** 5) / 10 ** 5)},4)`,
        );
      });
    cy.get(cesc("#\\/f4ae4")).should("not.exist");

    cy.get(cesc("#\\/f5e1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(Math.PI * 10 ** 5) / 10 ** 5)},${nInDOM(-1)})`,
        );
      });
    cy.get(cesc("#\\/f5e2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(2 * Math.PI * 10 ** 5) / 10 ** 5)},${nInDOM(
            1,
          )})`,
        );
      });
    cy.get(cesc("#\\/f5e3")).should("not.exist");

    cy.get(cesc("#\\/f6e1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(`(0,2)`);
      });
    cy.get(cesc("#\\/f6e2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(Math.PI * 10 ** 5) / 10 ** 5)},0)`,
        );
      });
    cy.get(cesc("#\\/f6e3") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(2 * Math.PI * 10 ** 5) / 10 ** 5)},2)`,
        );
      });
    cy.get(cesc("#\\/f6e4") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(3 * Math.PI * 10 ** 5) / 10 ** 5)},0)`,
        );
      });
    cy.get(cesc("#\\/f6e5")).should("not.exist");

    cy.get(cesc("#\\/f7e1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(Math.PI * 10 ** 5) / 10 ** 5)},5)`,
        );
      });
    cy.get(cesc("#\\/f7e2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(2 * Math.PI * 10 ** 5) / 10 ** 5)},3)`,
        );
      });
    cy.get(cesc("#\\/f7e3") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(3 * Math.PI * 10 ** 5) / 10 ** 5)},5)`,
        );
      });
    cy.get(cesc("#\\/f7e4")).should("not.exist");

    cy.get(cesc("#\\/f8e1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(`(0,4)`);
      });
    cy.get(cesc("#\\/f8e2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(Math.PI * 10 ** 5) / 10 ** 5)},6)`,
        );
      });
    cy.get(cesc("#\\/f8e3") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(2 * Math.PI * 10 ** 5) / 10 ** 5)},4)`,
        );
      });
    cy.get(cesc("#\\/f8e4")).should("not.exist");

    cy.get(cesc("#\\/f9e1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(-2 * Math.PI * 10 ** 5) / 10 ** 5)},${nInDOM(
            1,
          )})`,
        );
      });
    cy.get(cesc("#\\/f9e2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(-Math.PI * 10 ** 5) / 10 ** 5)},${nInDOM(-1)})`,
        );
      });
    cy.get(cesc("#\\/f9e3")).should("not.exist");

    cy.get(cesc("#\\/f10e1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(-3 * Math.PI * 10 ** 5) / 10 ** 5)},0)`,
        );
      });
    cy.get(cesc("#\\/f10e2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(-2 * Math.PI * 10 ** 5) / 10 ** 5)},2)`,
        );
      });
    cy.get(cesc("#\\/f10e3") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(-Math.PI * 10 ** 5) / 10 ** 5)},0)`,
        );
      });
    cy.get(cesc("#\\/f10e4") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(`(0,2)`);
      });
    cy.get(cesc("#\\/f10e5")).should("not.exist");

    cy.get(cesc("#\\/f11e1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(-2 * Math.PI * 10 ** 5) / 10 ** 5)},3)`,
        );
      });
    cy.get(cesc("#\\/f11e2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(-Math.PI * 10 ** 5) / 10 ** 5)},5)`,
        );
      });
    cy.get(cesc("#\\/f11e3") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(`(0,3)`);
      });
    cy.get(cesc("#\\/f11e4")).should("not.exist");

    cy.get(cesc("#\\/f12e1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(-3 * Math.PI * 10 ** 5) / 10 ** 5)},6)`,
        );
      });
    cy.get(cesc("#\\/f12e2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(-2 * Math.PI * 10 ** 5) / 10 ** 5)},4)`,
        );
      });
    cy.get(cesc("#\\/f12e3") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(-Math.PI * 10 ** 5) / 10 ** 5)},6)`,
        );
      });
    cy.get(cesc("#\\/f12e4")).should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let f1 = stateVariables["/f1"];
      let f2 = stateVariables["/f2"];
      let f3 = stateVariables["/f3"];
      let f4 = stateVariables["/f4"];
      expect(f1.stateValues.numMaxima).eq(1);
      expect(f1.stateValues.numMinima).eq(1);
      expect(f1.stateValues.numExtrema).eq(2);
      expect(f1.stateValues.minima[0][0]).closeTo(Math.PI, 1e-6);
      expect(f1.stateValues.minima[0][1]).eq(-1);
      expect(f1.stateValues.maxima[0][0]).closeTo(0, 1e-6);
      expect(f1.stateValues.maxima[0][1]).eq(1);
      expect(f1.stateValues.extrema[0][0]).closeTo(0, 1e-6);
      expect(f1.stateValues.extrema[0][1]).eq(1);
      expect(f1.stateValues.extrema[1][0]).closeTo(Math.PI, 1e-6);
      expect(f1.stateValues.extrema[1][1]).eq(-1);

      expect(f2.stateValues.numMaxima).eq(2);
      expect(f2.stateValues.numMinima).eq(2);
      expect(f2.stateValues.numExtrema).eq(4);
      expect(f2.stateValues.minima[0][0]).closeTo(-Math.PI, 1e-6);
      expect(f2.stateValues.minima[0][1]).eq(0);
      expect(f2.stateValues.minima[1][0]).closeTo(Math.PI, 1e-6);
      expect(f2.stateValues.minima[1][1]).eq(0);
      expect(f2.stateValues.maxima[0][0]).closeTo(0, 1e-6);
      expect(f2.stateValues.maxima[0][1]).eq(2);
      expect(f2.stateValues.maxima[1][0]).closeTo(2 * Math.PI, 1e-6);
      expect(f2.stateValues.maxima[1][1]).eq(2);
      expect(f2.stateValues.extrema[0][0]).closeTo(-Math.PI, 1e-6);
      expect(f2.stateValues.extrema[0][1]).eq(0);
      expect(f2.stateValues.extrema[1][0]).closeTo(0, 1e-6);
      expect(f2.stateValues.extrema[1][1]).eq(2);
      expect(f2.stateValues.extrema[2][0]).closeTo(Math.PI, 1e-6);
      expect(f2.stateValues.extrema[2][1]).eq(0);
      expect(f2.stateValues.extrema[3][0]).closeTo(2 * Math.PI, 1e-6);
      expect(f2.stateValues.extrema[3][1]).eq(2);

      expect(f3.stateValues.numMaxima).eq(1);
      expect(f3.stateValues.numMinima).eq(2);
      expect(f3.stateValues.numExtrema).eq(3);
      expect(f3.stateValues.minima[0][0]).closeTo(-0.5 * Math.PI, 1e-6);
      expect(f3.stateValues.minima[0][1]).eq(1);
      expect(f3.stateValues.minima[1][0]).closeTo(1.5 * Math.PI, 1e-6);
      expect(f3.stateValues.minima[1][1]).eq(1);
      expect(f3.stateValues.maxima[0][0]).closeTo(0.5 * Math.PI, 1e-6);
      expect(f3.stateValues.maxima[0][1]).eq(3);
      expect(f3.stateValues.extrema[0][0]).closeTo(-0.5 * Math.PI, 1e-6);
      expect(f3.stateValues.extrema[0][1]).eq(1);
      expect(f3.stateValues.extrema[1][0]).closeTo(0.5 * Math.PI, 1e-6);
      expect(f3.stateValues.extrema[1][1]).eq(3);
      expect(f3.stateValues.extrema[2][0]).closeTo(1.5 * Math.PI, 1e-6);
      expect(f3.stateValues.extrema[2][1]).eq(1);

      expect(f4.stateValues.numMaxima).eq(2);
      expect(f4.stateValues.numMinima).eq(1);
      expect(f4.stateValues.numExtrema).eq(3);
      expect(f4.stateValues.minima[0][0]).closeTo(-0.5 * Math.PI, 1e-6);
      expect(f4.stateValues.minima[0][1]).eq(2);
      expect(f4.stateValues.maxima[0][0]).closeTo(-1.5 * Math.PI, 1e-6);
      expect(f4.stateValues.maxima[0][1]).eq(4);
      expect(f4.stateValues.maxima[1][0]).closeTo(0.5 * Math.PI, 1e-6);
      expect(f4.stateValues.maxima[1][1]).eq(4);
      expect(f4.stateValues.extrema[0][0]).closeTo(-1.5 * Math.PI, 1e-6);
      expect(f4.stateValues.extrema[0][1]).eq(4);
      expect(f4.stateValues.extrema[1][0]).closeTo(-0.5 * Math.PI, 1e-6);
      expect(f4.stateValues.extrema[1][1]).eq(2);
      expect(f4.stateValues.extrema[2][0]).closeTo(0.5 * Math.PI, 1e-6);
      expect(f4.stateValues.extrema[2][1]).eq(4);

      let f1a = stateVariables["/f1a"];
      let f2a = stateVariables["/f2a"];
      let f3a = stateVariables["/f3a"];
      let f4a = stateVariables["/f4a"];
      expect(f1a.stateValues.numMaxima).eq(1);
      expect(f1a.stateValues.numMinima).eq(1);
      expect(f1a.stateValues.numExtrema).eq(2);
      expect(f1a.stateValues.minima[0][0]).closeTo(Math.PI, 1e-6);
      expect(f1a.stateValues.minima[0][1]).eq(-1);
      expect(f1a.stateValues.maxima[0][0]).closeTo(0, 1e-6);
      expect(f1a.stateValues.maxima[0][1]).eq(1);
      expect(f1a.stateValues.extrema[0][0]).closeTo(0, 1e-6);
      expect(f1a.stateValues.extrema[0][1]).eq(1);
      expect(f1a.stateValues.extrema[1][0]).closeTo(Math.PI, 1e-6);
      expect(f1a.stateValues.extrema[1][1]).eq(-1);

      expect(f3a.stateValues.numMaxima).eq(1);
      expect(f3a.stateValues.numMinima).eq(2);
      expect(f3a.stateValues.numExtrema).eq(3);
      expect(f3a.stateValues.minima[0][0]).closeTo(-0.5 * Math.PI, 1e-6);
      expect(f3a.stateValues.minima[0][1]).eq(1);
      expect(f3a.stateValues.minima[1][0]).closeTo(1.5 * Math.PI, 1e-6);
      expect(f3a.stateValues.minima[1][1]).eq(1);
      expect(f3a.stateValues.maxima[0][0]).closeTo(0.5 * Math.PI, 1e-6);
      expect(f3a.stateValues.maxima[0][1]).eq(3);
      expect(f3a.stateValues.extrema[0][0]).closeTo(-0.5 * Math.PI, 1e-6);
      expect(f3a.stateValues.extrema[0][1]).eq(1);
      expect(f3a.stateValues.extrema[1][0]).closeTo(0.5 * Math.PI, 1e-6);
      expect(f3a.stateValues.extrema[1][1]).eq(3);
      expect(f3a.stateValues.extrema[2][0]).closeTo(1.5 * Math.PI, 1e-6);
      expect(f3a.stateValues.extrema[2][1]).eq(1);

      expect(f4a.stateValues.numMaxima).eq(2);
      expect(f4a.stateValues.numMinima).eq(1);
      expect(f4a.stateValues.numExtrema).eq(3);
      expect(f4a.stateValues.minima[0][0]).closeTo(-0.5 * Math.PI, 1e-6);
      expect(f4a.stateValues.minima[0][1]).eq(2);
      expect(f4a.stateValues.maxima[0][0]).closeTo(-1.5 * Math.PI, 1e-6);
      expect(f4a.stateValues.maxima[0][1]).eq(4);
      expect(f4a.stateValues.maxima[1][0]).closeTo(0.5 * Math.PI, 1e-6);
      expect(f4a.stateValues.maxima[1][1]).eq(4);
      expect(f4a.stateValues.extrema[0][0]).closeTo(-1.5 * Math.PI, 1e-6);
      expect(f4a.stateValues.extrema[0][1]).eq(4);
      expect(f4a.stateValues.extrema[1][0]).closeTo(-0.5 * Math.PI, 1e-6);
      expect(f4a.stateValues.extrema[1][1]).eq(2);
      expect(f4a.stateValues.extrema[2][0]).closeTo(0.5 * Math.PI, 1e-6);
      expect(f4a.stateValues.extrema[2][1]).eq(4);

      let f5 = stateVariables["/f5"];
      let f6 = stateVariables["/f6"];
      let f7 = stateVariables["/f7"];
      let f8 = stateVariables["/f8"];
      expect(f5.stateValues.numMaxima).eq(1);
      expect(f5.stateValues.numMinima).eq(1);
      expect(f5.stateValues.numExtrema).eq(2);
      expect(f5.stateValues.minima[0][0]).closeTo(Math.PI, 1e-6);
      expect(f5.stateValues.minima[0][1]).eq(-1);
      expect(f5.stateValues.maxima[0][0]).closeTo(2 * Math.PI, 1e-6);
      expect(f5.stateValues.maxima[0][1]).eq(1);
      expect(f5.stateValues.extrema[0][0]).closeTo(Math.PI, 1e-6);
      expect(f5.stateValues.extrema[0][1]).eq(-1);
      expect(f5.stateValues.extrema[1][0]).closeTo(2 * Math.PI, 1e-6);
      expect(f5.stateValues.extrema[1][1]).eq(1);

      expect(f6.stateValues.numMaxima).eq(2);
      expect(f6.stateValues.numMinima).eq(2);
      expect(f6.stateValues.numExtrema).eq(4);
      expect(f6.stateValues.minima[0][0]).closeTo(Math.PI, 1e-6);
      expect(f6.stateValues.minima[0][1]).eq(0);
      expect(f6.stateValues.minima[1][0]).closeTo(3 * Math.PI, 1e-6);
      expect(f6.stateValues.minima[1][1]).eq(0);
      expect(f6.stateValues.maxima[0][0]).closeTo(0, 1e-6);
      expect(f6.stateValues.maxima[0][1]).eq(2);
      expect(f6.stateValues.maxima[1][0]).closeTo(2 * Math.PI, 1e-6);
      expect(f6.stateValues.maxima[1][1]).eq(2);
      expect(f6.stateValues.extrema[0][0]).closeTo(0, 1e-6);
      expect(f6.stateValues.extrema[0][1]).eq(2);
      expect(f6.stateValues.extrema[1][0]).closeTo(Math.PI, 1e-6);
      expect(f6.stateValues.extrema[1][1]).eq(0);
      expect(f6.stateValues.extrema[2][0]).closeTo(2 * Math.PI, 1e-6);
      expect(f6.stateValues.extrema[2][1]).eq(2);
      expect(f6.stateValues.extrema[3][0]).closeTo(3 * Math.PI, 1e-6);
      expect(f6.stateValues.extrema[3][1]).eq(0);

      expect(f7.stateValues.numMaxima).eq(2);
      expect(f7.stateValues.numMinima).eq(1);
      expect(f7.stateValues.numExtrema).eq(3);
      expect(f7.stateValues.minima[0][0]).closeTo(2 * Math.PI, 1e-6);
      expect(f7.stateValues.minima[0][1]).eq(3);
      expect(f7.stateValues.maxima[0][0]).closeTo(Math.PI, 1e-6);
      expect(f7.stateValues.maxima[0][1]).eq(5);
      expect(f7.stateValues.maxima[1][0]).closeTo(3 * Math.PI, 1e-6);
      expect(f7.stateValues.maxima[1][1]).eq(5);
      expect(f7.stateValues.extrema[0][0]).closeTo(Math.PI, 1e-6);
      expect(f7.stateValues.extrema[0][1]).eq(5);
      expect(f7.stateValues.extrema[1][0]).closeTo(2 * Math.PI, 1e-6);
      expect(f7.stateValues.extrema[1][1]).eq(3);
      expect(f7.stateValues.extrema[2][0]).closeTo(3 * Math.PI, 1e-6);
      expect(f7.stateValues.extrema[2][1]).eq(5);

      expect(f8.stateValues.numMaxima).eq(1);
      expect(f8.stateValues.numMinima).eq(2);
      expect(f8.stateValues.numExtrema).eq(3);
      expect(f8.stateValues.minima[0][0]).closeTo(0, 1e-6);
      expect(f8.stateValues.minima[0][1]).eq(4);
      expect(f8.stateValues.minima[1][0]).closeTo(2 * Math.PI, 1e-6);
      expect(f8.stateValues.minima[1][1]).eq(4);
      expect(f8.stateValues.maxima[0][0]).closeTo(Math.PI, 1e-6);
      expect(f8.stateValues.maxima[0][1]).eq(6);
      expect(f8.stateValues.extrema[0][0]).closeTo(0, 1e-6);
      expect(f8.stateValues.extrema[0][1]).eq(4);
      expect(f8.stateValues.extrema[1][0]).closeTo(Math.PI, 1e-6);
      expect(f8.stateValues.extrema[1][1]).eq(6);
      expect(f8.stateValues.extrema[2][0]).closeTo(2 * Math.PI, 1e-6);
      expect(f8.stateValues.extrema[2][1]).eq(4);

      let f9 = stateVariables["/f9"];
      let f10 = stateVariables["/f10"];
      let f11 = stateVariables["/f11"];
      let f12 = stateVariables["/f12"];
      expect(f9.stateValues.numMaxima).eq(1);
      expect(f9.stateValues.numMinima).eq(1);
      expect(f9.stateValues.numExtrema).eq(2);
      expect(f9.stateValues.minima[0][0]).closeTo(-Math.PI, 1e-6);
      expect(f9.stateValues.minima[0][1]).eq(-1);
      expect(f9.stateValues.maxima[0][0]).closeTo(-2 * Math.PI, 1e-6);
      expect(f9.stateValues.maxima[0][1]).eq(1);
      expect(f9.stateValues.extrema[0][0]).closeTo(-2 * Math.PI, 1e-6);
      expect(f9.stateValues.extrema[0][1]).eq(1);
      expect(f9.stateValues.extrema[1][0]).closeTo(-Math.PI, 1e-6);
      expect(f9.stateValues.extrema[1][1]).eq(-1);

      expect(f10.stateValues.numMaxima).eq(2);
      expect(f10.stateValues.numMinima).eq(2);
      expect(f10.stateValues.numExtrema).eq(4);
      expect(f10.stateValues.minima[0][0]).closeTo(-3 * Math.PI, 1e-6);
      expect(f10.stateValues.minima[0][1]).eq(0);
      expect(f10.stateValues.minima[1][0]).closeTo(-Math.PI, 1e-6);
      expect(f10.stateValues.minima[1][1]).eq(0);
      expect(f10.stateValues.maxima[0][0]).closeTo(-2 * Math.PI, 1e-6);
      expect(f10.stateValues.maxima[0][1]).eq(2);
      expect(f10.stateValues.maxima[1][0]).closeTo(0, 1e-6);
      expect(f10.stateValues.maxima[1][1]).eq(2);
      expect(f10.stateValues.extrema[0][0]).closeTo(-3 * Math.PI, 1e-6);
      expect(f10.stateValues.extrema[0][1]).eq(0);
      expect(f10.stateValues.extrema[1][0]).closeTo(-2 * Math.PI, 1e-6);
      expect(f10.stateValues.extrema[1][1]).eq(2);
      expect(f10.stateValues.extrema[2][0]).closeTo(-Math.PI, 1e-6);
      expect(f10.stateValues.extrema[2][1]).eq(0);
      expect(f10.stateValues.extrema[3][0]).closeTo(0, 1e-6);
      expect(f10.stateValues.extrema[3][1]).eq(2);

      expect(f11.stateValues.numMaxima).eq(1);
      expect(f11.stateValues.numMinima).eq(2);
      expect(f11.stateValues.numExtrema).eq(3);
      expect(f11.stateValues.minima[0][0]).closeTo(-2 * Math.PI, 1e-6);
      expect(f11.stateValues.minima[0][1]).eq(3);
      expect(f11.stateValues.minima[1][0]).closeTo(0, 1e-6);
      expect(f11.stateValues.minima[1][1]).eq(3);
      expect(f11.stateValues.maxima[0][0]).closeTo(-Math.PI, 1e-6);
      expect(f11.stateValues.maxima[0][1]).eq(5);
      expect(f11.stateValues.extrema[0][0]).closeTo(-2 * Math.PI, 1e-6);
      expect(f11.stateValues.extrema[0][1]).eq(3);
      expect(f11.stateValues.extrema[1][0]).closeTo(-Math.PI, 1e-6);
      expect(f11.stateValues.extrema[1][1]).eq(5);
      expect(f11.stateValues.extrema[2][0]).closeTo(0, 1e-6);
      expect(f11.stateValues.extrema[2][1]).eq(3);

      expect(f12.stateValues.numMaxima).eq(2);
      expect(f12.stateValues.numMinima).eq(1);
      expect(f12.stateValues.numExtrema).eq(3);
      expect(f12.stateValues.minima[0][0]).closeTo(-2 * Math.PI, 1e-6);
      expect(f12.stateValues.minima[0][1]).eq(4);
      expect(f12.stateValues.maxima[0][0]).closeTo(-3 * Math.PI, 1e-6);
      expect(f12.stateValues.maxima[0][1]).eq(6);
      expect(f12.stateValues.maxima[1][0]).closeTo(-Math.PI, 1e-6);
      expect(f12.stateValues.maxima[1][1]).eq(6);
      expect(f12.stateValues.extrema[0][0]).closeTo(-3 * Math.PI, 1e-6);
      expect(f12.stateValues.extrema[0][1]).eq(6);
      expect(f12.stateValues.extrema[1][0]).closeTo(-2 * Math.PI, 1e-6);
      expect(f12.stateValues.extrema[1][1]).eq(4);
      expect(f12.stateValues.extrema[2][0]).closeTo(-Math.PI, 1e-6);
      expect(f12.stateValues.extrema[2][1]).eq(6);
    });
  });

  it("extrema at domain endpoints, interpolated function", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
      <function name="f1" domain="(-sqrt(2),sqrt(10))" maxima="(-sqrt(2),sqrt(3))" minima="(sqrt(10), sqrt(11))" displayDecimals="5"/>
      <function name="f2" domain="[-sqrt(2),sqrt(10)]" maxima="(-sqrt(2),sqrt(3)+1)" minima="(sqrt(10), sqrt(11)+1)" displayDecimals="5"/>
      <function name="f3" domain="[-sqrt(2)+10^(-12),sqrt(10)-10^(-12)]" maxima="(-sqrt(2),sqrt(3)+2)" minima="(sqrt(10), sqrt(11)+2)" displayDecimals="5"/>
    </graph>
    <p><copy prop="extrema" target="f1" assignNames="f1e1 f1e2 f1e3" /></p>
    <p><copy prop="extrema" target="f2" assignNames="f2e1 f2e2 f2e3 f2e4 f2e5" /></p>
    <p><copy prop="extrema" target="f3" assignNames="f3e1 f3e2 f3e3" /></p>

    <graph>
      <function name="f4" domain="(0,sqrt(10))" maxima="(0,sqrt(3))" minima="(sqrt(10), sqrt(11))" displayDecimals="5"/>
      <function name="f5" domain="[0,sqrt(10)]" maxima="(0,sqrt(3)+1)" minima="(sqrt(10), sqrt(11)+1)" displayDecimals="5"/>
      <function name="f6" domain="[0+10^(-12),sqrt(10)-10^(-12)]" maxima="(0,sqrt(3)+2)" minima="(sqrt(10), sqrt(11)+2)" displayDecimals="5"/>
    </graph>
    <p><copy prop="extrema" target="f4" assignNames="f4e1 f4e2 f4e3" /></p>
    <p><copy prop="extrema" target="f5" assignNames="f5e1 f5e2 f5e3 f5e4 f5e5" /></p>
    <p><copy prop="extrema" target="f6" assignNames="f6e1 f6e2 f6e3" /></p>

    <graph>
      <function name="f7" domain="(-sqrt(2),0)" maxima="(-sqrt(2),sqrt(3))" minima="(0, sqrt(11))" displayDecimals="5"/>
      <function name="f8" domain="[-sqrt(2),0]" maxima="(-sqrt(2),sqrt(3)+1)" minima="(0, sqrt(11)+1)" displayDecimals="5"/>
      <function name="f9" domain="[-sqrt(2)+10^(-12),0-10^(-12)]" maxima="(-sqrt(2),sqrt(3)+2)" minima="(0, sqrt(11)+2)" displayDecimals="5"/>
    </graph>
    <p><copy prop="extrema" target="f7" assignNames="f7e1 f7e2 f7e3" /></p>
    <p><copy prop="extrema" target="f8" assignNames="f8e1 f8e2 f8e3 f8e4 f8e5" /></p>
    <p><copy prop="extrema" target="f9" assignNames="f9e1 f9e2 f9e3" /></p>

    `,
        },
        "*",
      );
    });

    let extremax1 = [0, 1 / 3, 2 / 3, 1].map(
      (a) => -Math.sqrt(2) * (1 - a) + Math.sqrt(10) * a,
    );
    let extremax2 = [0, 1 / 3, 2 / 3, 1].map((a) => Math.sqrt(10) * a);
    let extremax3 = [0, 1 / 3, 2 / 3, 1].map((a) => -Math.sqrt(2) * (1 - a));

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/f1e1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(extremax1[1] * 10 ** 5) / 10 ** 5)},${nInDOM(
            Math.round((Math.sqrt(3) - 1) * 10 ** 5) / 10 ** 5,
          )})`,
        );
      });
    cy.get(cesc("#\\/f1e2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(extremax1[2] * 10 ** 5) / 10 ** 5)},${nInDOM(
            Math.round((Math.sqrt(11) + 1) * 10 ** 5) / 10 ** 5,
          )})`,
        );
      });
    cy.get(cesc("#\\/f1e3")).should("not.exist");

    cy.get(cesc("#\\/f2e1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(extremax1[0] * 10 ** 5) / 10 ** 5)},${nInDOM(
            Math.round((Math.sqrt(3) + 1) * 10 ** 5) / 10 ** 5,
          )})`,
        );
      });
    cy.get(cesc("#\\/f2e2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(extremax1[1] * 10 ** 5) / 10 ** 5)},${nInDOM(
            Math.round(Math.sqrt(3) * 10 ** 5) / 10 ** 5,
          )})`,
        );
      });
    cy.get(cesc("#\\/f2e3") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(extremax1[2] * 10 ** 5) / 10 ** 5)},${nInDOM(
            Math.round((Math.sqrt(11) + 2) * 10 ** 5) / 10 ** 5,
          )})`,
        );
      });
    cy.get(cesc("#\\/f2e4") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(extremax1[3] * 10 ** 5) / 10 ** 5)},${nInDOM(
            Math.round((Math.sqrt(11) + 1) * 10 ** 5) / 10 ** 5,
          )})`,
        );
      });
    cy.get(cesc("#\\/f2e5")).should("not.exist");

    cy.get(cesc("#\\/f3e1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(extremax1[1] * 10 ** 5) / 10 ** 5)},${nInDOM(
            Math.round((Math.sqrt(3) + 1) * 10 ** 5) / 10 ** 5,
          )})`,
        );
      });
    cy.get(cesc("#\\/f3e2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(extremax1[2] * 10 ** 5) / 10 ** 5)},${nInDOM(
            Math.round((Math.sqrt(11) + 3) * 10 ** 5) / 10 ** 5,
          )})`,
        );
      });
    cy.get(cesc("#\\/f3e3")).should("not.exist");

    cy.get(cesc("#\\/f4e1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(extremax2[1] * 10 ** 5) / 10 ** 5)},${nInDOM(
            Math.round((Math.sqrt(3) - 1) * 10 ** 5) / 10 ** 5,
          )})`,
        );
      });
    cy.get(cesc("#\\/f4e2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(extremax2[2] * 10 ** 5) / 10 ** 5)},${nInDOM(
            Math.round((Math.sqrt(11) + 1) * 10 ** 5) / 10 ** 5,
          )})`,
        );
      });
    cy.get(cesc("#\\/f4e3")).should("not.exist");

    cy.get(cesc("#\\/f5e1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(extremax2[0] * 10 ** 5) / 10 ** 5)},${nInDOM(
            Math.round((Math.sqrt(3) + 1) * 10 ** 5) / 10 ** 5,
          )})`,
        );
      });
    cy.get(cesc("#\\/f5e2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(extremax2[1] * 10 ** 5) / 10 ** 5)},${nInDOM(
            Math.round(Math.sqrt(3) * 10 ** 5) / 10 ** 5,
          )})`,
        );
      });
    cy.get(cesc("#\\/f5e3") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(extremax2[2] * 10 ** 5) / 10 ** 5)},${nInDOM(
            Math.round((Math.sqrt(11) + 2) * 10 ** 5) / 10 ** 5,
          )})`,
        );
      });
    cy.get(cesc("#\\/f5e4") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(extremax2[3] * 10 ** 5) / 10 ** 5)},${nInDOM(
            Math.round((Math.sqrt(11) + 1) * 10 ** 5) / 10 ** 5,
          )})`,
        );
      });
    cy.get(cesc("#\\/f5e5")).should("not.exist");

    cy.get(cesc("#\\/f6e1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(extremax2[1] * 10 ** 5) / 10 ** 5)},${nInDOM(
            Math.round((Math.sqrt(3) + 1) * 10 ** 5) / 10 ** 5,
          )})`,
        );
      });
    cy.get(cesc("#\\/f6e2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(extremax2[2] * 10 ** 5) / 10 ** 5)},${nInDOM(
            Math.round((Math.sqrt(11) + 3) * 10 ** 5) / 10 ** 5,
          )})`,
        );
      });
    cy.get(cesc("#\\/f6e3")).should("not.exist");

    cy.get(cesc("#\\/f7e1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(extremax3[1] * 10 ** 5) / 10 ** 5)},${nInDOM(
            Math.round((Math.sqrt(3) - 1) * 10 ** 5) / 10 ** 5,
          )})`,
        );
      });
    cy.get(cesc("#\\/f7e2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(extremax3[2] * 10 ** 5) / 10 ** 5)},${nInDOM(
            Math.round((Math.sqrt(11) + 1) * 10 ** 5) / 10 ** 5,
          )})`,
        );
      });
    cy.get(cesc("#\\/f7e3")).should("not.exist");

    cy.get(cesc("#\\/f8e1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(extremax3[0] * 10 ** 5) / 10 ** 5)},${nInDOM(
            Math.round((Math.sqrt(3) + 1) * 10 ** 5) / 10 ** 5,
          )})`,
        );
      });
    cy.get(cesc("#\\/f8e2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(extremax3[1] * 10 ** 5) / 10 ** 5)},${nInDOM(
            Math.round(Math.sqrt(3) * 10 ** 5) / 10 ** 5,
          )})`,
        );
      });
    cy.get(cesc("#\\/f8e3") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(extremax3[2] * 10 ** 5) / 10 ** 5)},${nInDOM(
            Math.round((Math.sqrt(11) + 2) * 10 ** 5) / 10 ** 5,
          )})`,
        );
      });
    cy.get(cesc("#\\/f8e4") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(extremax3[3] * 10 ** 5) / 10 ** 5)},${nInDOM(
            Math.round((Math.sqrt(11) + 1) * 10 ** 5) / 10 ** 5,
          )})`,
        );
      });
    cy.get(cesc("#\\/f8e5")).should("not.exist");

    cy.get(cesc("#\\/f9e1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(extremax3[1] * 10 ** 5) / 10 ** 5)},${nInDOM(
            Math.round((Math.sqrt(3) + 1) * 10 ** 5) / 10 ** 5,
          )})`,
        );
      });
    cy.get(cesc("#\\/f9e2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq(
          `(${nInDOM(Math.round(extremax3[2] * 10 ** 5) / 10 ** 5)},${nInDOM(
            Math.round((Math.sqrt(11) + 3) * 10 ** 5) / 10 ** 5,
          )})`,
        );
      });
    cy.get(cesc("#\\/f9e3")).should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let f1 = stateVariables["/f1"];
      let f2 = stateVariables["/f2"];
      let f3 = stateVariables["/f3"];
      expect(f1.stateValues.numMaxima).eq(1);
      expect(f1.stateValues.numMinima).eq(1);
      expect(f1.stateValues.numExtrema).eq(2);
      expect(f1.stateValues.minima[0][0]).closeTo(extremax1[1], 1e-12);
      expect(f1.stateValues.minima[0][1]).closeTo(Math.sqrt(3) - 1, 1e-12);
      expect(f1.stateValues.maxima[0][0]).closeTo(extremax1[2], 1e-12);
      expect(f1.stateValues.maxima[0][1]).closeTo(Math.sqrt(11) + 1, 1e-12);
      expect(f1.stateValues.extrema[0][0]).closeTo(extremax1[1], 1e-12);
      expect(f1.stateValues.extrema[0][1]).closeTo(Math.sqrt(3) - 1, 1e-12);
      expect(f1.stateValues.extrema[1][0]).closeTo(extremax1[2], 1e-12);
      expect(f1.stateValues.extrema[1][1]).closeTo(Math.sqrt(11) + 1, 1e-12);

      expect(f2.stateValues.numMaxima).eq(2);
      expect(f2.stateValues.numMinima).eq(2);
      expect(f2.stateValues.numExtrema).eq(4);
      expect(f2.stateValues.minima[0][0]).closeTo(extremax1[1], 1e-12);
      expect(f2.stateValues.minima[0][1]).closeTo(Math.sqrt(3), 1e-12);
      expect(f2.stateValues.minima[1][0]).closeTo(extremax1[3], 1e-12);
      expect(f2.stateValues.minima[1][1]).closeTo(Math.sqrt(11) + 1, 1e-12);
      expect(f2.stateValues.maxima[0][0]).closeTo(extremax1[0], 1e-12);
      expect(f2.stateValues.maxima[0][1]).closeTo(Math.sqrt(3) + 1, 1e-12);
      expect(f2.stateValues.maxima[1][0]).closeTo(extremax1[2], 1e-12);
      expect(f2.stateValues.maxima[1][1]).closeTo(Math.sqrt(11) + 2, 1e-12);
      expect(f2.stateValues.extrema[0][0]).closeTo(extremax1[0], 1e-12);
      expect(f2.stateValues.extrema[0][1]).closeTo(Math.sqrt(3) + 1, 1e-12);
      expect(f2.stateValues.extrema[1][0]).closeTo(extremax1[1], 1e-12);
      expect(f2.stateValues.extrema[1][1]).closeTo(Math.sqrt(3), 1e-12);
      expect(f2.stateValues.extrema[2][0]).closeTo(extremax1[2], 1e-12);
      expect(f2.stateValues.extrema[2][1]).closeTo(Math.sqrt(11) + 2, 1e-12);
      expect(f2.stateValues.extrema[3][0]).closeTo(extremax1[3], 1e-12);
      expect(f2.stateValues.extrema[3][1]).closeTo(Math.sqrt(11) + 1, 1e-12);

      expect(f3.stateValues.numMaxima).eq(1);
      expect(f3.stateValues.numMinima).eq(1);
      expect(f3.stateValues.numExtrema).eq(2);
      expect(f3.stateValues.minima[0][0]).closeTo(extremax1[1], 1e-12);
      expect(f3.stateValues.minima[0][1]).closeTo(Math.sqrt(3) + 1, 1e-12);
      expect(f3.stateValues.maxima[0][0]).closeTo(extremax1[2], 1e-12);
      expect(f3.stateValues.maxima[0][1]).closeTo(Math.sqrt(11) + 3, 1e-12);
      expect(f3.stateValues.extrema[0][0]).closeTo(extremax1[1], 1e-12);
      expect(f3.stateValues.extrema[0][1]).closeTo(Math.sqrt(3) + 1, 1e-12);
      expect(f3.stateValues.extrema[1][0]).closeTo(extremax1[2], 1e-12);
      expect(f3.stateValues.extrema[1][1]).closeTo(Math.sqrt(11) + 3, 1e-12);

      let f4 = stateVariables["/f4"];
      let f5 = stateVariables["/f5"];
      let f6 = stateVariables["/f6"];
      expect(f4.stateValues.numMaxima).eq(1);
      expect(f4.stateValues.numMinima).eq(1);
      expect(f4.stateValues.numExtrema).eq(2);
      expect(f4.stateValues.minima[0][0]).closeTo(extremax2[1], 1e-12);
      expect(f4.stateValues.minima[0][1]).closeTo(Math.sqrt(3) - 1, 1e-12);
      expect(f4.stateValues.maxima[0][0]).closeTo(extremax2[2], 1e-12);
      expect(f4.stateValues.maxima[0][1]).closeTo(Math.sqrt(11) + 1, 1e-12);
      expect(f4.stateValues.extrema[0][0]).closeTo(extremax2[1], 1e-12);
      expect(f4.stateValues.extrema[0][1]).closeTo(Math.sqrt(3) - 1, 1e-12);
      expect(f4.stateValues.extrema[1][0]).closeTo(extremax2[2], 1e-12);
      expect(f4.stateValues.extrema[1][1]).closeTo(Math.sqrt(11) + 1, 1e-12);

      expect(f5.stateValues.numMaxima).eq(2);
      expect(f5.stateValues.numMinima).eq(2);
      expect(f5.stateValues.numExtrema).eq(4);
      expect(f5.stateValues.minima[0][0]).closeTo(extremax2[1], 1e-12);
      expect(f5.stateValues.minima[0][1]).closeTo(Math.sqrt(3), 1e-12);
      expect(f5.stateValues.minima[1][0]).closeTo(extremax2[3], 1e-12);
      expect(f5.stateValues.minima[1][1]).closeTo(Math.sqrt(11) + 1, 1e-12);
      expect(f5.stateValues.maxima[0][0]).closeTo(extremax2[0], 1e-12);
      expect(f5.stateValues.maxima[0][1]).closeTo(Math.sqrt(3) + 1, 1e-12);
      expect(f5.stateValues.maxima[1][0]).closeTo(extremax2[2], 1e-12);
      expect(f5.stateValues.maxima[1][1]).closeTo(Math.sqrt(11) + 2, 1e-12);
      expect(f5.stateValues.extrema[0][0]).closeTo(extremax2[0], 1e-12);
      expect(f5.stateValues.extrema[0][1]).closeTo(Math.sqrt(3) + 1, 1e-12);
      expect(f5.stateValues.extrema[1][0]).closeTo(extremax2[1], 1e-12);
      expect(f5.stateValues.extrema[1][1]).closeTo(Math.sqrt(3), 1e-12);
      expect(f5.stateValues.extrema[2][0]).closeTo(extremax2[2], 1e-12);
      expect(f5.stateValues.extrema[2][1]).closeTo(Math.sqrt(11) + 2, 1e-12);
      expect(f5.stateValues.extrema[3][0]).closeTo(extremax2[3], 1e-12);
      expect(f5.stateValues.extrema[3][1]).closeTo(Math.sqrt(11) + 1, 1e-12);

      expect(f6.stateValues.numMaxima).eq(1);
      expect(f6.stateValues.numMinima).eq(1);
      expect(f6.stateValues.numExtrema).eq(2);
      expect(f6.stateValues.minima[0][0]).closeTo(extremax2[1], 1e-12);
      expect(f6.stateValues.minima[0][1]).closeTo(Math.sqrt(3) + 1, 1e-12);
      expect(f6.stateValues.maxima[0][0]).closeTo(extremax2[2], 1e-12);
      expect(f6.stateValues.maxima[0][1]).closeTo(Math.sqrt(11) + 3, 1e-12);
      expect(f6.stateValues.extrema[0][0]).closeTo(extremax2[1], 1e-12);
      expect(f6.stateValues.extrema[0][1]).closeTo(Math.sqrt(3) + 1, 1e-12);
      expect(f6.stateValues.extrema[1][0]).closeTo(extremax2[2], 1e-12);
      expect(f6.stateValues.extrema[1][1]).closeTo(Math.sqrt(11) + 3, 1e-12);

      let f7 = stateVariables["/f7"];
      let f8 = stateVariables["/f8"];
      let f9 = stateVariables["/f9"];
      expect(f7.stateValues.numMaxima).eq(1);
      expect(f7.stateValues.numMinima).eq(1);
      expect(f7.stateValues.numExtrema).eq(2);
      expect(f7.stateValues.minima[0][0]).closeTo(extremax3[1], 1e-12);
      expect(f7.stateValues.minima[0][1]).closeTo(Math.sqrt(3) - 1, 1e-12);
      expect(f7.stateValues.maxima[0][0]).closeTo(extremax3[2], 1e-12);
      expect(f7.stateValues.maxima[0][1]).closeTo(Math.sqrt(11) + 1, 1e-12);
      expect(f7.stateValues.extrema[0][0]).closeTo(extremax3[1], 1e-12);
      expect(f7.stateValues.extrema[0][1]).closeTo(Math.sqrt(3) - 1, 1e-12);
      expect(f7.stateValues.extrema[1][0]).closeTo(extremax3[2], 1e-12);
      expect(f7.stateValues.extrema[1][1]).closeTo(Math.sqrt(11) + 1, 1e-12);

      expect(f8.stateValues.numMaxima).eq(2);
      expect(f8.stateValues.numMinima).eq(2);
      expect(f8.stateValues.numExtrema).eq(4);
      expect(f8.stateValues.minima[0][0]).closeTo(extremax3[1], 1e-12);
      expect(f8.stateValues.minima[0][1]).closeTo(Math.sqrt(3), 1e-12);
      expect(f8.stateValues.minima[1][0]).closeTo(extremax3[3], 1e-12);
      expect(f8.stateValues.minima[1][1]).closeTo(Math.sqrt(11) + 1, 1e-12);
      expect(f8.stateValues.maxima[0][0]).closeTo(extremax3[0], 1e-12);
      expect(f8.stateValues.maxima[0][1]).closeTo(Math.sqrt(3) + 1, 1e-12);
      expect(f8.stateValues.maxima[1][0]).closeTo(extremax3[2], 1e-12);
      expect(f8.stateValues.maxima[1][1]).closeTo(Math.sqrt(11) + 2, 1e-12);
      expect(f8.stateValues.extrema[0][0]).closeTo(extremax3[0], 1e-12);
      expect(f8.stateValues.extrema[0][1]).closeTo(Math.sqrt(3) + 1, 1e-12);
      expect(f8.stateValues.extrema[1][0]).closeTo(extremax3[1], 1e-12);
      expect(f8.stateValues.extrema[1][1]).closeTo(Math.sqrt(3), 1e-12);
      expect(f8.stateValues.extrema[2][0]).closeTo(extremax3[2], 1e-12);
      expect(f8.stateValues.extrema[2][1]).closeTo(Math.sqrt(11) + 2, 1e-12);
      expect(f8.stateValues.extrema[3][0]).closeTo(extremax3[3], 1e-12);
      expect(f8.stateValues.extrema[3][1]).closeTo(Math.sqrt(11) + 1, 1e-12);

      expect(f9.stateValues.numMaxima).eq(1);
      expect(f9.stateValues.numMinima).eq(1);
      expect(f9.stateValues.numExtrema).eq(2);
      expect(f9.stateValues.minima[0][0]).closeTo(extremax3[1], 1e-12);
      expect(f9.stateValues.minima[0][1]).closeTo(Math.sqrt(3) + 1, 1e-12);
      expect(f9.stateValues.maxima[0][0]).closeTo(extremax3[2], 1e-12);
      expect(f9.stateValues.maxima[0][1]).closeTo(Math.sqrt(11) + 3, 1e-12);
      expect(f9.stateValues.extrema[0][0]).closeTo(extremax3[1], 1e-12);
      expect(f9.stateValues.extrema[0][1]).closeTo(Math.sqrt(3) + 1, 1e-12);
      expect(f9.stateValues.extrema[1][0]).closeTo(extremax3[2], 1e-12);
      expect(f9.stateValues.extrema[1][1]).closeTo(Math.sqrt(11) + 3, 1e-12);
    });
  });

  it("two functions with mutual dependence", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <point>(1,2)</point>
    <point>(3,4)</point>
    <point>(-5,7)</point>
    <point>(8,-1)</point>
    <function yscale="5" maxima="($_function2.numMaxima,$_function2.numMinima)" through="(-8,5) (9,10)" />
    
    <function yscale="$_function1.yscale" through="$_point1 $_point2 $_point3 $_point4 " maxima="(0, )" />
    </graph>
    
    <p>Number of maxima: <copy prop="numMaxima" assignNames="numMaxima" target="_function2" /></p>
    <p>Number of minima: <copy prop="numMinima" assignNames="numMinima" target="_function2" /></p>
    
    <p><aslist><copy prop="maximumLocations" target="_function1" /></aslist></p>
    <p><aslist><copy prop="maximumValues" target="_function1" /></aslist></p>
    <p><aslist><copy prop="minimumLocations" target="_function1" /></aslist></p>
    <p><aslist><copy prop="minimumValues" target="_function1" /></aslist></p>
    <p><aslist><copy prop="extremumLocations" target="_function1" /></aslist></p>
    <p><aslist><copy prop="extremumValues" target="_function1" /></aslist></p>

    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let f1 = stateVariables["/_function1"];
      let f2 = stateVariables["/_function2"];
      expect(await f1.stateValues.numMaxima).eq(1);
      expect(await f1.stateValues.numMinima).eq(2);
      expect(await f1.stateValues.numExtrema).eq(3);
      expect(await f2.stateValues.numMaxima).eq(2);
      expect(await f2.stateValues.numMinima).eq(1);
      expect(await f2.stateValues.numExtrema).eq(3);

      expect(await f1.stateValues.maximumLocations).eq(2);
      expect(await f1.stateValues.maximumValues).eq(1);

      expect(await f1.stateValues.xscale).eq(1);
      expect(await f1.stateValues.yscale).eq(5);
      expect(await f2.stateValues.xscale).eq(1);
      expect(await f2.stateValues.yscale).eq(5);
    });

    cy.get(cesc("#\\/numMaxima")).should("have.text", "2");
    cy.get(cesc("#\\/numMinima")).should("have.text", "1");

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 2, y: 6 },
      });

      let stateVariables = await win.returnAllStateVariables1();

      let f1 = stateVariables["/_function1"];
      let f2 = stateVariables["/_function2"];
      expect(await f1.stateValues.numMaxima).eq(1);
      expect(await f1.stateValues.numMinima).eq(2);
      expect(await f1.stateValues.numExtrema).eq(3);
      expect(await f2.stateValues.numMaxima).eq(1);
      expect(await f2.stateValues.numMinima).eq(0);
      expect(await f2.stateValues.numExtrema).eq(1);

      expect(await f1.stateValues.maximumLocations).eq(1);
      expect(await f1.stateValues.maximumValues).eq(0);
    });

    cy.get(cesc("#\\/numMaxima")).should("have.text", "1");
    cy.get(cesc("#\\/numMinima")).should("have.text", "0");

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: 3, y: 7 },
      });
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: 9, y: 0 },
      });

      let stateVariables = await win.returnAllStateVariables1();

      let f1 = stateVariables["/_function1"];
      let f2 = stateVariables["/_function2"];
      expect(await f1.stateValues.numMaxima).eq(1);
      expect(await f1.stateValues.numMinima).eq(2);
      expect(await f1.stateValues.numExtrema).eq(3);
      expect(await f2.stateValues.numMaxima).eq(2);
      expect(await f2.stateValues.numMinima).eq(2);
      expect(await f2.stateValues.numExtrema).eq(4);

      expect(await f1.stateValues.maximumLocations).eq(2);
      expect(await f1.stateValues.maximumValues).eq(2);
    });

    cy.get(cesc("#\\/numMaxima")).should("have.text", "2");
    cy.get(cesc("#\\/numMinima")).should("have.text", "2");
  });

  it("shadowed works correctly with initially unresolved", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
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
    
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/_p1")).should("have.text", "NaN");
    cy.get(cesc("#\\/_p2")).should("have.text", "NaN");

    cy.get(cesc("#\\/_function1")).should("contain.text", "＿x3+1");

    cy.get(cesc("#\\/_mathinput1") + " textarea").type("1{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/_mathinput2") + " textarea").type("2{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/_function1")).should("contain.text", "2x3+1");

    cy.get(cesc("#\\/_p1")).should("have.text", "1");
    cy.get(cesc("#\\/_p2")).should("have.text", "1");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      expect(f(-2)).eq(2 * (-2) ** 3 + 1);
    });

    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      "{end}{backspace}3{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/_mathinput2") + " textarea").type(
      "{end}{backspace}4{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/_function1")).should("contain.text", "4x3+1");

    cy.get(cesc("#\\/_p1")).should("have.text", "3");
    cy.get(cesc("#\\/_p2")).should("have.text", "3");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      expect(f(-2)).eq(4 * (-2) ** 3 + 1);
    });
  });

  it("extrema of quartic, copied multiple times", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <mathinput prefill="1" />
    <mathinput prefill="0" />
    <mathinput prefill="-2" />
    
    <function>$_mathinput1 x^4 + $_mathinput2 x^3 +$_mathinput3 x^2 +1</function>
    
    <graph>
      <copy assignNames="f1a" target="_function1" />
      <copy assignNames="maximum1 maximum2 maximum3" prop="maxima" target="_function1" />
      <copy assignNames="minimum1 minimum2 minimum3" prop="minima" target="f1a" />
    </graph>
    <graph>
      <copy assignNames="f1b" target="f1a" />
      <copy assignNames="extremum1" prop="extremum1" target="f1b" />
      <copy assignNames="extremum2" prop="extremum2" target="f1b" />
      <copy assignNames="extremum3" prop="extremum3" target="f1b" />
    </graph>
    
    <copy prop="value" target="_mathinput1" assignNames="m1" />
    <copy prop="value" target="_mathinput2" assignNames="m2" />
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let max1 = stateVariables["/maximum1"].stateValues.coords;
      expect(max1[1]).closeTo(0, 0.00001);
      expect(max1[2]).closeTo(1, 0.00001);
      expect(stateVariables["/maximum2"]).eq(undefined);

      let min1 = stateVariables["/minimum1"].stateValues.coords;
      expect(min1[1]).closeTo(-1, 0.00001);
      expect(min1[2]).closeTo(0, 0.00001);
      let min2 = stateVariables["/minimum2"].stateValues.coords;
      expect(min2[1]).closeTo(1, 0.00001);
      expect(min2[2]).closeTo(0, 0.00001);
      expect(stateVariables["/minimum3"]).eq(undefined);

      expect(stateVariables["/extremum1"].stateValues.coords).eqls(min1);
      expect(stateVariables["/extremum2"].stateValues.coords).eqls(max1);
      expect(stateVariables["/extremum3"].stateValues.coords).eqls(min2);
    });

    cy.get(cesc("#\\/_mathinput2") + " textarea").type(
      "{end}{backspace}2{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/m2")).should("contain.text", "2");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let max1 = stateVariables["/maximum1"].stateValues.coords;
      expect(max1[1]).closeTo(0, 0.00001);
      expect(max1[2]).closeTo(1, 0.00001);
      expect(stateVariables["/maximum2"]).eq(undefined);

      let min1 = stateVariables["/minimum1"].stateValues.coords;
      expect(min1[1]).closeTo(-2, 0.00001);
      expect(min1[2]).closeTo(-7, 0.00001);
      let min2 = stateVariables["/minimum2"].stateValues.coords;
      expect(min2[1]).closeTo(0.5, 0.00001);
      expect(min2[2]).closeTo(13 / 16, 0.00001);
      expect(stateVariables["/minimum3"]).eq(undefined);

      expect(stateVariables["/extremum1"].stateValues.coords).eqls(min1);
      expect(stateVariables["/extremum2"].stateValues.coords).eqls(max1);
      expect(stateVariables["/extremum3"].stateValues.coords).eqls(min2);
    });

    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      "{end}{backspace}-1{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/m1")).should("contain.text", "−1");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let max1 = stateVariables["/maximum1"].stateValues.coords;
      expect(max1[1]).closeTo(0, 0.00001);
      expect(max1[2]).closeTo(1, 0.00001);
      expect(stateVariables["/maximum2"]).eq(undefined);

      expect(stateVariables["/minimum1"]).eq(undefined);

      expect(stateVariables["/extremum1"].stateValues.coords).eqls(max1);
      expect(stateVariables["/extremum2"]).eq(undefined);
      expect(stateVariables["/extremum3"]).eq(undefined);
    });
  });

  it("function of function formula can redefine variable", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <function variables="t" name="f" symbolic simplify="false">st^3</function>

    <function name="f2" symbolic simplify="false"><copy target="f"/></function>
    <function name="f3" variable="s" symbolic simplify="false"><copy target="f.formula"/></function>

    <copy assignNames="f4" target="f"/>
    <copy assignNames="f5" target="f2"/>
    <copy name="f6" target="f3"/>

    <copy prop="variable" target="f" assignNames="fv" />
    <copy prop="variable" target="f2" assignNames="f2v" />
    <copy prop="variable" target="f3" assignNames="f3v" />
    <copy prop="variable" target="f4" assignNames="f4v" />
    <copy prop="variable" target="f5" assignNames="f5v" />
    <copy prop="variable" target="f6" assignNames="f6v" />

    <p name="fOfu">$$f(u)</p>
    <p name="f2Ofu">$$f2(u)</p>
    <p name="f3Ofu">$$f3(u)</p>
    <p name="f4Ofu">$$f4(u)</p>
    <p name="f5Ofu">$$f5(u)</p>
    <p name="f6Ofu">$$f6(u)</p>
    
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/fv"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("t");
      });
    cy.get(cesc("#\\/f2v"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("t");
      });
    cy.get(cesc("#\\/f3v"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("s");
      });
    cy.get(cesc("#\\/f4v"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("t");
      });
    cy.get(cesc("#\\/f5v"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("t");
      });
    cy.get(cesc("#\\/f6v"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("s");
      });
    cy.get(cesc("#\\/fOfu"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("su3");
      });
    cy.get(cesc("#\\/f2Ofu"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("su3");
      });
    cy.get(cesc("#\\/f3Ofu"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("ut3");
      });
    cy.get(cesc("#\\/f4Ofu"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("su3");
      });
    cy.get(cesc("#\\/f5Ofu"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("su3");
      });
    cy.get(cesc("#\\/f6Ofu"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("ut3");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/f"].stateValues.variables[0]).eq("t");
      expect(stateVariables["/f2"].stateValues.variables[0]).eq("t");
      expect(stateVariables["/f3"].stateValues.variables[0]).eq("s");
      expect(stateVariables["/f4"].stateValues.variables[0]).eq("t");
      expect(stateVariables["/f5"].stateValues.variables[0]).eq("t");
      expect(
        stateVariables[stateVariables["/f6"].replacements[0].componentName]
          .stateValues.variables[0],
      ).eq("s");

      expect(stateVariables["/f"].stateValues.formula).eqls([
        "*",
        "s",
        ["^", "t", 3],
      ]);
      expect(stateVariables["/f2"].stateValues.formula).eqls([
        "*",
        "s",
        ["^", "t", 3],
      ]);
      expect(stateVariables["/f3"].stateValues.formula).eqls([
        "*",
        "s",
        ["^", "t", 3],
      ]);
      expect(stateVariables["/f4"].stateValues.formula).eqls([
        "*",
        "s",
        ["^", "t", 3],
      ]);
      expect(stateVariables["/f5"].stateValues.formula).eqls([
        "*",
        "s",
        ["^", "t", 3],
      ]);
      expect(
        stateVariables[stateVariables["/f6"].replacements[0].componentName]
          .stateValues.formula,
      ).eqls(["*", "s", ["^", "t", 3]]);

      expect(
        stateVariables[stateVariables["/fOfu"].activeChildren[0].componentName]
          .stateValues.value,
      ).eqls(["*", "s", ["^", "u", 3]]);
      expect(
        stateVariables[stateVariables["/f2Ofu"].activeChildren[0].componentName]
          .stateValues.value,
      ).eqls(["*", "s", ["^", "u", 3]]);
      expect(
        stateVariables[stateVariables["/f3Ofu"].activeChildren[0].componentName]
          .stateValues.value,
      ).eqls(["*", "u", ["^", "t", 3]]);
      expect(
        stateVariables[stateVariables["/f4Ofu"].activeChildren[0].componentName]
          .stateValues.value,
      ).eqls(["*", "s", ["^", "u", 3]]);
      expect(
        stateVariables[stateVariables["/f5Ofu"].activeChildren[0].componentName]
          .stateValues.value,
      ).eqls(["*", "s", ["^", "u", 3]]);
      expect(
        stateVariables[stateVariables["/f6Ofu"].activeChildren[0].componentName]
          .stateValues.value,
      ).eqls(["*", "u", ["^", "t", 3]]);
    });
  });

  it("function of interpolated function can redefine variable without changing function", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <function minima="(2)" name="f" />

    <function name="f2"><copy target="f"/></function>
    <function name="f3" variables="s"><copy target="f"/></function>

    <copy name="f4" target="f"/>
    <copy name="f5" target="f2"/>
    <copy name="f6" target="f3"/>

    <copy prop="variable" target="f" assignNames="fv" />
    <copy prop="variable" target="f2" assignNames="f2v" />
    <copy prop="variable" target="f3" assignNames="f3v" />
    <copy prop="variable" target="f4" assignNames="f4v" />
    <copy prop="variable" target="f5" assignNames="f5v" />
    <copy prop="variable" target="f6" assignNames="f6v" />

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

    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/fv"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/f2v"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/f3v"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("s");
      });
    cy.get(cesc("#\\/f4v"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/f5v"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/f6v"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("s");
      });
    cy.get(cesc("#\\/fOf0"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("2");
      });
    cy.get(cesc("#\\/f2Of0"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("2");
      });
    cy.get(cesc("#\\/f3Of0"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("2");
      });
    cy.get(cesc("#\\/f4Of0"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("2");
      });
    cy.get(cesc("#\\/f5Of0"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("2");
      });
    cy.get(cesc("#\\/f6Of0"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("2");
      });
    cy.get(cesc("#\\/fOf1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.get(cesc("#\\/f2Of1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.get(cesc("#\\/f3Of1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.get(cesc("#\\/f4Of1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.get(cesc("#\\/f5Of1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.get(cesc("#\\/f6Of1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.get(cesc("#\\/fOf2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("6");
      });
    cy.get(cesc("#\\/f2Of2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("6");
      });
    cy.get(cesc("#\\/f3Of2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("6");
      });
    cy.get(cesc("#\\/f4Of2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("6");
      });
    cy.get(cesc("#\\/f5Of2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("6");
      });
    cy.get(cesc("#\\/f6Of2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("6");
      });
  });

  // Don't have a way to test this anymore.  Should we send this info via a message?
  it.skip("extrema not resolved if not requested", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <function name="f">sin(x)</function>
    <copy assignNames="f2" target="f" />
    <function name="f3">$f</function>
    <function name="g" maxima="(1,2) (4,3)" />
    <copy assignNames="g2" target="g" />
    <function name="g3">$g</function>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/f"].state.formula.isResolved).eq(true);
      expect(stateVariables["/f"].state.symbolicfs.isResolved).eq(false);
      expect(stateVariables["/f"].state.numericalfs.isResolved).eq(false);
      expect(stateVariables["/f"].state.allMaxima.isResolved).eq(false);
      expect(stateVariables["/f"].state.allMinima.isResolved).eq(false);
      expect(stateVariables["/f"].state.allExtrema.isResolved).eq(false);
      expect(stateVariables["/f"].state.numMaxima.isResolved).eq(false);
      expect(stateVariables["/f"].state.numMinima.isResolved).eq(false);
      expect(stateVariables["/f"].state.numExtrema.isResolved).eq(false);
      expect(stateVariables["/f"].state.maxima.isResolved).eq(false);
      expect(stateVariables["/f"].state.minima.isResolved).eq(false);
      expect(stateVariables["/f"].state.extrema.isResolved).eq(false);

      expect(stateVariables["/f2"].state.formula.isResolved).eq(true);
      expect(stateVariables["/f2"].state.symbolicfs.isResolved).eq(false);
      expect(stateVariables["/f2"].state.numericalfs.isResolved).eq(false);
      expect(stateVariables["/f2"].state.allMaxima.isResolved).eq(false);
      expect(stateVariables["/f2"].state.allMinima.isResolved).eq(false);
      expect(stateVariables["/f2"].state.allExtrema.isResolved).eq(false);
      expect(stateVariables["/f2"].state.numMaxima.isResolved).eq(false);
      expect(stateVariables["/f2"].state.numMinima.isResolved).eq(false);
      expect(stateVariables["/f2"].state.numExtrema.isResolved).eq(false);
      expect(stateVariables["/f2"].state.maxima.isResolved).eq(false);
      expect(stateVariables["/f2"].state.minima.isResolved).eq(false);
      expect(stateVariables["/f2"].state.extrema.isResolved).eq(false);

      expect(stateVariables["/f3"].state.formula.isResolved).eq(true);
      expect(stateVariables["/f3"].state.symbolicfs.isResolved).eq(false);
      expect(stateVariables["/f3"].state.numericalfs.isResolved).eq(false);
      expect(stateVariables["/f3"].state.allMaxima.isResolved).eq(false);
      expect(stateVariables["/f3"].state.allMinima.isResolved).eq(false);
      expect(stateVariables["/f3"].state.allExtrema.isResolved).eq(false);
      expect(stateVariables["/f3"].state.numMaxima.isResolved).eq(false);
      expect(stateVariables["/f3"].state.numMinima.isResolved).eq(false);
      expect(stateVariables["/f3"].state.numExtrema.isResolved).eq(false);
      expect(stateVariables["/f3"].state.maxima.isResolved).eq(false);
      expect(stateVariables["/f3"].state.minima.isResolved).eq(false);
      expect(stateVariables["/f3"].state.extrema.isResolved).eq(false);

      expect(stateVariables["/g"].state.formula.isResolved).eq(true);
      expect(stateVariables["/g"].state.symbolicfs.isResolved).eq(false);
      expect(stateVariables["/g"].state.numericalfs.isResolved).eq(false);
      expect(stateVariables["/g"].state.allMaxima.isResolved).eq(false);
      expect(stateVariables["/g"].state.allMinima.isResolved).eq(false);
      expect(stateVariables["/g"].state.allExtrema.isResolved).eq(false);
      expect(stateVariables["/g"].state.numMaxima.isResolved).eq(false);
      expect(stateVariables["/g"].state.numMinima.isResolved).eq(false);
      expect(stateVariables["/g"].state.numExtrema.isResolved).eq(false);
      expect(stateVariables["/g"].state.maxima.isResolved).eq(false);
      expect(stateVariables["/g"].state.minima.isResolved).eq(false);
      expect(stateVariables["/g"].state.extrema.isResolved).eq(false);

      expect(stateVariables["/g2"].state.formula.isResolved).eq(true);
      expect(stateVariables["/g2"].state.symbolicfs.isResolved).eq(false);
      expect(stateVariables["/g2"].state.numericalfs.isResolved).eq(false);
      expect(stateVariables["/g2"].state.allMaxima.isResolved).eq(false);
      expect(stateVariables["/g2"].state.allMinima.isResolved).eq(false);
      expect(stateVariables["/g2"].state.allExtrema.isResolved).eq(false);
      expect(stateVariables["/g2"].state.numMaxima.isResolved).eq(false);
      expect(stateVariables["/g2"].state.numMinima.isResolved).eq(false);
      expect(stateVariables["/g2"].state.numExtrema.isResolved).eq(false);
      expect(stateVariables["/g2"].state.maxima.isResolved).eq(false);
      expect(stateVariables["/g2"].state.minima.isResolved).eq(false);
      expect(stateVariables["/g2"].state.extrema.isResolved).eq(false);

      expect(stateVariables["/g3"].state.formula.isResolved).eq(true);
      expect(stateVariables["/g3"].state.symbolicfs.isResolved).eq(false);
      expect(stateVariables["/g3"].state.numericalfs.isResolved).eq(false);
      expect(stateVariables["/g3"].state.allMaxima.isResolved).eq(false);
      expect(stateVariables["/g3"].state.allMinima.isResolved).eq(false);
      expect(stateVariables["/g3"].state.allExtrema.isResolved).eq(false);
      expect(stateVariables["/g3"].state.numMaxima.isResolved).eq(false);
      expect(stateVariables["/g3"].state.numMinima.isResolved).eq(false);
      expect(stateVariables["/g3"].state.numExtrema.isResolved).eq(false);
      expect(stateVariables["/g3"].state.maxima.isResolved).eq(false);
      expect(stateVariables["/g3"].state.minima.isResolved).eq(false);
      expect(stateVariables["/g3"].state.extrema.isResolved).eq(false);
    });
  });

  it("function determined by formula, specify 1 input", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function nInputs="1">3/(1+e^(-x/2))</function>
    </graph>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_function1"].stateValues.nInputs).eq(1);

      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      // let numericalf = (stateVariables['/_function1'].stateValues.numericalfs)[0];
      // let symbolicf = (stateVariables['/_function1'].stateValues.symbolicfs)[0];

      expect(f(-5)).closeTo(3 / (1 + Math.exp(5 / 2)), 1e-12);
      expect(f(1)).closeTo(3 / (1 + Math.exp(-1 / 2)), 1e-12);
      // expect(numericalf(-5)).closeTo(3 / (1 + Math.exp(5 / 2)), 1E-12);
      // expect(numericalf(1)).closeTo(3 / (1 + Math.exp(-1 / 2)), 1E-12);
      // expect(symbolicf(-5).equals(me.fromText('3/(1+e^(5/2))'))).eq(true)
      // expect(symbolicf(1).equals(me.fromText('3/(1+e^(-1/2))'))).eq(true)
      // expect(symbolicf('z').equals(me.fromText('3/(1+e^(-z/2))'))).eq(true)
    });
  });

  it("function of two variables determined by formula", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <function nInputs="2">3/(y+e^(-x/2))</function>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_function1"].stateValues.nInputs).eq(2);

      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      // let numericalf = (stateVariables['/_function1'].stateValues.numericalfs)[0];
      // let symbolicf = (stateVariables['/_function1'].stateValues.symbolicfs)[0];

      expect(f(-5, 7)).closeTo(3 / (7 + Math.exp(5 / 2)), 1e-12);
      expect(f(1, 4)).closeTo(3 / (4 + Math.exp(-1 / 2)), 1e-12);
      // expect(numericalf(-5, 7)).closeTo(3 / (7 + Math.exp(5 / 2)), 1E-12);
      // expect(numericalf(1, 4)).closeTo(3 / (4 + Math.exp(-1 / 2)), 1E-12);
      // expect(symbolicf(-5, 7).equals(me.fromText('3/(7+e^(5/2))'))).eq(true)
      // expect(symbolicf(1, 4).equals(me.fromText('3/(4+e^(-1/2))'))).eq(true)
      // expect(symbolicf('z', 'a').equals(me.fromText('3/(a+e^(-z/2))'))).eq(true)
    });
  });

  it("function of two variables determined by formula, specify variables", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <function nInputs="2" variables="q r">3/(r+e^(-q/2))</function>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_function1"].stateValues.nInputs).eq(2);

      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      // let numericalf = (stateVariables['/_function1'].stateValues.numericalfs)[0];
      // let symbolicf = (stateVariables['/_function1'].stateValues.symbolicfs)[0];

      expect(f(-5, 7)).closeTo(3 / (7 + Math.exp(5 / 2)), 1e-12);
      expect(f(1, 4)).closeTo(3 / (4 + Math.exp(-1 / 2)), 1e-12);
      // expect(numericalf(-5, 7)).closeTo(3 / (7 + Math.exp(5 / 2)), 1E-12);
      // expect(numericalf(1, 4)).closeTo(3 / (4 + Math.exp(-1 / 2)), 1E-12);
      // expect(symbolicf(-5, 7).equals(me.fromText('3/(7+e^(5/2))'))).eq(true)
      // expect(symbolicf(1, 4).equals(me.fromText('3/(4+e^(-1/2))'))).eq(true)
      // expect(symbolicf('z', 'a').equals(me.fromText('3/(a+e^(-z/2))'))).eq(true)
    });
  });

  it("function of two variables determined by formula, specify variables, no nInputs specified", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <function variables="q r">3/(r+e^(-q/2))</function>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_function1"].stateValues.nInputs).eq(2);

      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      // let numericalf = (stateVariables['/_function1'].stateValues.numericalfs)[0];
      // let symbolicf = (stateVariables['/_function1'].stateValues.symbolicfs)[0];

      expect(f(-5, 7)).closeTo(3 / (7 + Math.exp(5 / 2)), 1e-12);
      expect(f(1, 4)).closeTo(3 / (4 + Math.exp(-1 / 2)), 1e-12);
      // expect(numericalf(-5, 7)).closeTo(3 / (7 + Math.exp(5 / 2)), 1E-12);
      // expect(numericalf(1, 4)).closeTo(3 / (4 + Math.exp(-1 / 2)), 1E-12);
      // expect(symbolicf(-5, 7).equals(me.fromText('3/(7+e^(5/2))'))).eq(true)
      // expect(symbolicf(1, 4).equals(me.fromText('3/(4+e^(-1/2))'))).eq(true)
      // expect(symbolicf('z', 'a').equals(me.fromText('3/(a+e^(-z/2))'))).eq(true)
    });
  });

  it("function of three variables determined by formula", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <function nInputs="3">z/(y+e^(-x/2))</function>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_function1"].stateValues.nInputs).eq(3);

      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      // let numericalf = (stateVariables['/_function1'].stateValues.numericalfs)[0];
      // let symbolicf = (stateVariables['/_function1'].stateValues.symbolicfs)[0];

      expect(f(-5, 7, -2)).closeTo(-2 / (7 + Math.exp(5 / 2)), 1e-12);
      expect(f(1, 4, -9)).closeTo(-9 / (4 + Math.exp(-1 / 2)), 1e-12);
      // expect(numericalf(-5, 7, -2)).closeTo(-2 / (7 + Math.exp(5 / 2)), 1E-12);
      // expect(numericalf(1, 4, -9)).closeTo(-9 / (4 + Math.exp(-1 / 2)), 1E-12);
      // expect(symbolicf(-5, 7, -2).equals(me.fromText('-2/(7+e^(5/2))'))).eq(true)
      // expect(symbolicf(1, 4, -9).equals(me.fromText('-9/(4+e^(-1/2))'))).eq(true)
      // expect(symbolicf('z', 'a', 'u').equals(me.fromText('u/(a+e^(-z/2))'))).eq(true)
    });
  });

  it("function of three variables determined by formula, specify variables", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <function variables="q r s">s/(r+e^(-q/2))</function>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_function1"].stateValues.nInputs).eq(3);

      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      // let numericalf = (stateVariables['/_function1'].stateValues.numericalfs)[0];
      // let symbolicf = (stateVariables['/_function1'].stateValues.symbolicfs)[0];

      expect(f(-5, 7, -2)).closeTo(-2 / (7 + Math.exp(5 / 2)), 1e-12);
      expect(f(1, 4, -9)).closeTo(-9 / (4 + Math.exp(-1 / 2)), 1e-12);
      // expect(numericalf(-5, 7, -2)).closeTo(-2 / (7 + Math.exp(5 / 2)), 1E-12);
      // expect(numericalf(1, 4, -9)).closeTo(-9 / (4 + Math.exp(-1 / 2)), 1E-12);
      // expect(symbolicf(-5, 7, -2).equals(me.fromText('-2/(7+e^(5/2))'))).eq(true)
      // expect(symbolicf(1, 4, -9).equals(me.fromText('-9/(4+e^(-1/2))'))).eq(true)
      // expect(symbolicf('z', 'a', 'u').equals(me.fromText('u/(a+e^(-z/2))'))).eq(true)
    });
  });

  it("function of four variables determined by formula", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <function nInputs="4">x_3/(x_2+e^(-x_1/2))+x_4</function>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_function1"].stateValues.nInputs).eq(4);

      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      // let numericalf = (stateVariables['/_function1'].stateValues.numericalfs)[0];
      // let symbolicf = (stateVariables['/_function1'].stateValues.symbolicfs)[0];

      expect(f(-5, 7, -2, 6)).closeTo(-2 / (7 + Math.exp(5 / 2)) + 6, 1e-12);
      expect(f(1, 4, -9, -8)).closeTo(-9 / (4 + Math.exp(-1 / 2)) - 8, 1e-12);
      // expect(numericalf(-5, 7, -2, 6)).closeTo(-2 / (7 + Math.exp(5 / 2)) + 6, 1E-12);
      // expect(numericalf(1, 4, -9, -8)).closeTo(-9 / (4 + Math.exp(-1 / 2)) - 8, 1E-12);
      // expect(symbolicf(-5, 7, -2, 6).equals(me.fromText('-2/(7+e^(5/2))+6'))).eq(true)
      // expect(symbolicf(1, 4, -9, -8).equals(me.fromText('-9/(4+e^(-1/2))-8'))).eq(true)
      // expect(symbolicf('z', 'a', 'u', 'p').equals(me.fromText('u/(a+e^(-z/2))+p'))).eq(true)
    });
  });

  it("function of four variables determined by formula, specify some variables", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <function nInputs="4" variables="x y z">z/(y+e^(-x/2))+x_4</function>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_function1"].stateValues.nInputs).eq(4);

      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      // let numericalf = (stateVariables['/_function1'].stateValues.numericalfs)[0];
      // let symbolicf = (stateVariables['/_function1'].stateValues.symbolicfs)[0];

      expect(f(-5, 7, -2, 6)).closeTo(-2 / (7 + Math.exp(5 / 2)) + 6, 1e-12);
      expect(f(1, 4, -9, -8)).closeTo(-9 / (4 + Math.exp(-1 / 2)) - 8, 1e-12);
      // expect(numericalf(-5, 7, -2, 6)).closeTo(-2 / (7 + Math.exp(5 / 2)) + 6, 1E-12);
      // expect(numericalf(1, 4, -9, -8)).closeTo(-9 / (4 + Math.exp(-1 / 2)) - 8, 1E-12);
      // expect(symbolicf(-5, 7, -2, 6).equals(me.fromText('-2/(7+e^(5/2))+6'))).eq(true)
      // expect(symbolicf(1, 4, -9, -8).equals(me.fromText('-9/(4+e^(-1/2))-8'))).eq(true)
      // expect(symbolicf('z', 'a', 'u', 'p').equals(me.fromText('u/(a+e^(-z/2))+p'))).eq(true)
    });
  });

  it("2D vector-valued function of a single variable", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <function>(x^2, x^3)</function>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_function1"].stateValues.nInputs).eq(1);
      expect(stateVariables["/_function1"].stateValues.nOutputs).eq(2);

      // let f1 = (stateVariables['/_function1'].stateValues.fs)[0];
      let f1 = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      let f2 = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[1],
      );
      // let numericalf1 = (stateVariables['/_function1'].stateValues.numericalfs)[0];
      // let numericalf2 = (stateVariables['/_function1'].stateValues.numericalfs)[1];
      // let symbolicf1 = (stateVariables['/_function1'].stateValues.symbolicfs)[0];
      // let symbolicf2 = (stateVariables['/_function1'].stateValues.symbolicfs)[1];

      expect(f1(-5)).closeTo(25, 1e-12);
      expect(f2(-5)).closeTo(-125, 1e-12);
      expect(f1(3)).closeTo(9, 1e-12);
      expect(f2(3)).closeTo(27, 1e-12);
      // expect(numericalf1(-5)).closeTo(25, 1E-12);
      // expect(numericalf2(-5)).closeTo(-125, 1E-12);
      // expect(numericalf1(3)).closeTo(9, 1E-12);
      // expect(numericalf2(3)).closeTo(27, 1E-12);
      // expect(symbolicf1(-5).equals(me.fromText('(-5)^2'))).eq(true);
      // expect(symbolicf2(-5).equals(me.fromText('(-5)^3'))).eq(true);
      // expect(symbolicf1(3).equals(me.fromText('3^2'))).eq(true);
      // expect(symbolicf2(3).equals(me.fromText('3^3'))).eq(true);
      // expect(symbolicf1('z').equals(me.fromText('z^2'))).eq(true);
      // expect(symbolicf2('z').equals(me.fromText('z^3'))).eq(true);
    });
  });

  it("2D vector-valued function of a single variable, specify variable", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <function variable="t">(t^2, t^3)</function>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_function1"].stateValues.nInputs).eq(1);
      expect(stateVariables["/_function1"].stateValues.nOutputs).eq(2);

      let f1 = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      let f2 = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[1],
      );

      let numericalf1 =
        stateVariables["/_function1"].stateValues.numericalfs[0];
      let numericalf2 =
        stateVariables["/_function1"].stateValues.numericalfs[1];
      let symbolicf1 = stateVariables["/_function1"].stateValues.symbolicfs[0];
      // let symbolicf2 = (stateVariables['/_function1'].stateValues.symbolicfs)[1];

      expect(f1(-5)).closeTo(25, 1e-12);
      expect(f2(-5)).closeTo(-125, 1e-12);
      expect(f1(3)).closeTo(9, 1e-12);
      expect(f2(3)).closeTo(27, 1e-12);
      // expect(numericalf1(-5)).closeTo(25, 1E-12);
      // expect(numericalf2(-5)).closeTo(-125, 1E-12);
      // expect(numericalf1(3)).closeTo(9, 1E-12);
      // expect(numericalf2(3)).closeTo(27, 1E-12);
      // expect(symbolicf1(-5).equals(me.fromText('(-5)^2'))).eq(true);
      // expect(symbolicf2(-5).equals(me.fromText('(-5)^3'))).eq(true);
      // expect(symbolicf1(3).equals(me.fromText('3^2'))).eq(true);
      // expect(symbolicf2(3).equals(me.fromText('3^3'))).eq(true);
      // expect(symbolicf1('z').equals(me.fromText('z^2'))).eq(true);
      // expect(symbolicf2('z').equals(me.fromText('z^3'))).eq(true);
    });
  });

  it("2D vector-valued function of a single variable, specify nOutputs", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <function variables="t" nOutputs="2">(t^2, t^3)</function>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_function1"].stateValues.nInputs).eq(1);
      expect(stateVariables["/_function1"].stateValues.nOutputs).eq(2);

      let f1 = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      let f2 = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[1],
      );
      // let numericalf1 = (stateVariables['/_function1'].stateValues.numericalfs)[0];
      // let numericalf2 = (stateVariables['/_function1'].stateValues.numericalfs)[1];
      // let symbolicf1 = (stateVariables['/_function1'].stateValues.symbolicfs)[0];
      // let symbolicf2 = (stateVariables['/_function1'].stateValues.symbolicfs)[1];

      expect(f1(-5)).closeTo(25, 1e-12);
      expect(f2(-5)).closeTo(-125, 1e-12);
      expect(f1(3)).closeTo(9, 1e-12);
      expect(f2(3)).closeTo(27, 1e-12);
      // expect(numericalf1(-5)).closeTo(25, 1E-12);
      // expect(numericalf2(-5)).closeTo(-125, 1E-12);
      // expect(numericalf1(3)).closeTo(9, 1E-12);
      // expect(numericalf2(3)).closeTo(27, 1E-12);
      // expect(symbolicf1(-5).equals(me.fromText('(-5)^2'))).eq(true);
      // expect(symbolicf2(-5).equals(me.fromText('(-5)^3'))).eq(true);
      // expect(symbolicf1(3).equals(me.fromText('3^2'))).eq(true);
      // expect(symbolicf2(3).equals(me.fromText('3^3'))).eq(true);
      // expect(symbolicf1('z').equals(me.fromText('z^2'))).eq(true);
      // expect(symbolicf2('z').equals(me.fromText('z^3'))).eq(true);
    });
  });

  it("3D vector-valued function of a single variable", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <function>(x^2, x^3, x^4)</function>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_function1"].stateValues.nInputs).eq(1);
      expect(stateVariables["/_function1"].stateValues.nOutputs).eq(3);

      let f1 = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      let f2 = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[1],
      );
      let f3 = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[2],
      );
      // let numericalf1 = (stateVariables['/_function1'].stateValues.numericalfs)[0];
      // let numericalf2 = (stateVariables['/_function1'].stateValues.numericalfs)[1];
      // let numericalf3 = (stateVariables['/_function1'].stateValues.numericalfs)[2];
      // let symbolicf1 = (stateVariables['/_function1'].stateValues.symbolicfs)[0];
      // let symbolicf2 = (stateVariables['/_function1'].stateValues.symbolicfs)[1];
      // let symbolicf3 = (stateVariables['/_function1'].stateValues.symbolicfs)[2];

      expect(f1(-5)).closeTo(25, 1e-12);
      expect(f2(-5)).closeTo(-125, 1e-12);
      expect(f3(-5)).closeTo(625, 1e-12);
      expect(f1(3)).closeTo(9, 1e-12);
      expect(f2(3)).closeTo(27, 1e-12);
      expect(f3(3)).closeTo(81, 1e-12);
      // expect(numericalf1(-5)).closeTo(25, 1E-12);
      // expect(numericalf2(-5)).closeTo(-125, 1E-12);
      // expect(numericalf3(-5)).closeTo(625, 1E-12);
      // expect(numericalf1(3)).closeTo(9, 1E-12);
      // expect(numericalf2(3)).closeTo(27, 1E-12);
      // expect(numericalf3(3)).closeTo(81, 1E-12);
      // expect(symbolicf1(-5).equals(me.fromText('(-5)^2'))).eq(true);
      // expect(symbolicf2(-5).equals(me.fromText('(-5)^3'))).eq(true);
      // expect(symbolicf3(-5).equals(me.fromText('(-5)^4'))).eq(true);
      // expect(symbolicf1(3).equals(me.fromText('3^2'))).eq(true);
      // expect(symbolicf2(3).equals(me.fromText('3^3'))).eq(true);
      // expect(symbolicf3(3).equals(me.fromText('3^4'))).eq(true);
      // expect(symbolicf1('z').equals(me.fromText('z^2'))).eq(true);
      // expect(symbolicf2('z').equals(me.fromText('z^3'))).eq(true);
      // expect(symbolicf3('z').equals(me.fromText('z^4'))).eq(true);
    });
  });

  it("3D vector-valued function of a single variable, specify variable", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <function variable="t">(t^2, t^3, t^4)</function>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_function1"].stateValues.nInputs).eq(1);
      expect(stateVariables["/_function1"].stateValues.nOutputs).eq(3);

      let f1 = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      let f2 = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[1],
      );
      let f3 = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[2],
      );
      // let numericalf1 = (stateVariables['/_function1'].stateValues.numericalfs)[0];
      // let numericalf2 = (stateVariables['/_function1'].stateValues.numericalfs)[1];
      // let numericalf3 = (stateVariables['/_function1'].stateValues.numericalfs)[2];
      // let symbolicf1 = (stateVariables['/_function1'].stateValues.symbolicfs)[0];
      // let symbolicf2 = (stateVariables['/_function1'].stateValues.symbolicfs)[1];
      // let symbolicf3 = (stateVariables['/_function1'].stateValues.symbolicfs)[2];

      expect(f1(-5)).closeTo(25, 1e-12);
      expect(f2(-5)).closeTo(-125, 1e-12);
      expect(f3(-5)).closeTo(625, 1e-12);
      expect(f1(3)).closeTo(9, 1e-12);
      expect(f2(3)).closeTo(27, 1e-12);
      expect(f3(3)).closeTo(81, 1e-12);
      // expect(numericalf1(-5)).closeTo(25, 1E-12);
      // expect(numericalf2(-5)).closeTo(-125, 1E-12);
      // expect(numericalf3(-5)).closeTo(625, 1E-12);
      // expect(numericalf1(3)).closeTo(9, 1E-12);
      // expect(numericalf2(3)).closeTo(27, 1E-12);
      // expect(numericalf3(3)).closeTo(81, 1E-12);
      // expect(symbolicf1(-5).equals(me.fromText('(-5)^2'))).eq(true);
      // expect(symbolicf2(-5).equals(me.fromText('(-5)^3'))).eq(true);
      // expect(symbolicf3(-5).equals(me.fromText('(-5)^4'))).eq(true);
      // expect(symbolicf1(3).equals(me.fromText('3^2'))).eq(true);
      // expect(symbolicf2(3).equals(me.fromText('3^3'))).eq(true);
      // expect(symbolicf3(3).equals(me.fromText('3^4'))).eq(true);
      // expect(symbolicf1('z').equals(me.fromText('z^2'))).eq(true);
      // expect(symbolicf2('z').equals(me.fromText('z^3'))).eq(true);
      // expect(symbolicf3('z').equals(me.fromText('z^4'))).eq(true);
    });
  });

  it("2D vector-valued function of two variables", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <function nInputs="2">(x^2y^3, x^3y^2)</function>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_function1"].stateValues.nInputs).eq(2);
      expect(stateVariables["/_function1"].stateValues.nOutputs).eq(2);

      let f1 = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      let f2 = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[1],
      );
      // let numericalf1 = (stateVariables['/_function1'].stateValues.numericalfs)[0];
      // let numericalf2 = (stateVariables['/_function1'].stateValues.numericalfs)[1];
      // let symbolicf1 = (stateVariables['/_function1'].stateValues.symbolicfs)[0];
      // let symbolicf2 = (stateVariables['/_function1'].stateValues.symbolicfs)[1];

      expect(f1(-5, 2)).closeTo(200, 1e-12);
      expect(f2(-5, 2)).closeTo(-500, 1e-12);
      expect(f1(3, -4)).closeTo(-576, 1e-12);
      expect(f2(3, -4)).closeTo(432, 1e-12);
      // expect(numericalf1(-5, 2)).closeTo(200, 1E-12);
      // expect(numericalf2(-5, 2)).closeTo(-500, 1E-12);
      // expect(numericalf1(3, -4)).closeTo(-576, 1E-12);
      // expect(numericalf2(3, -4)).closeTo(432, 1E-12);
      // expect(symbolicf1(-5, 2).equals(me.fromText('(-5)^2*2^3'))).eq(true);
      // expect(symbolicf2(-5, 2).equals(me.fromText('(-5)^3*2^2'))).eq(true);
      // expect(symbolicf1(3, -4).equals(me.fromText('3^2*(-4)^3'))).eq(true);
      // expect(symbolicf2(3, -4).equals(me.fromText('3^3*(-4)^2'))).eq(true);
      // expect(symbolicf1('z', 'w').equals(me.fromText('z^2w^3'))).eq(true);
      // expect(symbolicf2('z', 'w').equals(me.fromText('z^3w^2'))).eq(true);
    });
  });

  it("3D vector-valued function of two variables", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <function variables="s t">(s^2t^3, s^3t^2, st)</function>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_function1"].stateValues.nInputs).eq(2);
      expect(stateVariables["/_function1"].stateValues.nOutputs).eq(3);

      let f1 = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      let f2 = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[1],
      );
      let f3 = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[2],
      );
      // let numericalf1 = (stateVariables['/_function1'].stateValues.numericalfs)[0];
      // let numericalf2 = (stateVariables['/_function1'].stateValues.numericalfs)[1];
      // let numericalf3 = (stateVariables['/_function1'].stateValues.numericalfs)[2];
      // let symbolicf1 = (stateVariables['/_function1'].stateValues.symbolicfs)[0];
      // let symbolicf2 = (stateVariables['/_function1'].stateValues.symbolicfs)[1];
      // let symbolicf3 = (stateVariables['/_function1'].stateValues.symbolicfs)[2];

      expect(f1(-5, 2)).closeTo(200, 1e-12);
      expect(f2(-5, 2)).closeTo(-500, 1e-12);
      expect(f3(-5, 2)).closeTo(-10, 1e-12);
      expect(f1(3, -4)).closeTo(-576, 1e-12);
      expect(f2(3, -4)).closeTo(432, 1e-12);
      expect(f3(3, -4)).closeTo(-12, 1e-12);
      // expect(numericalf1(-5, 2)).closeTo(200, 1E-12);
      // expect(numericalf2(-5, 2)).closeTo(-500, 1E-12);
      // expect(numericalf3(-5, 2)).closeTo(-10, 1E-12);
      // expect(numericalf1(3, -4)).closeTo(-576, 1E-12);
      // expect(numericalf2(3, -4)).closeTo(432, 1E-12);
      // expect(numericalf3(3, -4)).closeTo(-12, 1E-12);
      // expect(symbolicf1(-5, 2).equals(me.fromText('(-5)^2*2^3'))).eq(true);
      // expect(symbolicf2(-5, 2).equals(me.fromText('(-5)^3*2^2'))).eq(true);
      // expect(symbolicf3(-5, 2).equals(me.fromText('(-5)*2'))).eq(true);
      // expect(symbolicf1(3, -4).equals(me.fromText('3^2*(-4)^3'))).eq(true);
      // expect(symbolicf2(3, -4).equals(me.fromText('3^3*(-4)^2'))).eq(true);
      // expect(symbolicf3(3, -4).equals(me.fromText('3*(-4)'))).eq(true);
      // expect(symbolicf1('z', 'w').equals(me.fromText('z^2w^3'))).eq(true);
      // expect(symbolicf2('z', 'w').equals(me.fromText('z^3w^2'))).eq(true);
      // expect(symbolicf3('z', 'w').equals(me.fromText('zw'))).eq(true);
    });
  });

  it("3D vector-valued function of two variables, as alt vector", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <function variables="s t">⟨s^2t^3, s^3t^2, st⟩</function>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_function1"].stateValues.nInputs).eq(2);
      expect(stateVariables["/_function1"].stateValues.nOutputs).eq(3);

      let f1 = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      let f2 = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[1],
      );
      let f3 = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[2],
      );
      // let numericalf1 = (stateVariables['/_function1'].stateValues.numericalfs)[0];
      // let numericalf2 = (stateVariables['/_function1'].stateValues.numericalfs)[1];
      // let numericalf3 = (stateVariables['/_function1'].stateValues.numericalfs)[2];
      // let symbolicf1 = (stateVariables['/_function1'].stateValues.symbolicfs)[0];
      // let symbolicf2 = (stateVariables['/_function1'].stateValues.symbolicfs)[1];
      // let symbolicf3 = (stateVariables['/_function1'].stateValues.symbolicfs)[2];

      expect(f1(-5, 2)).closeTo(200, 1e-12);
      expect(f2(-5, 2)).closeTo(-500, 1e-12);
      expect(f3(-5, 2)).closeTo(-10, 1e-12);
      expect(f1(3, -4)).closeTo(-576, 1e-12);
      expect(f2(3, -4)).closeTo(432, 1e-12);
      expect(f3(3, -4)).closeTo(-12, 1e-12);
      // expect(numericalf1(-5, 2)).closeTo(200, 1E-12);
      // expect(numericalf2(-5, 2)).closeTo(-500, 1E-12);
      // expect(numericalf3(-5, 2)).closeTo(-10, 1E-12);
      // expect(numericalf1(3, -4)).closeTo(-576, 1E-12);
      // expect(numericalf2(3, -4)).closeTo(432, 1E-12);
      // expect(numericalf3(3, -4)).closeTo(-12, 1E-12);
      // expect(symbolicf1(-5, 2).equals(me.fromText('(-5)^2*2^3'))).eq(true);
      // expect(symbolicf2(-5, 2).equals(me.fromText('(-5)^3*2^2'))).eq(true);
      // expect(symbolicf3(-5, 2).equals(me.fromText('(-5)*2'))).eq(true);
      // expect(symbolicf1(3, -4).equals(me.fromText('3^2*(-4)^3'))).eq(true);
      // expect(symbolicf2(3, -4).equals(me.fromText('3^3*(-4)^2'))).eq(true);
      // expect(symbolicf3(3, -4).equals(me.fromText('3*(-4)'))).eq(true);
      // expect(symbolicf1('z', 'w').equals(me.fromText('z^2w^3'))).eq(true);
      // expect(symbolicf2('z', 'w').equals(me.fromText('z^3w^2'))).eq(true);
      // expect(symbolicf3('z', 'w').equals(me.fromText('zw'))).eq(true);
    });
  });

  it("copy function and overwrite symbolic attribute", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <function name="f1" symbolic="false">x^2</function>
    <copy target="f1" symbolic assignNames="f2" />
    <copy target="f2" symbolic="false" assignNames="f3" />
    <function name="g1">x^2</function>
    <copy target="g1" symbolic="false" assignNames="g2" />
    <copy target="g2" symbolic assignNames="g3" />

    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/f1"].stateValues.symbolic).eq(false);
      expect(stateVariables["/f2"].stateValues.symbolic).eq(true);
      expect(stateVariables["/f3"].stateValues.symbolic).eq(false);
      expect(stateVariables["/g1"].stateValues.symbolic).eq(true);
      expect(stateVariables["/g2"].stateValues.symbolic).eq(false);
      expect(stateVariables["/g3"].stateValues.symbolic).eq(true);
    });
  });

  it("copy function and overwrite nInputs", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <function name="f1" symbolic>xyz</function>
    <copy target="f1" nInputs="2" assignNames="f2" />
    <copy target="f2" nInputs="3" assignNames="f3" />
    
    <p name="p1">$$f1(a)</p>
    <p name="p2">$$f2(a,b)</p>
    <p name="p3">$$f3(a,b,c)</p>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/p1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("ayz");
      });
    cy.get(cesc("#\\/p2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("abz");
      });
    cy.get(cesc("#\\/p3") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("abc");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/f1"].stateValues.nInputs).eq(1);
      expect(stateVariables["/f2"].stateValues.nInputs).eq(2);
      expect(stateVariables["/f3"].stateValues.nInputs).eq(3);
      expect(stateVariables["/f1"].stateValues.variables.map((x) => x)).eqls([
        "x",
      ]);
      expect(stateVariables["/f2"].stateValues.variables.map((x) => x)).eqls([
        "x",
        "y",
      ]);
      expect(stateVariables["/f3"].stateValues.variables.map((x) => x)).eqls([
        "x",
        "y",
        "z",
      ]);
    });
  });

  it("copy function and overwrite variables", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <function name="f1" symbolic simplify="none">xyz</function>
    <copy target="f1" variables="x y" assignNames="f2" />
    <copy target="f2" variables="x y z" assignNames="f3" />
    <copy target="f3" variables="z y" assignNames="f4" />
    <copy target="f4" variables="y" assignNames="f5" />
    <copy target="f4" variable="y" assignNames="f5a" />
    
    <p name="p1">$$f1(a)</p>
    <p name="p2">$$f2(a,b)</p>
    <p name="p3">$$f3(a,b,c)</p>
    <p name="p4">$$f4(a,b)</p>
    <p name="p5">$$f5(a)</p>
    <p name="p5a">$$f5a(a)</p>
    `,
        },
        "*",
      );
    });

    //wait for window to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/p1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("ayz");
      });
    cy.get(cesc("#\\/p2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("abz");
      });
    cy.get(cesc("#\\/p3") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("abc");
      });
    cy.get(cesc("#\\/p4") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("xba");
      });
    cy.get(cesc("#\\/p5") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("xaz");
      });
    cy.get(cesc("#\\/p5a") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("xaz");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/f1"].stateValues.nInputs).eq(1);
      expect(stateVariables["/f2"].stateValues.nInputs).eq(2);
      expect(stateVariables["/f3"].stateValues.nInputs).eq(3);
      expect(stateVariables["/f4"].stateValues.nInputs).eq(2);
      expect(stateVariables["/f5"].stateValues.nInputs).eq(1);
      expect(stateVariables["/f5a"].stateValues.nInputs).eq(1);
      expect(stateVariables["/f1"].stateValues.variables.map((x) => x)).eqls([
        "x",
      ]);
      expect(stateVariables["/f2"].stateValues.variables.map((x) => x)).eqls([
        "x",
        "y",
      ]);
      expect(stateVariables["/f3"].stateValues.variables.map((x) => x)).eqls([
        "x",
        "y",
        "z",
      ]);
      expect(stateVariables["/f4"].stateValues.variables.map((x) => x)).eqls([
        "z",
        "y",
      ]);
      expect(stateVariables["/f5"].stateValues.variables.map((x) => x)).eqls([
        "y",
      ]);
      expect(stateVariables["/f5a"].stateValues.variables.map((x) => x)).eqls([
        "y",
      ]);
    });
  });

  it("copy props with propIndex", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>

  <p>n: <mathinput name="n" prefill="2" /></p>

  <graph name="g">
    <function name="f" minima="(-7,-5) (2,1)" maxima="(-4,4) (8,9)" />
  </graph>
  
  <p><aslist><copy prop="minima" target="f" propIndex="$n" assignNames="mn1 mn2" /></aslist></p>
  <p><aslist><copy prop="maxima" target="f" propIndex="$n" assignNames="mx1 mx2" /></aslist></p>
  <p><aslist><copy prop="extrema" target="f" propIndex="$n" assignNames="ex1 ex2 ex3 ex4" /></aslist></p>
  
  <p><aslist><copy prop="minimumLocations" target="f" propIndex="$n" assignNames="mnl1 mnl2" /></aslist></p>
  <p><aslist><copy prop="maximumLocations" target="f" propIndex="$n" assignNames="mxl1 mxl2" /></aslist></p>
  <p><aslist><copy prop="extremumLocations" target="f" propIndex="$n" assignNames="exl1 exl2 exl3 exl4" /></aslist></p>
  
  <p><aslist><copy prop="minimumValues" target="f" propIndex="$n" assignNames="mnv1 mnv2" /></aslist></p>
  <p><aslist><copy prop="maximumValues" target="f" propIndex="$n" assignNames="mxv1 mxv2" /></aslist></p>
  <p><aslist><copy prop="extremumValues" target="f" propIndex="$n" assignNames="exv1 exv2 exv3 exv4" /></aslist></p>

  <p><aslist><copy prop="minimum1" target="f" propIndex="$n" assignNames="mn11 mn12" /></aslist></p>
  <p><aslist><copy prop="maximum1" target="f" propIndex="$n" assignNames="mx11 mx12" /></aslist></p>
  <p><aslist><copy prop="extremum1" target="f" propIndex="$n" assignNames="ex11 ex12 ex13 ex14" /></aslist></p>

  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.get(cesc("#\\/mn1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).eq("(2,1)");
      });
    cy.get(cesc("#\\/mx1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).eq("(8,9)");
      });
    cy.get(cesc("#\\/ex1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).eq("(−4,4)");
      });
    cy.get(cesc("#\\/mnl1")).should("have.text", "2");
    cy.get(cesc("#\\/mxl1")).should("have.text", "8");
    cy.get(cesc("#\\/exl1")).should("have.text", "-4");

    cy.get(cesc("#\\/mnv1")).should("have.text", "1");
    cy.get(cesc("#\\/mxv1")).should("have.text", "9");
    cy.get(cesc("#\\/exv1")).should("have.text", "4");

    cy.get(cesc("#\\/mn11")).should("have.text", "-5");
    cy.get(cesc("#\\/mx11")).should("have.text", "4");
    cy.get(cesc("#\\/ex11")).should("have.text", "-5");

    cy.log("set propIndex to 1");

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/mnl1")).should("have.text", "-7");
    cy.get(cesc("#\\/mxl1")).should("have.text", "-4");
    cy.get(cesc("#\\/exl1")).should("have.text", "-7");

    cy.get(cesc("#\\/mnv1")).should("have.text", "-5");
    cy.get(cesc("#\\/mxv1")).should("have.text", "4");
    cy.get(cesc("#\\/exv1")).should("have.text", "-5");

    cy.get(cesc("#\\/mn11")).should("have.text", "-7");
    cy.get(cesc("#\\/mx11")).should("have.text", "-4");
    cy.get(cesc("#\\/ex11")).should("have.text", "-7");

    cy.get(cesc("#\\/mn1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).eq("(−7,−5)");
      });
    cy.get(cesc("#\\/mx1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).eq("(−4,4)");
      });
    cy.get(cesc("#\\/ex1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).eq("(−7,−5)");
      });
  });

  it("copy props with propIndex, dot and array notation", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>

  <p>n: <mathinput name="n" prefill="2" /></p>

  <graph name="g">
    <function name="f" minima="(-7,-5) (2,1)" maxima="(-4,4) (8,9)" />
  </graph>
  
  <p><aslist><copy source="f.minima[$n]" assignNames="mn1 mn2" /></aslist></p>
  <p><aslist><copy source="f.maxima[$n]" assignNames="mx1 mx2" /></aslist></p>
  <p><aslist><copy source="f.extrema[$n]" assignNames="ex1 ex2 ex3 ex4" /></aslist></p>
  
  <p><aslist><copy source="f.minimumLocations[$n]" assignNames="mnl1 mnl2" /></aslist></p>
  <p><aslist><copy source="f.maximumLocations[$n]" assignNames="mxl1 mxl2" /></aslist></p>
  <p><aslist><copy source="f.extremumLocations[$n]" assignNames="exl1 exl2 exl3 exl4" /></aslist></p>
  
  <p><aslist><copy source="f.minimumValues[$n]" assignNames="mnv1 mnv2" /></aslist></p>
  <p><aslist><copy source="f.maximumValues[$n]" assignNames="mxv1 mxv2" /></aslist></p>
  <p><aslist><copy source="f.extremumValues[$n]" assignNames="exv1 exv2 exv3 exv4" /></aslist></p>

  <p><aslist><copy source="f.minimum1[$n]" assignNames="mn11 mn12" /></aslist></p>
  <p><aslist><copy source="f.maximum1[$n]" assignNames="mx11 mx12" /></aslist></p>
  <p><aslist><copy source="f.extremum1[$n]" assignNames="ex11 ex12 ex13 ex14" /></aslist></p>

  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.get(cesc("#\\/mn1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).eq("(2,1)");
      });
    cy.get(cesc("#\\/mx1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).eq("(8,9)");
      });
    cy.get(cesc("#\\/ex1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).eq("(−4,4)");
      });
    cy.get(cesc("#\\/mnl1")).should("have.text", "2");
    cy.get(cesc("#\\/mxl1")).should("have.text", "8");
    cy.get(cesc("#\\/exl1")).should("have.text", "-4");

    cy.get(cesc("#\\/mnv1")).should("have.text", "1");
    cy.get(cesc("#\\/mxv1")).should("have.text", "9");
    cy.get(cesc("#\\/exv1")).should("have.text", "4");

    cy.get(cesc("#\\/mn11")).should("have.text", "-5");
    cy.get(cesc("#\\/mx11")).should("have.text", "4");
    cy.get(cesc("#\\/ex11")).should("have.text", "-5");

    cy.log("set propIndex to 1");

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/mnl1")).should("have.text", "-7");
    cy.get(cesc("#\\/mxl1")).should("have.text", "-4");
    cy.get(cesc("#\\/exl1")).should("have.text", "-7");

    cy.get(cesc("#\\/mnv1")).should("have.text", "-5");
    cy.get(cesc("#\\/mxv1")).should("have.text", "4");
    cy.get(cesc("#\\/exv1")).should("have.text", "-5");

    cy.get(cesc("#\\/mn11")).should("have.text", "-7");
    cy.get(cesc("#\\/mx11")).should("have.text", "-4");
    cy.get(cesc("#\\/ex11")).should("have.text", "-7");

    cy.get(cesc("#\\/mn1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).eq("(−7,−5)");
      });
    cy.get(cesc("#\\/mx1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).eq("(−4,4)");
      });
    cy.get(cesc("#\\/ex1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).eq("(−7,−5)");
      });
  });

  it("copy props with multidimensional propIndex, dot and array notation", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>

  <p>n: <mathinput name="n" prefill="2" /></p>

  <graph name="g">
    <function name="f" minima="(-7,-5) (2,1)" maxima="(-4,4) (8,9)" />
  </graph>
  
  <p><aslist><copy source="f.minima[$n]" assignNames="mn1 mn2" /></aslist></p>
  <p><aslist><copy source="f.maxima[$n]" assignNames="mx1 mx2" /></aslist></p>
  <p><aslist><copy source="f.extrema[$n]" assignNames="ex1 ex2 ex3 ex4" /></aslist></p>
  
  <p><aslist><copy source="f.minima[$n][1]" assignNames="mnl1 mnl2" /></aslist></p>
  <p><aslist><copy source="f.maxima[$n][1]" assignNames="mxl1 mxl2" /></aslist></p>
  <p><aslist><copy source="f.extrema[$n][1]" assignNames="exl1 exl2 exl3 exl4" /></aslist></p>
  
  <p><aslist><copy source="f.minima[$n][2]" assignNames="mnv1 mnv2" /></aslist></p>
  <p><aslist><copy source="f.maxima[$n][2]" assignNames="mxv1 mxv2" /></aslist></p>
  <p><aslist><copy source="f.extrema[$n][2]" assignNames="exv1 exv2 exv3 exv4" /></aslist></p>

  <p><aslist><copy source="f.minima[1][$n]" assignNames="mn11 mn12" /></aslist></p>
  <p><aslist><copy source="f.maxima[1][$n]" assignNames="mx11 mx12" /></aslist></p>
  <p><aslist><copy source="f.extrema[1][$n]" assignNames="ex11 ex12 ex13 ex14" /></aslist></p>

  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.get(cesc("#\\/mn1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).eq("(2,1)");
      });
    cy.get(cesc("#\\/mx1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).eq("(8,9)");
      });
    cy.get(cesc("#\\/ex1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).eq("(−4,4)");
      });
    cy.get(cesc("#\\/mnl1")).should("have.text", "2");
    cy.get(cesc("#\\/mxl1")).should("have.text", "8");
    cy.get(cesc("#\\/exl1")).should("have.text", "-4");

    cy.get(cesc("#\\/mnv1")).should("have.text", "1");
    cy.get(cesc("#\\/mxv1")).should("have.text", "9");
    cy.get(cesc("#\\/exv1")).should("have.text", "4");

    cy.get(cesc("#\\/mn11")).should("have.text", "-5");
    cy.get(cesc("#\\/mx11")).should("have.text", "4");
    cy.get(cesc("#\\/ex11")).should("have.text", "-5");

    cy.log("set propIndex to 1");

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/mnl1")).should("have.text", "-7");
    cy.get(cesc("#\\/mxl1")).should("have.text", "-4");
    cy.get(cesc("#\\/exl1")).should("have.text", "-7");

    cy.get(cesc("#\\/mnv1")).should("have.text", "-5");
    cy.get(cesc("#\\/mxv1")).should("have.text", "4");
    cy.get(cesc("#\\/exv1")).should("have.text", "-5");

    cy.get(cesc("#\\/mn11")).should("have.text", "-7");
    cy.get(cesc("#\\/mx11")).should("have.text", "-4");
    cy.get(cesc("#\\/ex11")).should("have.text", "-7");

    cy.get(cesc("#\\/mn1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).eq("(−7,−5)");
      });
    cy.get(cesc("#\\/mx1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).eq("(−4,4)");
      });
    cy.get(cesc("#\\/ex1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).eq("(−7,−5)");
      });
  });

  it("rounding", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>

  <function name="f1" simplify="none">255.029847 sin(0.52952342x) + 3</function>
  <function name="f2" simplify="none" displayDigits="4"> 255.029847 sin(0.52952342x) + 3</function>
  <function name="f3" simplify="none" displayDigits="4" padZeros> 255.029847 sin(0.52952342x) + 3</function>
  <function name="f4" simplify="none" displayDecimals="3"> 255.029847 sin(0.52952342x) + 3</function>
  <function name="f5" simplify="none" displayDecimals="3" padZeros> 255.029847 sin(0.52952342x) + 3</function>

  <copy target="f1" assignNames="f1a" />
  <copy target="f2" assignNames="f2a" />
  <copy target="f3" assignNames="f3a" />
  <copy target="f4" assignNames="f4a" />
  <copy target="f5" assignNames="f5a" />

  <copy target="f1" prop="formula" assignNames="f1b" />
  <copy target="f2" prop="formula" assignNames="f2b" />
  <copy target="f3" prop="formula" assignNames="f3b" />
  <copy target="f4" prop="formula" assignNames="f4b" />
  <copy target="f5" prop="formula" assignNames="f5b" />

  <math name="f1c">$f1</math>
  <math name="f2c">$f2</math>
  <math name="f3c">$f3</math>
  <math name="f4c">$f4</math>
  <math name="f5c">$f5</math>

  <math name="f1d"><copy prop="formula" target="f1" /></math>
  <math name="f2d"><copy prop="formula" target="f2" /></math>
  <math name="f3d"><copy prop="formula" target="f3" /></math>
  <math name="f4d"><copy prop="formula" target="f4" /></math>
  <math name="f5d"><copy prop="formula" target="f5" /></math>

  <math name="f1e">$f1a</math>
  <math name="f2e">$f2a</math>
  <math name="f3e">$f3a</math>
  <math name="f4e">$f4a</math>
  <math name="f5e">$f5a</math>

  <math name="f1f">$f1b</math>
  <math name="f2f">$f2b</math>
  <math name="f3f">$f3b</math>
  <math name="f4f">$f4b</math>
  <math name="f5f">$f5b</math>

  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.get(cesc("#\\/f1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.53x)+3");
      });
    cy.get(cesc("#\\/f2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.5295x)+3");
      });
    cy.get(cesc("#\\/f3") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.5295x)+3.000");
      });
    cy.get(cesc("#\\/f4") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.53x)+3");
      });
    cy.get(cesc("#\\/f5") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.030sin(0.530x)+3.000");
      });

    cy.get(cesc("#\\/f1a") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.53x)+3");
      });
    cy.get(cesc("#\\/f2a") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.5295x)+3");
      });
    cy.get(cesc("#\\/f3a") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.5295x)+3.000");
      });
    cy.get(cesc("#\\/f4a") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.53x)+3");
      });
    cy.get(cesc("#\\/f5a") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.030sin(0.530x)+3.000");
      });

    cy.get(cesc("#\\/f1b") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.53x)+3");
      });
    cy.get(cesc("#\\/f2b") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.5295x)+3");
      });
    cy.get(cesc("#\\/f3b") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.5295x)+3.000");
      });
    cy.get(cesc("#\\/f4b") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.53x)+3");
      });
    cy.get(cesc("#\\/f5b") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.030sin(0.530x)+3.000");
      });

    cy.get(cesc("#\\/f1c") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.53x)+3");
      });
    cy.get(cesc("#\\/f2c") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.5295x)+3");
      });
    cy.get(cesc("#\\/f3c") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.5295x)+3.000");
      });
    cy.get(cesc("#\\/f4c") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.53x)+3");
      });
    cy.get(cesc("#\\/f5c") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.030sin(0.530x)+3.000");
      });

    cy.get(cesc("#\\/f1d") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.53x)+3");
      });
    cy.get(cesc("#\\/f2d") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.5295x)+3");
      });
    cy.get(cesc("#\\/f3d") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.5295x)+3.000");
      });
    cy.get(cesc("#\\/f4d") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.53x)+3");
      });
    cy.get(cesc("#\\/f5d") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.030sin(0.530x)+3.000");
      });

    cy.get(cesc("#\\/f1e") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.53x)+3");
      });
    cy.get(cesc("#\\/f2e") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.5295x)+3");
      });
    cy.get(cesc("#\\/f3e") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.5295x)+3.000");
      });
    cy.get(cesc("#\\/f4e") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.53x)+3");
      });
    cy.get(cesc("#\\/f5e") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.030sin(0.530x)+3.000");
      });

    cy.get(cesc("#\\/f1f") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.53x)+3");
      });
    cy.get(cesc("#\\/f2f") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.5295x)+3");
      });
    cy.get(cesc("#\\/f3f") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.5295x)+3.000");
      });
    cy.get(cesc("#\\/f4f") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.53x)+3");
      });
    cy.get(cesc("#\\/f5f") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.030sin(0.530x)+3.000");
      });
  });

  it("rounding, overwrite on copy", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>

  <function name="f1">255.029847 sin(0.52952342x) + 3</function>
  <function name="f2" displayDigits="4"> 255.029847 sin(0.52952342x) + 3</function>
  <function name="f3" displayDigits="4" padZeros> 255.029847 sin(0.52952342x) + 3</function>
  <function name="f4" displayDecimals="3"> 255.029847 sin(0.52952342x) + 3</function>
  <function name="f5" displayDecimals="3" padZeros> 255.029847 sin(0.52952342x) + 3</function>

  <copy source="f1" assignNames="f1dg6" displayDigits="6" />
  <copy source="f2" assignNames="f2dg6" displayDigits="6" />
  <copy source="f3" assignNames="f3dg6" displayDigits="6" />
  <copy source="f4" assignNames="f4dg6" displayDigits="6" />
  <copy source="f5" assignNames="f5dg6" displayDigits="6" />
  <copy source="f1" assignNames="f1dc7" displayDecimals="7" />
  <copy source="f2" assignNames="f2dc7" displayDecimals="7" />
  <copy source="f3" assignNames="f3dc7" displayDecimals="7" />
  <copy source="f4" assignNames="f4dc7" displayDecimals="7" />
  <copy source="f5" assignNames="f5dc7" displayDecimals="7" />
  <copy source="f1" assignNames="f1pt" padZeros />
  <copy source="f2" assignNames="f2pt" padZeros />
  <copy source="f3" assignNames="f3pt" padZeros />
  <copy source="f4" assignNames="f4pt" padZeros />
  <copy source="f5" assignNames="f5pt" padZeros />
  <copy source="f1" assignNames="f1pf" padZeros="false" />
  <copy source="f2" assignNames="f2pf" padZeros="false" />
  <copy source="f3" assignNames="f3pf" padZeros="false" />
  <copy source="f4" assignNames="f4pf" padZeros="false" />
  <copy source="f5" assignNames="f5pf" padZeros="false" />

  <copy source="f1.formula" assignNames="f1fdg6" displayDigits="6" />
  <copy source="f2.formula" assignNames="f2fdg6" displayDigits="6" />
  <copy source="f3.formula" assignNames="f3fdg6" displayDigits="6" />
  <copy source="f4.formula" assignNames="f4fdg6" displayDigits="6" />
  <copy source="f5.formula" assignNames="f5fdg6" displayDigits="6" />
  <copy source="f1.formula" assignNames="f1fdc7" displayDecimals="7" />
  <copy source="f2.formula" assignNames="f2fdc7" displayDecimals="7" />
  <copy source="f3.formula" assignNames="f3fdc7" displayDecimals="7" />
  <copy source="f4.formula" assignNames="f4fdc7" displayDecimals="7" />
  <copy source="f5.formula" assignNames="f5fdc7" displayDecimals="7" />
  <copy source="f1.formula" assignNames="f1fpt" padZeros />
  <copy source="f2.formula" assignNames="f2fpt" padZeros />
  <copy source="f3.formula" assignNames="f3fpt" padZeros />
  <copy source="f4.formula" assignNames="f4fpt" padZeros />
  <copy source="f5.formula" assignNames="f5fpt" padZeros />
  <copy source="f1.formula" assignNames="f1fpf" padZeros="false" />
  <copy source="f2.formula" assignNames="f2fpf" padZeros="false" />
  <copy source="f3.formula" assignNames="f3fpf" padZeros="false" />
  <copy source="f4.formula" assignNames="f4fpf" padZeros="false" />
  <copy source="f5.formula" assignNames="f5fpf" padZeros="false" />


  <function name="f1dg6a" displayDigits="6" ><copy source="f1" /></function>
  <function name="f2dg6a" displayDigits="6" ><copy source="f2" /></function>
  <function name="f3dg6a" displayDigits="6" ><copy source="f3" /></function>
  <function name="f4dg6a" displayDigits="6" ><copy source="f4" /></function>
  <function name="f5dg6a" displayDigits="6" ><copy source="f5" /></function>
  <function name="f1dc7a" displayDecimals="7" ><copy source="f1" /></function>
  <function name="f2dc7a" displayDecimals="7" ><copy source="f2" /></function>
  <function name="f3dc7a" displayDecimals="7" ><copy source="f3" /></function>
  <function name="f4dc7a" displayDecimals="7" ><copy source="f4" /></function>
  <function name="f5dc7a" displayDecimals="7" ><copy source="f5" /></function>
  <function name="f1pta" padZeros ><copy source="f1" /></function>
  <function name="f2pta" padZeros ><copy source="f2" /></function>
  <function name="f3pta" padZeros ><copy source="f3" /></function>
  <function name="f4pta" padZeros ><copy source="f4" /></function>
  <function name="f5pta" padZeros ><copy source="f5" /></function>
  <function name="f1pfa" padZeros="false" ><copy source="f1" /></function>
  <function name="f2pfa" padZeros="false" ><copy source="f2" /></function>
  <function name="f3pfa" padZeros="false" ><copy source="f3" /></function>
  <function name="f4pfa" padZeros="false" ><copy source="f4" /></function>
  <function name="f5pfa" padZeros="false" ><copy source="f5" /></function>



  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.get(cesc("#\\/f1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.53x)+3");
      });
    cy.get(cesc("#\\/f2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.5295x)+3");
      });
    cy.get(cesc("#\\/f3") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.5295x)+3.000");
      });
    cy.get(cesc("#\\/f4") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.53x)+3");
      });
    cy.get(cesc("#\\/f5") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.030sin(0.530x)+3.000");
      });

    cy.get(cesc("#\\/f1dg6") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.529523x)+3");
      });
    cy.get(cesc("#\\/f2dg6") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.529523x)+3");
      });
    cy.get(cesc("#\\/f3dg6") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.030sin(0.529523x)+3.00000");
      });
    cy.get(cesc("#\\/f4dg6") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.529523x)+3");
      });
    cy.get(cesc("#\\/f5dg6") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.030sin(0.529523x)+3.00000");
      });

    cy.get(cesc("#\\/f1fdg6") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.529523x)+3");
      });
    cy.get(cesc("#\\/f2fdg6") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.529523x)+3");
      });
    cy.get(cesc("#\\/f3fdg6") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.030sin(0.529523x)+3.00000");
      });
    cy.get(cesc("#\\/f4fdg6") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.529523x)+3");
      });
    cy.get(cesc("#\\/f5fdg6") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.030sin(0.529523x)+3.00000");
      });

    cy.get(cesc("#\\/f1dg6a") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.529523x)+3");
      });
    cy.get(cesc("#\\/f2dg6a") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.529523x)+3");
      });
    cy.get(cesc("#\\/f3dg6a") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.030sin(0.529523x)+3.00000");
      });
    cy.get(cesc("#\\/f4dg6a") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.529523x)+3");
      });
    cy.get(cesc("#\\/f5dg6a") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.030sin(0.529523x)+3.00000");
      });

    cy.get(cesc("#\\/f1dc7") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.029847sin(0.5295234x)+3");
      });
    cy.get(cesc("#\\/f2dc7") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.029847sin(0.5295234x)+3");
      });
    cy.get(cesc("#\\/f3dc7") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.0298470sin(0.5295234x)+3.0000000");
      });
    cy.get(cesc("#\\/f4dc7") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.029847sin(0.5295234x)+3");
      });
    cy.get(cesc("#\\/f5dc7") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.0298470sin(0.5295234x)+3.0000000");
      });

    cy.get(cesc("#\\/f1fdc7") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.029847sin(0.5295234x)+3");
      });
    cy.get(cesc("#\\/f2fdc7") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.029847sin(0.5295234x)+3");
      });
    cy.get(cesc("#\\/f3fdc7") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.0298470sin(0.5295234x)+3.0000000");
      });
    cy.get(cesc("#\\/f4fdc7") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.029847sin(0.5295234x)+3");
      });
    cy.get(cesc("#\\/f5fdc7") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.0298470sin(0.5295234x)+3.0000000");
      });

    cy.get(cesc("#\\/f1dc7a") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.029847sin(0.5295234x)+3");
      });
    cy.get(cesc("#\\/f2dc7a") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.029847sin(0.5295234x)+3");
      });
    cy.get(cesc("#\\/f3dc7a") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.0298470sin(0.5295234x)+3.0000000");
      });
    cy.get(cesc("#\\/f4dc7a") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.029847sin(0.5295234x)+3");
      });
    cy.get(cesc("#\\/f5dc7a") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.0298470sin(0.5295234x)+3.0000000");
      });

    cy.get(cesc("#\\/f1pt") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.530x)+3.00");
      });
    cy.get(cesc("#\\/f2pt") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.5295x)+3.000");
      });
    cy.get(cesc("#\\/f3pt") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.5295x)+3.000");
      });
    cy.get(cesc("#\\/f4pt") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.030sin(0.530x)+3.000");
      });
    cy.get(cesc("#\\/f5pt") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.030sin(0.530x)+3.000");
      });

    cy.get(cesc("#\\/f1fpt") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.530x)+3.00");
      });
    cy.get(cesc("#\\/f2fpt") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.5295x)+3.000");
      });
    cy.get(cesc("#\\/f3fpt") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.5295x)+3.000");
      });
    cy.get(cesc("#\\/f4fpt") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.030sin(0.530x)+3.000");
      });
    cy.get(cesc("#\\/f5fpt") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.030sin(0.530x)+3.000");
      });

    cy.get(cesc("#\\/f1pta") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.530x)+3.00");
      });
    cy.get(cesc("#\\/f2pta") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.5295x)+3.000");
      });
    cy.get(cesc("#\\/f3pta") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.5295x)+3.000");
      });
    cy.get(cesc("#\\/f4pta") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.030sin(0.530x)+3.000");
      });
    cy.get(cesc("#\\/f5pta") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.030sin(0.530x)+3.000");
      });

    cy.get(cesc("#\\/f1pf") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.53x)+3");
      });
    cy.get(cesc("#\\/f2pf") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.5295x)+3");
      });
    cy.get(cesc("#\\/f3pf") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.5295x)+3");
      });
    cy.get(cesc("#\\/f4pf") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.53x)+3");
      });
    cy.get(cesc("#\\/f5pf") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.53x)+3");
      });

    cy.get(cesc("#\\/f1fpf") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.53x)+3");
      });
    cy.get(cesc("#\\/f2fpf") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.5295x)+3");
      });
    cy.get(cesc("#\\/f3fpf") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.5295x)+3");
      });
    cy.get(cesc("#\\/f4fpf") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.53x)+3");
      });
    cy.get(cesc("#\\/f5fpf") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.53x)+3");
      });

    cy.get(cesc("#\\/f1pfa") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.53x)+3");
      });
    cy.get(cesc("#\\/f2pfa") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.5295x)+3");
      });
    cy.get(cesc("#\\/f3pfa") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.5295x)+3");
      });
    cy.get(cesc("#\\/f4pfa") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.53x)+3");
      });
    cy.get(cesc("#\\/f5pfa") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("255.03sin(0.53x)+3");
      });
  });

  it("style description changes with theme", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <setup>
      <styleDefinitions>
        <styleDefinition styleNumber="1" lineColor="brown" lineColorDarkMode="yellow" />
        <styleDefinition styleNumber="2" lineColor="#540907" lineColorWord="dark red" lineColorDarkMode="#f0c6c5" lineColorWordDarkMode="light red" />
      </styleDefinitions>
    </setup>
    <graph>
      <function name="A" styleNumber="1" labelIsName>x^2</function>
      <function name="B" styleNumber="2" labelIsName>x^2+2</function>
      <function name="C" styleNumber="5" labelIsName>x^2+4</function>
    </graph>
    <p name="Adescrip">Function A is $A.styleDescription.</p>
    <p name="Bdescrip">B is a $B.styleDescriptionWithNoun.</p>
    <p name="Cdescrip">C is a $C.styleDescriptionWithNoun.</p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/Adescrip")).should(
      "have.text",
      "Function A is thick brown.",
    );
    cy.get(cesc("#\\/Bdescrip")).should(
      "have.text",
      "B is a dark red function.",
    );
    cy.get(cesc("#\\/Cdescrip")).should(
      "have.text",
      "C is a thin black function.",
    );

    cy.log("set dark mode");
    cy.get("#testRunner_toggleControls").click();
    cy.get("#testRunner_darkmode").click();
    cy.wait(100);
    cy.get("#testRunner_toggleControls").click();

    cy.get(cesc("#\\/Adescrip")).should(
      "have.text",
      "Function A is thick yellow.",
    );
    cy.get(cesc("#\\/Bdescrip")).should(
      "have.text",
      "B is a light red function.",
    );
    cy.get(cesc("#\\/Cdescrip")).should(
      "have.text",
      "C is a thin white function.",
    );
  });
});
