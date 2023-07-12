import { createFunctionFromDefinition } from "../../../../src/Core/utils/function";
import { cesc } from "../../../../src/_utils/url";

describe("Parameterized Curve Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("sugar a parameterization in terms of x", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <curve>
    (5x^3, 3x^5)
    </curve>
    </graph>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for window to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_curve1"].stateValues.curveType).eq(
        "parameterization",
      );
      expect(stateVariables["/_curve1"].stateValues.variableForChild).eq("x");
      expect(stateVariables["/_curve1"].stateValues.parMin).eq(-10);
      expect(stateVariables["/_curve1"].stateValues.parMax).eq(10);
      let f1 = createFunctionFromDefinition(
        stateVariables["/_curve1"].stateValues.fDefinitions[0],
      );
      let f2 = createFunctionFromDefinition(
        stateVariables["/_curve1"].stateValues.fDefinitions[1],
      );
      expect(f1(-2)).eq(-5 * 8);
      expect(f1(3)).eq(5 * 27);
      expect(f2(-2)).eq(-3 * 32);
      expect(f2(3)).eq(3 * 243);
    });
  });

  it("sugar a parameterization in terms of x, with strings and macros", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <curve>
    ($b x^$a, $a x^$b)
    </curve>
    </graph>
    <number name="a">3</number>
    <math name="b">5</math>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for window to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_curve1"].stateValues.curveType).eq(
        "parameterization",
      );
      expect(stateVariables["/_curve1"].stateValues.variableForChild).eq("x");
      expect(stateVariables["/_curve1"].stateValues.parMin).eq(-10);
      expect(stateVariables["/_curve1"].stateValues.parMax).eq(10);
      let f1 = createFunctionFromDefinition(
        stateVariables["/_curve1"].stateValues.fDefinitions[0],
      );
      let f2 = createFunctionFromDefinition(
        stateVariables["/_curve1"].stateValues.fDefinitions[1],
      );
      expect(f1(-2)).eq(-5 * 8);
      expect(f1(3)).eq(5 * 27);
      expect(f2(-2)).eq(-3 * 32);
      expect(f2(3)).eq(3 * 243);
    });
  });

  it("sugar a parameterization in terms of x, with strings and macros, label with math", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <curve>
      ($b x^$a, $a x^$b)
      <label><m>($b x^$a, $a x^$b)</m></label>
    </curve>
    </graph>
    <number name="a">3</number>
    <math name="b">5</math>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for window to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_curve1"].stateValues.curveType).eq(
        "parameterization",
      );
      expect(stateVariables["/_curve1"].stateValues.variableForChild).eq("x");
      expect(stateVariables["/_curve1"].stateValues.parMin).eq(-10);
      expect(stateVariables["/_curve1"].stateValues.parMax).eq(10);
      expect(stateVariables["/_curve1"].stateValues.label).eq(
        "\\((5 x^3, 3 x^5)\\)",
      );
      let f1 = createFunctionFromDefinition(
        stateVariables["/_curve1"].stateValues.fDefinitions[0],
      );
      let f2 = createFunctionFromDefinition(
        stateVariables["/_curve1"].stateValues.fDefinitions[1],
      );
      expect(f1(-2)).eq(-5 * 8);
      expect(f1(3)).eq(5 * 27);
      expect(f2(-2)).eq(-3 * 32);
      expect(f2(3)).eq(3 * 243);
    });
  });

  it("sugar a parameterization in terms of t", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <curve variable="t">
    (5t^3, 3t^5)
    </curve>
    </graph>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for window to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_curve1"].stateValues.curveType).eq(
        "parameterization",
      );
      expect(stateVariables["/_curve1"].stateValues.variableForChild).eq("t");
      expect(stateVariables["/_curve1"].stateValues.parMin).eq(-10);
      expect(stateVariables["/_curve1"].stateValues.parMax).eq(10);
      let f1 = createFunctionFromDefinition(
        stateVariables["/_curve1"].stateValues.fDefinitions[0],
      );
      let f2 = createFunctionFromDefinition(
        stateVariables["/_curve1"].stateValues.fDefinitions[1],
      );
      expect(f1(-2)).eq(-5 * 8);
      expect(f1(3)).eq(5 * 27);
      expect(f2(-2)).eq(-3 * 32);
      expect(f2(3)).eq(3 * 243);
    });
  });

  it("sugar a parameterization in terms of t, with strings and macro", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <curve variable="$var">
    (5$var^3, 3$var^5)
    </curve>
    </graph>
    <math name="var">t</math>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for window to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_curve1"].stateValues.curveType).eq(
        "parameterization",
      );
      expect(stateVariables["/_curve1"].stateValues.variableForChild).eq("t");
      expect(stateVariables["/_curve1"].stateValues.parMin).eq(-10);
      expect(stateVariables["/_curve1"].stateValues.parMax).eq(10);
      let f1 = createFunctionFromDefinition(
        stateVariables["/_curve1"].stateValues.fDefinitions[0],
      );
      let f2 = createFunctionFromDefinition(
        stateVariables["/_curve1"].stateValues.fDefinitions[1],
      );
      expect(f1(-2)).eq(-5 * 8);
      expect(f1(3)).eq(5 * 27);
      expect(f2(-2)).eq(-3 * 32);
      expect(f2(3)).eq(3 * 243);
    });
  });

  it.skip("x, y = a parameterization in terms of t", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <curve>
    x = 5t^3, 3t^5 = y
    </curve>
    </graph>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for window to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let parametrizedCurve =
        stateVariables[stateVariables["/_curve1"].stateValues.curveChild];
      // expect(stateVariables['/_curve1'].stateValues.curveType).eq("parameterization");
      expect(stateVariables["/_curve1"].stateValues.variables[0]).eq("x");
      expect(stateVariables["/_curve1"].stateValues.variables[1]).eq("y");
      expect(stateVariables["/_curve1"].stateValues.parameter).eq("t");
      expect(stateVariables["/_curve1"].stateValues.parMin).eq(-10);
      expect(stateVariables["/_curve1"].stateValues.parMax).eq(10);
      expect(parametrizedCurve.stateValues.variables[0]).eq("x");
      expect(parametrizedCurve.stateValues.variables[1]).eq("y");
      expect(parametrizedCurve.stateValues.parameter).eq("t");
      expect(parametrizedCurve.stateValues.parMin).eq(-10);
      expect(parametrizedCurve.stateValues.parMax).eq(10);
      expect(parametrizedCurve.stateValues.fs[0](-2)).eq(-5 * 8);
      expect(parametrizedCurve.stateValues.fs[0](3)).eq(5 * 27);
      expect(parametrizedCurve.stateValues.fs[1](-2)).eq(-3 * 32);
      expect(parametrizedCurve.stateValues.fs[1](3)).eq(3 * 243);
    });
  });

  it.skip("x, y = a parameterization in terms of t, swapped variables", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <curve variables="y,x">
    x = 5t^3, 3t^5 = y
    </curve>
    </graph>
    `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for window to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let parametrizedCurve =
        stateVariables[stateVariables["/_curve1"].stateValues.curveChild];
      // expect(stateVariables['/_curve1'].stateValues.curveType).eq("parameterization");
      expect(stateVariables["/_curve1"].stateValues.variables[0]).eq("y");
      expect(stateVariables["/_curve1"].stateValues.variables[1]).eq("x");
      expect(stateVariables["/_curve1"].stateValues.parameter).eq("t");
      expect(stateVariables["/_curve1"].stateValues.parMin).eq(-10);
      expect(stateVariables["/_curve1"].stateValues.parMax).eq(10);
      expect(parametrizedCurve.stateValues.variables[0]).eq("y");
      expect(parametrizedCurve.stateValues.variables[1]).eq("x");
      expect(parametrizedCurve.stateValues.parameter).eq("t");
      expect(parametrizedCurve.stateValues.parMin).eq(-10);
      expect(parametrizedCurve.stateValues.parMax).eq(10);
      expect(parametrizedCurve.stateValues.fs[1](-2)).eq(-5 * 8);
      expect(parametrizedCurve.stateValues.fs[1](3)).eq(5 * 27);
      expect(parametrizedCurve.stateValues.fs[0](-2)).eq(-3 * 32);
      expect(parametrizedCurve.stateValues.fs[0](3)).eq(3 * 243);
    });
  });

  it.skip("u, v = a parameterization in terms of s", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <curve variables="u,v" parameter="s">
    u = 5s^3, 3s^5 = v
    </curve>
    </graph>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for window to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let parametrizedCurve =
        stateVariables[stateVariables["/_curve1"].stateValues.curveChild];
      // expect(stateVariables['/_curve1'].stateValues.curveType).eq("parameterization");
      expect(stateVariables["/_curve1"].stateValues.variables[0]).eq("u");
      expect(stateVariables["/_curve1"].stateValues.variables[1]).eq("v");
      expect(stateVariables["/_curve1"].stateValues.parameter).eq("s");
      expect(stateVariables["/_curve1"].stateValues.parMin).eq(-10);
      expect(stateVariables["/_curve1"].stateValues.parMax).eq(10);
      expect(parametrizedCurve.stateValues.variables[0]).eq("u");
      expect(parametrizedCurve.stateValues.variables[1]).eq("v");
      expect(parametrizedCurve.stateValues.parameter).eq("s");
      expect(parametrizedCurve.stateValues.parMin).eq(-10);
      expect(parametrizedCurve.stateValues.parMax).eq(10);
      expect(parametrizedCurve.stateValues.fs[0](-2)).eq(-5 * 8);
      expect(parametrizedCurve.stateValues.fs[0](3)).eq(5 * 27);
      expect(parametrizedCurve.stateValues.fs[1](-2)).eq(-3 * 32);
      expect(parametrizedCurve.stateValues.fs[1](3)).eq(3 * 243);
    });
  });

  it.skip("x, y = a parameterization in terms of t, vector form", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <curve>
    (5t^3, 3t^5) = (x,y)
    </curve>
    </graph>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for window to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let parametrizedCurve =
        stateVariables[stateVariables["/_curve1"].stateValues.curveChild];
      // expect(stateVariables['/_curve1'].stateValues.curveType).eq("parameterization");
      expect(stateVariables["/_curve1"].stateValues.variables[0]).eq("x");
      expect(stateVariables["/_curve1"].stateValues.variables[1]).eq("y");
      expect(stateVariables["/_curve1"].stateValues.parameter).eq("t");
      expect(stateVariables["/_curve1"].stateValues.parMin).eq(-10);
      expect(stateVariables["/_curve1"].stateValues.parMax).eq(10);
      expect(parametrizedCurve.stateValues.variables[0]).eq("x");
      expect(parametrizedCurve.stateValues.variables[1]).eq("y");
      expect(parametrizedCurve.stateValues.parameter).eq("t");
      expect(parametrizedCurve.stateValues.parMin).eq(-10);
      expect(parametrizedCurve.stateValues.parMax).eq(10);
      expect(parametrizedCurve.stateValues.fs[0](-2)).eq(-5 * 8);
      expect(parametrizedCurve.stateValues.fs[0](3)).eq(5 * 27);
      expect(parametrizedCurve.stateValues.fs[1](-2)).eq(-3 * 32);
      expect(parametrizedCurve.stateValues.fs[1](3)).eq(3 * 243);
    });
  });

  it.skip("x, y = a parameterization in terms of t, vector form, switched", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <curve>
    (x,y) = (5t^3, 3t^5)
    </curve>
    </graph>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for window to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let parametrizedCurve =
        stateVariables[stateVariables["/_curve1"].stateValues.curveChild];
      // expect(stateVariables['/_curve1'].stateValues.curveType).eq("parameterization");
      expect(stateVariables["/_curve1"].stateValues.variables[0]).eq("x");
      expect(stateVariables["/_curve1"].stateValues.variables[1]).eq("y");
      expect(stateVariables["/_curve1"].stateValues.parameter).eq("t");
      expect(stateVariables["/_curve1"].stateValues.parMin).eq(-10);
      expect(stateVariables["/_curve1"].stateValues.parMax).eq(10);
      expect(parametrizedCurve.stateValues.variables[0]).eq("x");
      expect(parametrizedCurve.stateValues.variables[1]).eq("y");
      expect(parametrizedCurve.stateValues.parameter).eq("t");
      expect(parametrizedCurve.stateValues.parMin).eq(-10);
      expect(parametrizedCurve.stateValues.parMax).eq(10);
      expect(parametrizedCurve.stateValues.fs[0](-2)).eq(-5 * 8);
      expect(parametrizedCurve.stateValues.fs[0](3)).eq(5 * 27);
      expect(parametrizedCurve.stateValues.fs[1](-2)).eq(-3 * 32);
      expect(parametrizedCurve.stateValues.fs[1](3)).eq(3 * 243);
    });
  });

  it.skip("x, y = a parameterization in terms of t, change par limits", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <curve parMin="-1" parMax="0.5">
    x = 5t^3, 3t^5 = y
    </curve>
    </graph>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for window to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let parametrizedCurve =
        stateVariables[stateVariables["/_curve1"].stateValues.curveChild];
      // expect(stateVariables['/_curve1'].stateValues.curveType).eq("parameterization");
      expect(stateVariables["/_curve1"].stateValues.variables[0]).eq("x");
      expect(stateVariables["/_curve1"].stateValues.variables[1]).eq("y");
      expect(stateVariables["/_curve1"].stateValues.parameter).eq("t");
      expect(stateVariables["/_curve1"].stateValues.parMin.simplify()).eq(-1);
      expect(stateVariables["/_curve1"].stateValues.parMax).eq(0.5);
      expect(parametrizedCurve.stateValues.variables[0]).eq("x");
      expect(parametrizedCurve.stateValues.variables[1]).eq("y");
      expect(parametrizedCurve.stateValues.parameter).eq("t");
      expect(parametrizedCurve.stateValues.parMin.simplify()).eq(-1);
      expect(parametrizedCurve.stateValues.parMax).eq(0.5);
      expect(parametrizedCurve.stateValues.fs[0](-2)).eq(-5 * 8);
      expect(parametrizedCurve.stateValues.fs[0](3)).eq(5 * 27);
      expect(parametrizedCurve.stateValues.fs[1](-2)).eq(-3 * 32);
      expect(parametrizedCurve.stateValues.fs[1](3)).eq(3 * 243);
    });
  });

  it("a parameterization, no sugar", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <curve>
    <function variables="q">5q^3</function>
    <function variables="u">3u^5</function>
    </curve>
    </graph>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for window to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_curve1"].stateValues.curveType).eq(
        "parameterization",
      );
      expect(stateVariables["/_curve1"].stateValues.parMin).eq(-10);
      expect(stateVariables["/_curve1"].stateValues.parMax).eq(10);
      let f1 = createFunctionFromDefinition(
        stateVariables["/_curve1"].stateValues.fDefinitions[0],
      );
      let f2 = createFunctionFromDefinition(
        stateVariables["/_curve1"].stateValues.fDefinitions[1],
      );
      expect(f1(-2)).eq(-5 * 8);
      expect(f1(3)).eq(5 * 27);
      expect(f2(-2)).eq(-3 * 32);
      expect(f2(3)).eq(3 * 243);
    });
  });

  it("a parameterization, from vector-valued function", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <curve>
    <function variables="q">(5q^3, 3q^5)</function>
    </curve>
    </graph>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for window to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_curve1"].stateValues.curveType).eq(
        "parameterization",
      );
      expect(stateVariables["/_curve1"].stateValues.parMin).eq(-10);
      expect(stateVariables["/_curve1"].stateValues.parMax).eq(10);
      let f1 = createFunctionFromDefinition(
        stateVariables["/_curve1"].stateValues.fDefinitions[0],
      );
      let f2 = createFunctionFromDefinition(
        stateVariables["/_curve1"].stateValues.fDefinitions[1],
      );
      expect(f1(-2)).eq(-5 * 8);
      expect(f1(3)).eq(5 * 27);
      expect(f2(-2)).eq(-3 * 32);
      expect(f2(3)).eq(3 * 243);
    });
  });

  it("a parameterization, adapted from vector-valued function", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function variables="q">(5q^3, 3q^5)</function>
    </graph>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for window to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let curveName =
        stateVariables["/_graph1"].activeChildren[0].componentName;
      expect(stateVariables[curveName].stateValues.curveType).eq(
        "parameterization",
      );
      expect(stateVariables[curveName].stateValues.parMin).eq(-10);
      expect(stateVariables[curveName].stateValues.parMax).eq(10);
      let f1 = createFunctionFromDefinition(
        stateVariables[curveName].stateValues.fDefinitions[0],
      );
      let f2 = createFunctionFromDefinition(
        stateVariables[curveName].stateValues.fDefinitions[1],
      );
      expect(f1(-2)).eq(-5 * 8);
      expect(f1(3)).eq(5 * 27);
      expect(f2(-2)).eq(-3 * 32);
      expect(f2(3)).eq(3 * 243);
    });
  });

  it("a parameterization, no sugar, label with math", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <curve>
    <function variables="q">5q^3</function>
    <function variables="u">3u^5</function>
    <label><m>(5t^3,3t^5)</m></label>
    </curve>
    </graph>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for window to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_curve1"].stateValues.curveType).eq(
        "parameterization",
      );
      expect(stateVariables["/_curve1"].stateValues.parMin).eq(-10);
      expect(stateVariables["/_curve1"].stateValues.parMax).eq(10);
      expect(stateVariables["/_curve1"].stateValues.label).eq(
        "\\((5t^3,3t^5)\\)",
      );
      let f1 = createFunctionFromDefinition(
        stateVariables["/_curve1"].stateValues.fDefinitions[0],
      );
      let f2 = createFunctionFromDefinition(
        stateVariables["/_curve1"].stateValues.fDefinitions[1],
      );
      expect(f1(-2)).eq(-5 * 8);
      expect(f1(3)).eq(5 * 27);
      expect(f2(-2)).eq(-3 * 32);
      expect(f2(3)).eq(3 * 243);
    });
  });

  it("a parameterization, change par limits", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <curve parMin="-1" parMax="0.5">
      <function variables="t">5t^3</function>
      <function variables="t">3t^5</function>
    </curve>
    </graph>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for window to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_curve1"].stateValues.curveType).eq(
        "parameterization",
      );
      expect(stateVariables["/_curve1"].stateValues.parMin).eq(-1);
      expect(stateVariables["/_curve1"].stateValues.parMax).eq(0.5);
      let f1 = createFunctionFromDefinition(
        stateVariables["/_curve1"].stateValues.fDefinitions[0],
      );
      let f2 = createFunctionFromDefinition(
        stateVariables["/_curve1"].stateValues.fDefinitions[1],
      );
      expect(f1(-2)).eq(-5 * 8);
      expect(f1(3)).eq(5 * 27);
      expect(f2(-2)).eq(-3 * 32);
      expect(f2(3)).eq(3 * 243);
    });
  });

  it("a parameterization, copy and overwrite par limits", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <curve name="c1" parMin="-1" parMax="0.5">
      <function variables="t">5t^3</function>
      <function variables="t">3t^5</function>
    </curve>
    </graph>
    <graph>
      <copy target="c1" parMin="-4" parMax="0" assignNames="c2" />
    </graph>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for window to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/c1"].stateValues.curveType).eq(
        "parameterization",
      );
      expect(stateVariables["/c1"].stateValues.parMin).eq(-1);
      expect(stateVariables["/c1"].stateValues.parMax).eq(0.5);

      let f1 = createFunctionFromDefinition(
        stateVariables["/c1"].stateValues.fDefinitions[0],
      );
      let f2 = createFunctionFromDefinition(
        stateVariables["/c1"].stateValues.fDefinitions[1],
      );
      expect(f1(-2)).eq(-5 * 8);
      expect(f1(3)).eq(5 * 27);
      expect(f2(-2)).eq(-3 * 32);
      expect(f2(3)).eq(3 * 243);

      expect(stateVariables["/c2"].stateValues.curveType).eq(
        "parameterization",
      );
      expect(stateVariables["/c2"].stateValues.parMin).eq(-4);
      expect(stateVariables["/c2"].stateValues.parMax).eq(0);

      f1 = createFunctionFromDefinition(
        stateVariables["/c1"].stateValues.fDefinitions[0],
      );
      f2 = createFunctionFromDefinition(
        stateVariables["/c1"].stateValues.fDefinitions[1],
      );
      expect(f1(-2)).eq(-5 * 8);
      expect(f1(3)).eq(5 * 27);
      expect(f2(-2)).eq(-3 * 32);
      expect(f2(3)).eq(3 * 243);
    });
  });

  it.skip("a parameterization with parens", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <curve>
    (t-2)(t-3), (t+2)(t+3)
    </curve>
    </graph>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for window to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let parametrizedCurve =
        stateVariables[stateVariables["/_curve1"].stateValues.curveChild];
      // expect(stateVariables['/_curve1'].stateValues.curveType).eq("parameterization");
      expect(stateVariables["/_curve1"].stateValues.variables[0]).eq("x");
      expect(stateVariables["/_curve1"].stateValues.variables[1]).eq("y");
      expect(stateVariables["/_curve1"].stateValues.parameter).eq("t");
      expect(stateVariables["/_curve1"].stateValues.parMin).eq(-10);
      expect(stateVariables["/_curve1"].stateValues.parMax).eq(10);
      expect(parametrizedCurve.stateValues.variables[0]).eq("x");
      expect(parametrizedCurve.stateValues.variables[1]).eq("y");
      expect(parametrizedCurve.stateValues.parameter).eq("t");
      expect(parametrizedCurve.stateValues.parMin).eq(-10);
      expect(parametrizedCurve.stateValues.parMax).eq(10);
      expect(parametrizedCurve.stateValues.fs[0](-2)).eq(4 * 5);
      expect(parametrizedCurve.stateValues.fs[0](3)).eq(0);
      expect(parametrizedCurve.stateValues.fs[1](-2)).eq(0);
      expect(parametrizedCurve.stateValues.fs[1](3)).eq(5 * 6);
    });
  });

  it("a parameterization with copy", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <mathinput prefill="2"/>
    <graph>
    <curve>
    <function variables="t">t$_mathinput1+1</function>
    <function variables="t">t^3-$_mathinput1</function>
    </curve>
    </graph>
    $_mathinput1.value{assignNames="m1"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for window to load
    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "2");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_curve1"].stateValues.parMin).eq(-10);
      expect(stateVariables["/_curve1"].stateValues.parMax).eq(10);
      let f1 = createFunctionFromDefinition(
        stateVariables["/_curve1"].stateValues.fDefinitions[0],
      );
      let f2 = createFunctionFromDefinition(
        stateVariables["/_curve1"].stateValues.fDefinitions[1],
      );
      expect(f1(-2)).eq(-4 + 1);
      expect(f1(3)).eq(6 + 1);
      expect(f2(-2)).eq(-8 - 2);
      expect(f2(3)).eq(27 - 2);
    });

    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      "{end}{backspace}-3{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "−3");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_curve1"].stateValues.parMin).eq(-10);
      expect(stateVariables["/_curve1"].stateValues.parMax).eq(10);
      let f1 = createFunctionFromDefinition(
        stateVariables["/_curve1"].stateValues.fDefinitions[0],
      );
      let f2 = createFunctionFromDefinition(
        stateVariables["/_curve1"].stateValues.fDefinitions[1],
      );
      expect(f1(-2)).eq(6 + 1);
      expect(f1(3)).eq(-9 + 1);
      expect(f2(-2)).eq(-8 + 3);
      expect(f2(3)).eq(27 + 3);
    });
  });

  it("constrain to parametrized curve", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
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
        <constrainTo>$_curve1</constrainTo>
      </constraints>
    </point>
    
    </graph>
    $_mathinput1.value{assignNames="m1"}
    $_mathinput2.value{assignNames="m2"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for window to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables["/_point1"].stateValues.xs[0];
      let y = stateVariables["/_point1"].stateValues.xs[1];
      expect(x).closeTo(7, 0.5);
      expect(y).closeTo(Math.sin(2 * Math.pow(x, 1 / 3)), 1e-5);
    });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -2, y: 10 },
      });
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables["/_point1"].stateValues.xs[0];
      let y = stateVariables["/_point1"].stateValues.xs[1];
      expect(x).closeTo(0.3, 0.1);
      expect(y).closeTo(Math.sin(2 * Math.pow(x, 1 / 3)), 1e-5);
    });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -10, y: 2 },
      });
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables["/_point1"].stateValues.xs[0];
      let y = stateVariables["/_point1"].stateValues.xs[1];
      expect(x).closeTo(-8, 1e-3);
      expect(y).closeTo(Math.sin(-4), 1e-3);
    });

    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      "{end}{backspace}{backspace}-1{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/m1")).should("contain.text", "−1");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables["/_point1"].stateValues.xs[0];
      let y = stateVariables["/_point1"].stateValues.xs[1];
      expect(x).closeTo(-1, 1e-3);
      expect(y).closeTo(Math.sin(-2), 1e-3);
    });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 10, y: 2 },
      });
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables["/_point1"].stateValues.xs[0];
      let y = stateVariables["/_point1"].stateValues.xs[1];
      expect(x).closeTo(8, 1e-3);
      expect(y).closeTo(Math.sin(4), 1e-3);
    });

    cy.get(cesc("#\\/_mathinput2") + " textarea").type(
      "{end}{backspace}1{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/m2")).should("contain.text", "1");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables["/_point1"].stateValues.xs[0];
      let y = stateVariables["/_point1"].stateValues.xs[1];
      expect(x).closeTo(1, 1e-3);
      expect(y).closeTo(Math.sin(2), 1e-3);
    });
  });

  it("constrain to parametrized curve, from vector-valued function", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <mathinput prefill="-2"/>
    <mathinput prefill="2"/>
    <graph>
    <curve parMin="$_mathinput1" parMax="$_mathinput2">
    <function variables="s">(s^3,sin(2s))</function>
    </curve>
    
    <point x='7' y='1'>
      <constraints>
        <constrainTo>$_curve1</constrainTo>
      </constraints>
    </point>
    
    </graph>
    $_mathinput1.value{assignNames="m1"}
    $_mathinput2.value{assignNames="m2"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for window to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables["/_point1"].stateValues.xs[0];
      let y = stateVariables["/_point1"].stateValues.xs[1];
      expect(x).closeTo(7, 0.5);
      expect(y).closeTo(Math.sin(2 * Math.pow(x, 1 / 3)), 1e-5);
    });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -2, y: 10 },
      });
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables["/_point1"].stateValues.xs[0];
      let y = stateVariables["/_point1"].stateValues.xs[1];
      expect(x).closeTo(0.3, 0.1);
      expect(y).closeTo(Math.sin(2 * Math.pow(x, 1 / 3)), 1e-5);
    });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -10, y: 2 },
      });
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables["/_point1"].stateValues.xs[0];
      let y = stateVariables["/_point1"].stateValues.xs[1];
      expect(x).closeTo(-8, 1e-3);
      expect(y).closeTo(Math.sin(-4), 1e-3);
    });

    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      "{end}{backspace}{backspace}-1{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/m1")).should("contain.text", "−1");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables["/_point1"].stateValues.xs[0];
      let y = stateVariables["/_point1"].stateValues.xs[1];
      expect(x).closeTo(-1, 1e-3);
      expect(y).closeTo(Math.sin(-2), 1e-3);
    });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 10, y: 2 },
      });
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables["/_point1"].stateValues.xs[0];
      let y = stateVariables["/_point1"].stateValues.xs[1];
      expect(x).closeTo(8, 1e-3);
      expect(y).closeTo(Math.sin(4), 1e-3);
    });

    cy.get(cesc("#\\/_mathinput2") + " textarea").type(
      "{end}{backspace}1{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/m2")).should("contain.text", "1");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables["/_point1"].stateValues.xs[0];
      let y = stateVariables["/_point1"].stateValues.xs[1];
      expect(x).closeTo(1, 1e-3);
      expect(y).closeTo(Math.sin(2), 1e-3);
    });
  });

  it("constrain to parametrized curve, from vector-valued function", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <function variables="s">(s^3,sin(2s))</function>
    
    <point x='7' y='1'>
      <constraints>
        <constrainTo>$_function1</constrainTo>
      </constraints>
    </point>
    
    </graph>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for window to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables["/_point1"].stateValues.xs[0];
      let y = stateVariables["/_point1"].stateValues.xs[1];
      expect(x).closeTo(7, 0.5);
      expect(y).closeTo(Math.sin(2 * Math.pow(x, 1 / 3)), 1e-5);
    });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -2, y: 10 },
      });
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables["/_point1"].stateValues.xs[0];
      let y = stateVariables["/_point1"].stateValues.xs[1];
      expect(x).closeTo(0.3, 0.1);
      expect(y).closeTo(Math.sin(2 * Math.pow(x, 1 / 3)), 1e-5);
    });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -10, y: 2 },
      });
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables["/_point1"].stateValues.xs[0];
      let y = stateVariables["/_point1"].stateValues.xs[1];
      expect(x).closeTo(-10, 0.1);
      expect(y).closeTo(Math.sin(-2 * Math.pow(-x, 1 / 3)), 1e-5);
    });
  });

  it("constrain to parametrized curve, different scales from graph", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <setup>
      <function variables="t" name="f">100 cos(t)</function>
      <function variables="t" name="g">0.1 sin(t)</function>
    </setup>

    <graph xmin="-110" xmax="110" ymin="-0.11" ymax="0.11">
      <curve name="c">
        $f
        $g
      </curve>
      <point x="1" y="0.001" name="P">
        <constraints>
          <constrainTo relativeToGraphScales>$c</constrainTo>
        </constraints>
      </point>
    </graph>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for window to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables["/P"].stateValues.xs[0];
      let y = stateVariables["/P"].stateValues.xs[1];
      expect(x).closeTo(100 / Math.sqrt(2), 1e-4);
      expect(y).closeTo(0.1 / Math.sqrt(2), 1e-4);
    });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -200, y: 0.8 },
      });
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables["/P"].stateValues.xs[0];
      let y = stateVariables["/P"].stateValues.xs[1];
      expect(x).closeTo(-100 / Math.sqrt(17), 1e-4);
      expect(y).closeTo((0.1 * 4) / Math.sqrt(17), 1e-4);
    });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -2, y: -0.001 },
      });
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables["/P"].stateValues.xs[0];
      let y = stateVariables["/P"].stateValues.xs[1];
      expect(x).closeTo((-100 * 2) / Math.sqrt(5), 1e-4);
      expect(y).closeTo(-0.1 / Math.sqrt(5), 1e-4);
    });
  });
});
