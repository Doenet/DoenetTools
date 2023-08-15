import me from "math-expressions";
import { cesc, cesc2 } from "../../../../src/_utils/url";

describe("SelectRandomNumbers Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("no parameters, select single uniform random number from 0 to 1", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template><selectrandomnumbers/></template>
      <sources><sequence length="100" /></sources>
    </map>
    </aslist></p>

    <p><aslist>
      $_map1{name="map2"}
    </aslist></p>

    $_p1{name="p"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables["/_map1"].replacements.map(
        (x) =>
          stateVariables[
            stateVariables[
              stateVariables[x.componentName].replacements[0].componentName
            ].replacements[0].componentName
          ].stateValues.value,
      );

      expect(samples.length).eq(100);

      for (let sample of samples) {
        expect(sample).gt(0);
        expect(sample).lte(1);
      }

      let meanX = me.math.mean(samples);
      let varX = me.math.variance(samples, "uncorrected");

      expect(meanX).closeTo(0.5, 0.05);
      expect(varX).closeTo(1 / 12, 0.02);

      let firstSelect =
        stateVariables[
          stateVariables[stateVariables["/_map1"].replacements[0].componentName]
            .replacements[0].componentName
        ];
      expect(firstSelect.stateValues.mean).closeTo(0.5, 1e-10);
      expect(firstSelect.stateValues.variance).closeTo(1 / 12, 1e-10);
      expect(firstSelect.stateValues.standardDeviation).closeTo(
        Math.sqrt(1 / 12),
        1e-10,
      );

      let copiedSamples = stateVariables["/map2"].replacements.map(
        (x) =>
          stateVariables[
            stateVariables[
              stateVariables[x.componentName].replacements[0].componentName
            ].replacements[0].componentName
          ].stateValues.value,
      );
      expect(copiedSamples).eqls(samples);

      let copiedCopiedSamples = stateVariables[
        stateVariables["/p"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedCopiedSamples).eqls(samples);
    });
  });

  it("select five uniform random numbers from 0 to 8, only to specified", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template><selectrandomnumbers type="uniform" numToSelect="5" to="8" /></template>
      <sources><sequence length="20" /></sources>
    </map>
    </aslist></p>

    <p><aslist>
      $_map1{name="map2"}
    </aslist></p>

    $_p1{name="p"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables["/_map1"].replacements.reduce(
        (a, c) => [
          ...a,
          ...stateVariables[
            stateVariables[c.componentName].replacements[0].componentName
          ].replacements.map(
            (y) => stateVariables[y.componentName].stateValues.value,
          ),
        ],
        [],
      );
      expect(samples.length).eq(100);

      for (let sample of samples) {
        expect(sample).gt(0);
        expect(sample).lte(8);
      }

      let meanX = me.math.mean(samples);
      let varX = me.math.variance(samples, "uncorrected");

      expect(meanX).closeTo(4, 0.5);
      expect(varX).closeTo(8 ** 2 / 12, 1);

      let firstSelect =
        stateVariables[
          stateVariables[stateVariables["/_map1"].replacements[0].componentName]
            .replacements[0].componentName
        ];
      expect(firstSelect.stateValues.mean).closeTo(4, 1e-10);
      expect(firstSelect.stateValues.variance).closeTo(8 ** 2 / 12, 1e-10);
      expect(firstSelect.stateValues.standardDeviation).closeTo(
        Math.sqrt(8 ** 2 / 12),
        1e-10,
      );

      let copiedSamples = stateVariables["/map2"].replacements.reduce(
        (a, c) => [
          ...a,
          ...stateVariables[
            stateVariables[c.componentName].replacements[0].componentName
          ].replacements.map(
            (y) => stateVariables[y.componentName].stateValues.value,
          ),
        ],
        [],
      );
      expect(copiedSamples).eqls(samples);

      let copiedCopiedSamples = stateVariables[
        stateVariables["/p"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedCopiedSamples).eqls(samples);
    });
  });

  it("select five uniform random numbers from -5 to -4, only from specified", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template><selectrandomnumbers type="uniform" numToSelect="5" from="-5" /></template>
      <sources><sequence length="20" /></sources>
    </map>
    </aslist></p>

    <p><aslist>
      $_map1{name="map2"}
    </aslist></p>

    $_p1{name="p"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables["/_map1"].replacements.reduce(
        (a, c) => [
          ...a,
          ...stateVariables[
            stateVariables[c.componentName].replacements[0].componentName
          ].replacements.map(
            (y) => stateVariables[y.componentName].stateValues.value,
          ),
        ],
        [],
      );
      expect(samples.length).eq(100);

      for (let sample of samples) {
        expect(sample).gt(-5);
        expect(sample).lte(-4);
      }

      let meanX = me.math.mean(samples);
      let varX = me.math.variance(samples, "uncorrected");

      expect(meanX).closeTo(-4.5, 0.05);
      expect(varX).closeTo(1 / 12, 0.02);

      let firstSelect =
        stateVariables[
          stateVariables[stateVariables["/_map1"].replacements[0].componentName]
            .replacements[0].componentName
        ];
      expect(firstSelect.stateValues.mean).closeTo(-4.5, 1e-10);
      expect(firstSelect.stateValues.variance).closeTo(1 / 12, 1e-10);
      expect(firstSelect.stateValues.standardDeviation).closeTo(
        Math.sqrt(1 / 12),
        1e-10,
      );

      let copiedSamples = stateVariables["/map2"].replacements.reduce(
        (a, c) => [
          ...a,
          ...stateVariables[
            stateVariables[c.componentName].replacements[0].componentName
          ].replacements.map(
            (y) => stateVariables[y.componentName].stateValues.value,
          ),
        ],
        [],
      );
      expect(copiedSamples).eqls(samples);

      let copiedCopiedSamples = stateVariables[
        stateVariables["/p"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedCopiedSamples).eqls(samples);
    });
  });

  it("select ten uniform random numbers from -4 to -2", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template><selectrandomnumbers numToSelect="10" from="-4" to="-2" /></template>
      <sources><sequence length="10" /></sources>
    </map>
    </aslist></p>

    <p><aslist>
      $_map1{name="map2"}
    </aslist></p>

    $_p1{name="p"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables["/_map1"].replacements.reduce(
        (a, c) => [
          ...a,
          ...stateVariables[
            stateVariables[c.componentName].replacements[0].componentName
          ].replacements.map(
            (y) => stateVariables[y.componentName].stateValues.value,
          ),
        ],
        [],
      );
      expect(samples.length).eq(100);

      for (let sample of samples) {
        expect(sample).gt(-4);
        expect(sample).lte(-2);
      }

      let meanX = me.math.mean(samples);
      let varX = me.math.variance(samples, "uncorrected");

      expect(meanX).closeTo(-3, 0.5);
      expect(varX).closeTo(2 ** 2 / 12, 0.5);

      let firstSelect =
        stateVariables[
          stateVariables[stateVariables["/_map1"].replacements[0].componentName]
            .replacements[0].componentName
        ];
      expect(firstSelect.stateValues.mean).closeTo(-3, 1e-10);
      expect(firstSelect.stateValues.variance).closeTo(2 ** 2 / 12, 1e-10);
      expect(firstSelect.stateValues.standardDeviation).closeTo(
        Math.sqrt(2 ** 2 / 12),
        1e-10,
      );

      let copiedSamples = stateVariables["/_map1"].replacements.reduce(
        (a, c) => [
          ...a,
          ...stateVariables[
            stateVariables[c.componentName].replacements[0].componentName
          ].replacements.map(
            (y) => stateVariables[y.componentName].stateValues.value,
          ),
        ],
        [],
      );
      expect(copiedSamples).eqls(samples);

      let copiedCopiedSamples = stateVariables[
        stateVariables["/p"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedCopiedSamples).eqls(samples);
    });
  });

  it("select ten uniform random numbers from -2 to -4", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template><selectrandomnumbers numToSelect="10" from="-2" to="-4" /></template>
      <sources><sequence length="10" /></sources>
    </map>
    </aslist></p>

    <p><aslist>
      $_map1{name="map2"}
    </aslist></p>

    $_p1{name="p"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables["/_map1"].replacements.reduce(
        (a, c) => [
          ...a,
          ...stateVariables[
            stateVariables[c.componentName].replacements[0].componentName
          ].replacements.map(
            (y) => stateVariables[y.componentName].stateValues.value,
          ),
        ],
        [],
      );
      expect(samples.length).eq(100);

      for (let sample of samples) {
        expect(sample).gt(-4);
        expect(sample).lte(-2);
      }

      let meanX = me.math.mean(samples);
      let varX = me.math.variance(samples, "uncorrected");

      expect(meanX).closeTo(-3, 0.5);
      expect(varX).closeTo(2 ** 2 / 12, 0.5);

      let firstSelect =
        stateVariables[
          stateVariables[stateVariables["/_map1"].replacements[0].componentName]
            .replacements[0].componentName
        ];
      expect(firstSelect.stateValues.mean).closeTo(-3, 1e-10);
      expect(firstSelect.stateValues.variance).closeTo(2 ** 2 / 12, 1e-10);
      expect(firstSelect.stateValues.standardDeviation).closeTo(
        Math.sqrt(2 ** 2 / 12),
        1e-10,
      );

      let copiedSamples = stateVariables["/_map1"].replacements.reduce(
        (a, c) => [
          ...a,
          ...stateVariables[
            stateVariables[c.componentName].replacements[0].componentName
          ].replacements.map(
            (y) => stateVariables[y.componentName].stateValues.value,
          ),
        ],
        [],
      );
      expect(copiedSamples).eqls(samples);

      let copiedCopiedSamples = stateVariables[
        stateVariables["/p"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedCopiedSamples).eqls(samples);
    });
  });

  it("select twenty continuous standard normals, no parameters", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template><selectrandomnumbers type="gaussian" numToSelect="20" /></template>
      <sources><sequence length="5" /></sources>
    </map>
    </aslist></p>

    <p><aslist>
      $_map1{name="map2"}
    </aslist></p>

    $_p1{name="p"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables["/_map1"].replacements.reduce(
        (a, c) => [
          ...a,
          ...stateVariables[
            stateVariables[c.componentName].replacements[0].componentName
          ].replacements.map(
            (y) => stateVariables[y.componentName].stateValues.value,
          ),
        ],
        [],
      );
      expect(samples.length).eq(100);

      let meanX = me.math.mean(samples);
      let varX = me.math.variance(samples, "uncorrected");

      expect(meanX).closeTo(0, 0.2);
      expect(varX).closeTo(1, 0.5);

      let firstSelect =
        stateVariables[
          stateVariables[stateVariables["/_map1"].replacements[0].componentName]
            .replacements[0].componentName
        ];
      expect(firstSelect.stateValues.mean).closeTo(0, 1e-10);
      expect(firstSelect.stateValues.variance).closeTo(1, 1e-10);
      expect(firstSelect.stateValues.standardDeviation).closeTo(
        Math.sqrt(1),
        1e-10,
      );

      let copiedSamples = stateVariables["/_map1"].replacements.reduce(
        (a, c) => [
          ...a,
          ...stateVariables[
            stateVariables[c.componentName].replacements[0].componentName
          ].replacements.map(
            (y) => stateVariables[y.componentName].stateValues.value,
          ),
        ],
        [],
      );
      expect(copiedSamples).eqls(samples);

      let copiedCopiedSamples = stateVariables[
        stateVariables["/p"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedCopiedSamples).eqls(samples);
    });
  });

  it("select five continuous standard normals, unspecified mean 0, standard deviation 10", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template><selectrandomnumbers type="gaussian" numToSelect="5" standardDeviation="10" /></template>
      <sources><sequence length="20" /></sources>
    </map>
    </aslist></p>

    <p><aslist>
      $_map1{name="map2"}
    </aslist></p>

    $_p1{name="p"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables["/_map1"].replacements.reduce(
        (a, c) => [
          ...a,
          ...stateVariables[
            stateVariables[c.componentName].replacements[0].componentName
          ].replacements.map(
            (y) => stateVariables[y.componentName].stateValues.value,
          ),
        ],
        [],
      );
      expect(samples.length).eq(100);

      let meanX = me.math.mean(samples);
      let varX = me.math.variance(samples, "uncorrected");

      expect(meanX).closeTo(0, 3);
      expect(varX).closeTo(100, 15);

      let firstSelect =
        stateVariables[
          stateVariables[stateVariables["/_map1"].replacements[0].componentName]
            .replacements[0].componentName
        ];
      expect(firstSelect.stateValues.mean).closeTo(0, 1e-10);
      expect(firstSelect.stateValues.variance).closeTo(100, 1e-10);
      expect(firstSelect.stateValues.standardDeviation).closeTo(
        Math.sqrt(100),
        1e-10,
      );

      let copiedSamples = stateVariables["/_map1"].replacements.reduce(
        (a, c) => [
          ...a,
          ...stateVariables[
            stateVariables[c.componentName].replacements[0].componentName
          ].replacements.map(
            (y) => stateVariables[y.componentName].stateValues.value,
          ),
        ],
        [],
      );
      expect(copiedSamples).eqls(samples);

      let copiedCopiedSamples = stateVariables[
        stateVariables["/p"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedCopiedSamples).eqls(samples);
    });
  });

  it("select single continuous standard normal, mean -50, unspecified standard deviation 1", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template><selectrandomnumbers type="gaussian" mean="-50" /></template>
      <sources><sequence length="100" /></sources>
    </map>
    </aslist></p>

    <p><aslist>
      $_map1{name="map2"}
    </aslist></p>

    $_p1{name="p"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables["/_map1"].replacements.reduce(
        (a, c) => [
          ...a,
          ...stateVariables[
            stateVariables[c.componentName].replacements[0].componentName
          ].replacements.map(
            (y) => stateVariables[y.componentName].stateValues.value,
          ),
        ],
        [],
      );
      expect(samples.length).eq(100);

      let meanX = me.math.mean(samples);
      let varX = me.math.variance(samples, "uncorrected");

      expect(meanX).closeTo(-50, 0.5);
      expect(varX).closeTo(1, 0.3);

      let firstSelect =
        stateVariables[
          stateVariables[stateVariables["/_map1"].replacements[0].componentName]
            .replacements[0].componentName
        ];
      expect(firstSelect.stateValues.mean).closeTo(-50, 1e-10);
      expect(firstSelect.stateValues.variance).closeTo(1, 1e-10);
      expect(firstSelect.stateValues.standardDeviation).closeTo(
        Math.sqrt(1),
        1e-10,
      );

      let copiedSamples = stateVariables["/_map1"].replacements.reduce(
        (a, c) => [
          ...a,
          ...stateVariables[
            stateVariables[c.componentName].replacements[0].componentName
          ].replacements.map(
            (y) => stateVariables[y.componentName].stateValues.value,
          ),
        ],
        [],
      );
      expect(copiedSamples).eqls(samples);

      let copiedCopiedSamples = stateVariables[
        stateVariables["/p"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedCopiedSamples).eqls(samples);
    });
  });

  it("select twenty continuous standard normals, mean 100, standard deviation 10", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template><selectrandomnumbers type="gaussian" numToSelect="20" mean="100" standardDeviation="10" /></template>
      <sources><sequence length="5" /></sources>
    </map>
    </aslist></p>

    <p><aslist>
      $_map1{name="map2"}
    </aslist></p>

    $_p1{name="p"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables["/_map1"].replacements.reduce(
        (a, c) => [
          ...a,
          ...stateVariables[
            stateVariables[c.componentName].replacements[0].componentName
          ].replacements.map(
            (y) => stateVariables[y.componentName].stateValues.value,
          ),
        ],
        [],
      );
      expect(samples.length).eq(100);

      let meanX = me.math.mean(samples);
      let varX = me.math.variance(samples, "uncorrected");

      expect(meanX).closeTo(100, 2);
      expect(varX).closeTo(100, 30);

      let firstSelect =
        stateVariables[
          stateVariables[stateVariables["/_map1"].replacements[0].componentName]
            .replacements[0].componentName
        ];
      expect(firstSelect.stateValues.mean).closeTo(100, 1e-10);
      expect(firstSelect.stateValues.variance).closeTo(100, 1e-10);
      expect(firstSelect.stateValues.standardDeviation).closeTo(
        Math.sqrt(100),
        1e-10,
      );

      let copiedSamples = stateVariables["/_map1"].replacements.reduce(
        (a, c) => [
          ...a,
          ...stateVariables[
            stateVariables[c.componentName].replacements[0].componentName
          ].replacements.map(
            (y) => stateVariables[y.componentName].stateValues.value,
          ),
        ],
        [],
      );
      expect(copiedSamples).eqls(samples);

      let copiedCopiedSamples = stateVariables[
        stateVariables["/p"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedCopiedSamples).eqls(samples);
    });
  });

  it("select twenty continuous standard normals, mean -3, variance 0.01", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template><selectrandomnumbers type="gaussian" numToSelect="20" mean="-3" variance="0.01" /></template>
      <sources><sequence length="5" /></sources>
    </map>
    </aslist></p>

    <p><aslist>
      $_map1{name="map2"}
    </aslist></p>

    $_p1{name="p"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables["/_map1"].replacements.reduce(
        (a, c) => [
          ...a,
          ...stateVariables[
            stateVariables[c.componentName].replacements[0].componentName
          ].replacements.map(
            (y) => stateVariables[y.componentName].stateValues.value,
          ),
        ],
        [],
      );
      expect(samples.length).eq(100);

      let meanX = me.math.mean(samples);
      let varX = me.math.variance(samples, "uncorrected");

      expect(meanX).closeTo(-3, 0.1);
      expect(varX).closeTo(0.01, 0.005);

      let firstSelect =
        stateVariables[
          stateVariables[stateVariables["/_map1"].replacements[0].componentName]
            .replacements[0].componentName
        ];
      expect(firstSelect.stateValues.mean).closeTo(-3, 1e-10);
      expect(firstSelect.stateValues.variance).closeTo(0.01, 1e-10);
      expect(firstSelect.stateValues.standardDeviation).closeTo(
        Math.sqrt(0.01),
        1e-10,
      );

      let copiedSamples = stateVariables["/_map1"].replacements.reduce(
        (a, c) => [
          ...a,
          ...stateVariables[
            stateVariables[c.componentName].replacements[0].componentName
          ].replacements.map(
            (y) => stateVariables[y.componentName].stateValues.value,
          ),
        ],
        [],
      );
      expect(copiedSamples).eqls(samples);

      let copiedCopiedSamples = stateVariables[
        stateVariables["/p"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedCopiedSamples).eqls(samples);
    });
  });

  it("select single discrete uniform, no parameters, integer from 0 to 1", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template><selectrandomnumbers type="discreteUniform" /></template>
      <sources><sequence length="100" /></sources>
    </map>
    </aslist></p>

    <p><aslist>
      $_map1{name="map2"}
    </aslist></p>

    $_p1{name="p"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables["/_map1"].replacements.reduce(
        (a, c) => [
          ...a,
          ...stateVariables[
            stateVariables[c.componentName].replacements[0].componentName
          ].replacements.map(
            (y) => stateVariables[y.componentName].stateValues.value,
          ),
        ],
        [],
      );
      expect(samples.length).eq(100);

      for (let sample of samples) {
        expect([0, 1].includes(sample)).eq(true);
      }

      let meanX = me.math.mean(samples);
      let varX = me.math.variance(samples, "uncorrected");

      expect(meanX).closeTo(0.5, 0.15);
      expect(varX).closeTo((2 ** 2 - 1) / 12, 0.05);

      let firstSelect =
        stateVariables[
          stateVariables[stateVariables["/_map1"].replacements[0].componentName]
            .replacements[0].componentName
        ];
      expect(firstSelect.stateValues.mean).closeTo(0.5, 1e-10);
      expect(firstSelect.stateValues.variance).closeTo(
        (2 ** 2 - 1) / 12,
        1e-10,
      );
      expect(firstSelect.stateValues.standardDeviation).closeTo(
        Math.sqrt((2 ** 2 - 1) / 12),
        1e-10,
      );

      let copiedSamples = stateVariables["/_map1"].replacements.reduce(
        (a, c) => [
          ...a,
          ...stateVariables[
            stateVariables[c.componentName].replacements[0].componentName
          ].replacements.map(
            (y) => stateVariables[y.componentName].stateValues.value,
          ),
        ],
        [],
      );
      expect(copiedSamples).eqls(samples);

      let copiedCopiedSamples = stateVariables[
        stateVariables["/p"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedCopiedSamples).eqls(samples);
    });
  });

  it("select single discrete uniform, from 0.5 to 5.5, only to specified", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template><selectrandomnumbers type="discreteUniform" to="5.5" /></template>
      <sources><sequence length="100" /></sources>
    </map>
    </aslist></p>

    <p><aslist>
      $_map1{name="map2"}
    </aslist></p>

    $_p1{name="p"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables["/_map1"].replacements.reduce(
        (a, c) => [
          ...a,
          ...stateVariables[
            stateVariables[c.componentName].replacements[0].componentName
          ].replacements.map(
            (y) => stateVariables[y.componentName].stateValues.value,
          ),
        ],
        [],
      );
      expect(samples.length).eq(100);

      for (let sample of samples) {
        expect([0.5, 1.5, 2.5, 3.5, 4.5, 5.5].includes(sample)).eq(true);
      }

      let meanX = me.math.mean(samples);
      let varX = me.math.variance(samples, "uncorrected");

      expect(meanX).closeTo(3, 0.2);
      expect(varX).closeTo((6 ** 2 - 1) / 12, 1);

      let firstSelect =
        stateVariables[
          stateVariables[stateVariables["/_map1"].replacements[0].componentName]
            .replacements[0].componentName
        ];
      expect(firstSelect.stateValues.mean).closeTo(3, 1e-10);
      expect(firstSelect.stateValues.variance).closeTo(
        (6 ** 2 - 1) / 12,
        1e-10,
      );
      expect(firstSelect.stateValues.standardDeviation).closeTo(
        Math.sqrt((6 ** 2 - 1) / 12),
        1e-10,
      );

      let copiedSamples = stateVariables["/_map1"].replacements.reduce(
        (a, c) => [
          ...a,
          ...stateVariables[
            stateVariables[c.componentName].replacements[0].componentName
          ].replacements.map(
            (y) => stateVariables[y.componentName].stateValues.value,
          ),
        ],
        [],
      );
      expect(copiedSamples).eqls(samples);

      let copiedCopiedSamples = stateVariables[
        stateVariables["/p"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedCopiedSamples).eqls(samples);
    });
  });

  it("select single discrete uniform, from 8.5 to 9.5, only from specified", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template><selectrandomnumbers type="discreteUniform" from="8.5" /></template>
      <sources><sequence length="100" /></sources>
    </map>
    </aslist></p>

    <p><aslist>
      $_map1{name="map2"}
    </aslist></p>

    $_p1{name="p"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables["/_map1"].replacements.reduce(
        (a, c) => [
          ...a,
          ...stateVariables[
            stateVariables[c.componentName].replacements[0].componentName
          ].replacements.map(
            (y) => stateVariables[y.componentName].stateValues.value,
          ),
        ],
        [],
      );
      expect(samples.length).eq(100);

      for (let sample of samples) {
        expect([8.5, 9.5].includes(sample)).eq(true);
      }

      let meanX = me.math.mean(samples);
      let varX = me.math.variance(samples, "uncorrected");

      expect(meanX).closeTo(9, 0.1);
      expect(varX).closeTo((2 ** 2 - 1) / 12, 0.05);

      let firstSelect =
        stateVariables[
          stateVariables[stateVariables["/_map1"].replacements[0].componentName]
            .replacements[0].componentName
        ];
      expect(firstSelect.stateValues.mean).closeTo(9, 1e-10);
      expect(firstSelect.stateValues.variance).closeTo(
        (2 ** 2 - 1) / 12,
        1e-10,
      );
      expect(firstSelect.stateValues.standardDeviation).closeTo(
        Math.sqrt((2 ** 2 - 1) / 12),
        1e-10,
      );

      let copiedSamples = stateVariables["/_map1"].replacements.reduce(
        (a, c) => [
          ...a,
          ...stateVariables[
            stateVariables[c.componentName].replacements[0].componentName
          ].replacements.map(
            (y) => stateVariables[y.componentName].stateValues.value,
          ),
        ],
        [],
      );
      expect(copiedSamples).eqls(samples);

      let copiedCopiedSamples = stateVariables[
        stateVariables["/p"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedCopiedSamples).eqls(samples);
    });
  });

  it("select five integers from -3 to 5", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template><selectrandomnumbers type="discreteUniform" from="-3" to="5" numToSelect="5" /></template>
      <sources><sequence length="20" /></sources>
    </map>
    </aslist></p>

    <p><aslist>
      $_map1{name="map2"}
    </aslist></p>

    $_p1{name="p"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables["/_map1"].replacements.reduce(
        (a, c) => [
          ...a,
          ...stateVariables[
            stateVariables[c.componentName].replacements[0].componentName
          ].replacements.map(
            (y) => stateVariables[y.componentName].stateValues.value,
          ),
        ],
        [],
      );
      expect(samples.length).eq(100);

      for (let sample of samples) {
        expect([-3, -2, -1, 0, 1, 2, 3, 4, 5].includes(sample)).eq(true);
      }

      let meanX = me.math.mean(samples);
      let varX = me.math.variance(samples, "uncorrected");

      expect(meanX).closeTo(1, 0.4);
      expect(varX).closeTo((9 ** 2 - 1) / 12, 1);

      let firstSelect =
        stateVariables[
          stateVariables[stateVariables["/_map1"].replacements[0].componentName]
            .replacements[0].componentName
        ];
      expect(firstSelect.stateValues.mean).closeTo(1, 1e-10);
      expect(firstSelect.stateValues.variance).closeTo(
        (9 ** 2 - 1) / 12,
        1e-10,
      );
      expect(firstSelect.stateValues.standardDeviation).closeTo(
        Math.sqrt((9 ** 2 - 1) / 12),
        1e-10,
      );

      let copiedSamples = stateVariables["/_map1"].replacements.reduce(
        (a, c) => [
          ...a,
          ...stateVariables[
            stateVariables[c.componentName].replacements[0].componentName
          ].replacements.map(
            (y) => stateVariables[y.componentName].stateValues.value,
          ),
        ],
        [],
      );
      expect(copiedSamples).eqls(samples);

      let copiedCopiedSamples = stateVariables[
        stateVariables["/p"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedCopiedSamples).eqls(samples);
    });
  });

  it("select five integers from 5 to -3 gives nothing", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template><selectrandomnumbers type="discreteUniform" from="5" to="-3" numToSelect="5" /></template>
      <sources><sequence length="20" /></sources>
    </map>
    </aslist></p>

    <p><aslist>
      $_map1{name="map2"}
    </aslist></p>

    $_p1{name="p"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables["/_map1"].replacements.reduce(
        (a, c) => [
          ...a,
          ...stateVariables[
            stateVariables[c.componentName].replacements[0].componentName
          ].replacements.map(
            (y) => stateVariables[y.componentName].stateValues.value,
          ),
        ],
        [],
      );
      expect(samples.length).eq(0);

      let copiedSamples = stateVariables["/_map1"].replacements.reduce(
        (a, c) => [
          ...a,
          ...stateVariables[
            stateVariables[c.componentName].replacements[0].componentName
          ].replacements.map(
            (y) => stateVariables[y.componentName].stateValues.value,
          ),
        ],
        [],
      );
      expect(copiedSamples).eqls(samples);

      let copiedCopiedSamples = stateVariables[
        stateVariables["/p"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedCopiedSamples).eqls(samples);
    });
  });

  it("select 10 odd integers from -3 to 5", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template><selectrandomnumbers type="discreteUniform" from="-3" to="5" numToSelect="10" step="2" /></template>
      <sources><sequence length="10" /></sources>
    </map>
    </aslist></p>

    <p><aslist>
      $_map1{name="map2"}
    </aslist></p>

    $_p1{name="p"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables["/_map1"].replacements.reduce(
        (a, c) => [
          ...a,
          ...stateVariables[
            stateVariables[c.componentName].replacements[0].componentName
          ].replacements.map(
            (y) => stateVariables[y.componentName].stateValues.value,
          ),
        ],
        [],
      );
      expect(samples.length).eq(100);

      for (let sample of samples) {
        expect([-3, -1, 1, 3, 5].includes(sample)).eq(true);
      }

      let meanX = me.math.mean(samples);
      let varX = me.math.variance(samples, "uncorrected");

      expect(meanX).closeTo(1, 0.6);
      expect(varX).closeTo(((5 ** 2 - 1) * 2 ** 2) / 12, 1);

      let firstSelect =
        stateVariables[
          stateVariables[stateVariables["/_map1"].replacements[0].componentName]
            .replacements[0].componentName
        ];
      expect(firstSelect.stateValues.mean).closeTo(1, 1e-10);
      expect(firstSelect.stateValues.variance).closeTo(
        ((5 ** 2 - 1) * 2 ** 2) / 12,
        1e-10,
      );
      expect(firstSelect.stateValues.standardDeviation).closeTo(
        Math.sqrt(((5 ** 2 - 1) * 2 ** 2) / 12),
        1e-10,
      );

      let copiedSamples = stateVariables["/_map1"].replacements.reduce(
        (a, c) => [
          ...a,
          ...stateVariables[
            stateVariables[c.componentName].replacements[0].componentName
          ].replacements.map(
            (y) => stateVariables[y.componentName].stateValues.value,
          ),
        ],
        [],
      );
      expect(copiedSamples).eqls(samples);

      let copiedCopiedSamples = stateVariables[
        stateVariables["/p"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedCopiedSamples).eqls(samples);
    });
  });

  it("asList", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><selectRandomNumbers name="s" from="175" to="205" assignnames="u v w x y" numToSelect="5" /></p>
    <p><selectRandomNumbers copySource="s" name="s2" asList="false" /></p>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    let results = [];

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      results.push(stateVariables["/u"].stateValues.value);
      results.push(stateVariables["/v"].stateValues.value);
      results.push(stateVariables["/w"].stateValues.value);
      results.push(stateVariables["/x"].stateValues.value);
      results.push(stateVariables["/y"].stateValues.value);

      for (let num of results) {
        expect(num).gte(175).lte(205);
      }

      let roundedResults = results.map((x) => Math.round(x * 100) / 100);
      cy.get(cesc2("#/_p1")).should("have.text", roundedResults.join(", "));
      cy.get(cesc2("#/_p2")).should("have.text", roundedResults.join(""));
    });
  });

  it("selected number doesn't change dynamically", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <mathinput prefill="20" name="numToSelect"/>
    <mathinput prefill="10" name="maxnum"/>
    <p><aslist>
    <selectRandomNumbers name="sample1" to="$maxnum" numToSelect="$numToSelect" />
    </aslist></p>

    <mathinput prefill="10" name="numToSelect2"/>
    <mathinput prefill="4" name="maxnum2"/>
    <p><aslist>
    <selectRandomNumbers type="discreteUniform" name="sample2" to="$maxnum2" numToSelect="$numToSelect2" />
    </aslist></p>
    <p>$maxnum2{name="maxnum2a"}</p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    let sample1numbers, sample2numbers;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let sample1replacements = stateVariables["/sample1"].replacements;
      let sample2replacements = stateVariables["/sample2"].replacements;
      expect(sample1replacements.length).eq(20);
      expect(sample2replacements.length).eq(10);
      sample1numbers = sample1replacements.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      sample2numbers = sample2replacements.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );

      for (let num of sample1numbers) {
        expect(num).gte(0);
        expect(num).lt(10);
      }
      for (let num of sample2numbers) {
        expect([0, 1, 2, 3, 4].includes(num)).eq(true);
      }
    });

    cy.log("Nothing changes when change mathinputs");
    cy.get(cesc("#\\/numToSelect") + " textarea").type(
      `{end}{backspace}{backspace}7{enter}`,
      { force: true },
    );
    cy.get(cesc("#\\/maxnum") + " textarea").type(
      `{end}{backspace}{backspace}11{enter}`,
      { force: true },
    );
    cy.get(cesc("#\\/numToSelect2") + " textarea").type(
      `{end}{backspace}{backspace}15{enter}`,
      { force: true },
    );
    cy.get(cesc("#\\/maxnum2") + " textarea").type(
      `{end}{backspace}{backspace}18{enter}`,
      { force: true },
    );
    cy.get(cesc("#\\/maxnum2a")).should("contain.text", "18");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let sample1replacements = stateVariables["/sample1"].replacements;
      let sample2replacements = stateVariables["/sample2"].replacements;

      expect(
        sample1replacements.map(
          (x) => stateVariables[x.componentName].stateValues.value,
        ),
      ).eqls(sample1numbers);
      expect(
        sample2replacements.map(
          (x) => stateVariables[x.componentName].stateValues.value,
        ),
      ).eqls(sample2numbers);
    });
  });

  it("random number doesn't resample in dynamic map", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    How many numbers do you want? <mathinput />
    <p name="p1"><aslist>
    <map assignnames="a b c d e f">
      <template newNamespace>
        <selectRandomNumbers assignnames="n" />
      </template>
      <sources>
      <sequence length="$_mathinput1" />
      </sources>
    </map>
    </aslist></p>
    
    <p name="p2"><aslist>$_map1{name="map2"}</aslist></p>
    <p name="p3">$_aslist1</p>

    $p1{name="p4"}
    $p2{name="p5"}
    $p3{name="p6"}

    $p4{name="p7"}
    $p5{name="p8"}
    $p6{name="p9"}
    <p>$_mathinput1{name="m1"}</p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    let samplednumbers = [];

    cy.log("initially nothing");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        stateVariables[stateVariables["/p1"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p2"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p3"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p4"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p5"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p6"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p7"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p8"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p9"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
    });

    cy.log("sample one variable");
    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      `{end}{backspace}1{enter}`,
      { force: true },
    );
    cy.get(cesc("#\\/m1")).should("contain.text", "1");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let n1 = stateVariables["/a/n"].stateValues.value;
      samplednumbers.push(n1);
      expect(
        stateVariables[stateVariables["/p1"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[stateVariables["/p2"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[stateVariables["/p3"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[stateVariables["/p4"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[stateVariables["/p5"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[stateVariables["/p6"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[stateVariables["/p7"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[stateVariables["/p8"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[stateVariables["/p9"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(1);
      for (let ind = 0; ind < 1; ind++) {
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p1"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p2"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p3"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p4"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p5"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p6"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p7"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p8"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p9"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
      }
    });

    cy.log("go back to nothing");
    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      `{end}{backspace}0{enter}`,
      { force: true },
    );
    cy.get(cesc("#\\/m1")).should("contain.text", "0");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        stateVariables[stateVariables["/p1"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p2"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p3"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p4"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p5"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p6"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p7"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p8"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p9"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
    });

    cy.log("get same number back");
    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      `{end}{backspace}1{enter}`,
      { force: true },
    );
    cy.get(cesc("#\\/m1")).should("contain.text", "1");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let n1 = stateVariables["/a/n"].stateValues.value;
      expect(n1).eq(samplednumbers[0]);
      expect(
        stateVariables[stateVariables["/p1"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[stateVariables["/p2"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[stateVariables["/p3"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[stateVariables["/p4"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[stateVariables["/p5"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[stateVariables["/p6"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[stateVariables["/p7"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[stateVariables["/p8"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[stateVariables["/p9"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(1);

      for (let ind = 0; ind < 1; ind++) {
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p1"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p2"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p3"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p4"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p5"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p6"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p7"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p8"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p9"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
      }
    });

    cy.log("get two more samples");
    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      `{end}{backspace}3{enter}`,
      { force: true },
    );
    cy.get(cesc("#\\/m1")).should("contain.text", "3");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let n1 = stateVariables["/a/n"].stateValues.value;
      let n2 = stateVariables["/b/n"].stateValues.value;
      let n3 = stateVariables["/c/n"].stateValues.value;
      expect(n1).eq(samplednumbers[0]);
      samplednumbers.push(n2);
      samplednumbers.push(n3);
      expect(
        stateVariables[stateVariables["/p1"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(3);
      expect(
        stateVariables[stateVariables["/p2"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(3);
      expect(
        stateVariables[stateVariables["/p3"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(3);
      expect(
        stateVariables[stateVariables["/p4"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(3);
      expect(
        stateVariables[stateVariables["/p5"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(3);
      expect(
        stateVariables[stateVariables["/p6"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(3);
      expect(
        stateVariables[stateVariables["/p7"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(3);
      expect(
        stateVariables[stateVariables["/p8"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(3);
      expect(
        stateVariables[stateVariables["/p9"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(3);
      for (let ind = 0; ind < 3; ind++) {
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p1"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p2"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p3"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p4"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p5"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p6"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p7"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p8"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p9"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
      }
    });

    cy.log("go back to nothing");
    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      `{end}{backspace}0{enter}`,
      { force: true },
    );
    cy.get(cesc("#\\/m1")).should("contain.text", "0");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        stateVariables[stateVariables["/p1"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p2"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p3"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p4"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p5"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p6"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p7"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p8"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p9"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
    });

    cy.log("get first two numbers back");
    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      `{end}{backspace}2{enter}`,
      { force: true },
    );
    cy.get(cesc("#\\/m1")).should("contain.text", "2");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let n1 = stateVariables["/a/n"].stateValues.value;
      let n2 = stateVariables["/b/n"].stateValues.value;
      expect(n1).eq(samplednumbers[0]);
      expect(n2).eq(samplednumbers[1]);
      expect(
        stateVariables[stateVariables["/p1"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(2);
      expect(
        stateVariables[stateVariables["/p2"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(2);
      expect(
        stateVariables[stateVariables["/p3"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(2);
      expect(
        stateVariables[stateVariables["/p4"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(2);
      expect(
        stateVariables[stateVariables["/p5"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(2);
      expect(
        stateVariables[stateVariables["/p6"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(2);
      expect(
        stateVariables[stateVariables["/p7"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(2);
      expect(
        stateVariables[stateVariables["/p8"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(2);
      expect(
        stateVariables[stateVariables["/p9"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(2);

      for (let ind = 0; ind < 2; ind++) {
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p1"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p2"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p3"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p4"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p5"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p6"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p7"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p8"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p9"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
      }
    });

    cy.log("get six total samples");
    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      `{end}{backspace}6{enter}`,
      { force: true },
    );
    cy.get(cesc("#\\/m1")).should("contain.text", "6");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let n1 = stateVariables["/a/n"].stateValues.value;
      let n2 = stateVariables["/b/n"].stateValues.value;
      let n3 = stateVariables["/c/n"].stateValues.value;
      let n4 = stateVariables["/d/n"].stateValues.value;
      let n5 = stateVariables["/e/n"].stateValues.value;
      let n6 = stateVariables["/f/n"].stateValues.value;
      expect(n1).eq(samplednumbers[0]);
      expect(n2).eq(samplednumbers[1]);
      expect(n3).eq(samplednumbers[2]);
      samplednumbers.push(n4);
      samplednumbers.push(n5);
      samplednumbers.push(n6);
      expect(
        stateVariables[stateVariables["/p1"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[stateVariables["/p2"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[stateVariables["/p3"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[stateVariables["/p4"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[stateVariables["/p5"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[stateVariables["/p6"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[stateVariables["/p7"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[stateVariables["/p8"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[stateVariables["/p9"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(6);
      for (let ind = 0; ind < 6; ind++) {
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p1"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p2"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p3"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p4"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p5"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p6"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p7"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p8"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p9"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
      }
    });

    cy.log("go back to nothing");
    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      `{end}{backspace}0{enter}`,
      { force: true },
    );
    cy.get(cesc("#\\/m1")).should("contain.text", "0");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        stateVariables[stateVariables["/p1"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p2"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p3"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p4"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p5"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p6"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p7"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p8"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p9"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
    });

    cy.log("get all six back");
    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      `{end}{backspace}6{enter}`,
      { force: true },
    );
    cy.get(cesc("#\\/m1")).should("contain.text", "6");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let n1 = stateVariables["/a/n"].stateValues.value;
      let n2 = stateVariables["/b/n"].stateValues.value;
      let n3 = stateVariables["/c/n"].stateValues.value;
      let n4 = stateVariables["/d/n"].stateValues.value;
      let n5 = stateVariables["/e/n"].stateValues.value;
      let n6 = stateVariables["/f/n"].stateValues.value;
      expect(n1).eq(samplednumbers[0]);
      expect(n2).eq(samplednumbers[1]);
      expect(n3).eq(samplednumbers[2]);
      expect(n4).eq(samplednumbers[3]);
      expect(n5).eq(samplednumbers[4]);
      expect(n6).eq(samplednumbers[5]);
      expect(
        stateVariables[stateVariables["/p1"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[stateVariables["/p2"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[stateVariables["/p3"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[stateVariables["/p4"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[stateVariables["/p5"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[stateVariables["/p6"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[stateVariables["/p7"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[stateVariables["/p8"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[stateVariables["/p9"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(6);
      for (let ind = 0; ind < 6; ind++) {
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p1"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p2"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p3"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p4"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p5"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p6"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p7"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p8"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p9"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
      }
    });
  });

  it("select single discrete uniform number, assign name", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><selectRandomNumbers type="discreteUniform" from="3" step="7" to="16" assignnames="u"/></p>
    <p><selectRandomNumbers type="discreteUniform" from="3" step="7" to="16" assignnames="v"/></p>
    <p><selectRandomNumbers type="discreteUniform" from="3" step="7" to="16" assignnames="w"/></p>
    <p>$u{name="u2"}</p>
    <p>$v{name="v2"}</p>
    <p>$w{name="w2"}</p>
    `,
        },
        "*",
      );
    });

    let options = [3, 10];

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let u = stateVariables["/u"];
      let u2 = stateVariables["/u2"];

      expect(options.includes(u.stateValues.value)).eq(true);
      expect(u.stateValues.value).eq(u2.stateValues.value);

      let v = stateVariables["/v"];
      let v2 = stateVariables["/v2"];
      expect(options.includes(v.stateValues.value)).eq(true);
      expect(v.stateValues.value).eq(v2.stateValues.value);

      let w = stateVariables["/w"];
      let w2 = stateVariables["/w2"];
      expect(options.includes(w.stateValues.value)).eq(true);
      expect(w.stateValues.value).eq(w2.stateValues.value);
    });
  });

  it("select multiple uniform random numbers, assign names", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><aslist>
      <selectRandomNumbers name="s" from="3" to="13" assignnames="u v w" numToSelect="6" displayDigits="10" />
    </aslist></p>
    <p>$u{name="u2"}</p>
    <p>$v{name="v2"}</p>
    <p>$w{name="w2"}</p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    let results = [];

    for (let ind = 0; ind < 6; ind++) {
      cy.get(cesc("#\\/_p1") + " > :nth-child(" + (2 * ind + 4) + ")")
        .invoke("text")
        .then((text) => {
          let num = Number(text);
          results[ind] = num;
          expect(num).gte(3);
          expect(num).lt(13);
        });
    }

    cy.log("check by name").then(() => {
      cy.get(cesc("#\\/u")).should("have.text", results[0]);
      cy.get(cesc("#\\/u2")).should("have.text", results[0]);
      cy.get(cesc("#\\/v")).should("have.text", results[1]);
      cy.get(cesc("#\\/v2")).should("have.text", results[1]);
      cy.get(cesc("#\\/w")).should("have.text", results[2]);
      cy.get(cesc("#\\/w2")).should("have.text", results[2]);
    });
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let u = stateVariables["/u"];
      let u2 = stateVariables["/u2"];
      expect(u.stateValues.value).closeTo(results[0], 1e-8);
      expect(u2.stateValues.value).closeTo(results[0], 1e-8);

      let v = stateVariables["/v"];
      let v2 = stateVariables["/v2"];
      expect(v.stateValues.value).closeTo(results[1], 1e-8);
      expect(v2.stateValues.value).closeTo(results[1], 1e-8);

      let w = stateVariables["/w"];
      let w2 = stateVariables["/w2"];
      expect(w.stateValues.value).closeTo(results[2], 1e-8);
      expect(w2.stateValues.value).closeTo(results[2], 1e-8);

      let s = stateVariables["/s"];
      expect(s.replacements.length).eq(6);
      for (let ind = 0; ind < 6; ind++) {
        let r = stateVariables[s.replacements[ind].componentName];
        expect(r.stateValues.value).closeTo(results[ind], 1e-8);
      }
    });
  });

  it("select multiple uniform random numbers, assign names, newNamespace", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><aslist>
      <selectRandomNumbers name="s" newnamespace from="3" to="13" assignnames="u v w" numToSelect="6" displayDigits="10"  />
    </aslist></p>
    <p>$(s/u{name="u2"})</p>
    <p>$(s/v{name="v2"})</p>
    <p>$(s/w{name="w2"})</p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    let results = [];

    for (let ind = 0; ind < 6; ind++) {
      cy.get(cesc("#\\/_p1") + " > :nth-child(" + (2 * ind + 4) + ")")
        .invoke("text")
        .then((text) => {
          let num = Number(text);
          results[ind] = num;
          expect(num).gte(3);
          expect(num).lt(13);
        });
    }

    cy.log("check by name").then(() => {
      cy.get(cesc("#\\/s\\/u")).should("have.text", results[0]);
      cy.get(cesc("#\\/u2")).should("have.text", results[0]);
      cy.get(cesc("#\\/s\\/v")).should("have.text", results[1]);
      cy.get(cesc("#\\/v2")).should("have.text", results[1]);
      cy.get(cesc("#\\/s\\/w")).should("have.text", results[2]);
      cy.get(cesc("#\\/w2")).should("have.text", results[2]);
    });
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let u = stateVariables["/s/u"];
      let u2 = stateVariables["/u2"];
      expect(u.stateValues.value).closeTo(results[0], 1e-8);
      expect(u2.stateValues.value).closeTo(results[0], 1e-8);

      let v = stateVariables["/s/v"];
      let v2 = stateVariables["/v2"];
      expect(v.stateValues.value).closeTo(results[1], 1e-8);
      expect(v2.stateValues.value).closeTo(results[1], 1e-8);

      let w = stateVariables["/s/w"];
      let w2 = stateVariables["/w2"];
      expect(w.stateValues.value).closeTo(results[2], 1e-8);
      expect(w2.stateValues.value).closeTo(results[2], 1e-8);

      let s = stateVariables["/s"];
      expect(s.replacements.length).eq(6);
      for (let ind = 0; ind < 6; ind++) {
        let r = stateVariables[s.replacements[ind].componentName];
        expect(r.stateValues.value).closeTo(results[ind], 1e-8);
      }
    });
  });

  it("numToSelect from selectfromsequence", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <p>n1 = <selectFromSequence from="1" to="5" assignNames="n1" /></p>
    <p>nums = <aslist><selectRandomNumbers name="nums1" from="1" to="10" numToSelect="$n1" assignNames="a1 b1 c1 d1 e1" displayDigits="10" /></aslist></p>
    <p name="p1">a1=$a1, b1=$b1, c1=$c1, d1=$d1, e1=$e1</p>

    <p>n2 = <selectFromSequence from="1" to="5" assignNames="n2" /></p>
    <p>nums = <aslist><selectRandomNumbers name="nums2" from="1" to="10" numToSelect="$n2" assignNames="a2 b2 c2 d2 e2" displayDigits="10" /></aslist></p>
    <p name="p2">a2=$a2, b2=$b2, c2=$c2, d2=$d2, e2=$e2</p>

    <p>n3 = <selectFromSequence from="1" to="5" assignNames="n3" /></p>
    <p>nums = <aslist><selectRandomNumbers name="nums3" from="1" to="10" numToSelect="$n3" assignNames="a3 b3 c3 d3 e3" displayDigits="10" /></aslist></p>
    <p name="p3">a3=$a3, b3=$b3, c3=$c3, d3=$d3, e3=$e3</p>

    <p>n4 = <selectFromSequence from="1" to="5" assignNames="n4" /></p>
    <p>nums = <aslist><selectRandomNumbers name="nums4" from="1" to="10" numToSelect="$n4" assignNames="a4 b4 c4 d4 e4" displayDigits="10" /></aslist></p>
    <p name="p4">a4=$a4, b4=$b4, c4=$c4, d4=$d4, e4=$e4</p>

    <p>n5 = <selectFromSequence from="1" to="5" assignNames="n5" /></p>
    <p>nums = <aslist><selectRandomNumbers name="nums5" from="1" to="10" numToSelect="$n5" assignNames="a5 b5 c5 d5 e5" displayDigits="10" /></aslist></p>
    <p name="p5">a5=$a5, b5=$b5, c5=$c5, d5=$d5, e5=$e5</p>
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let n1 = stateVariables["/n1"].stateValues.value;
      let n2 = stateVariables["/n2"].stateValues.value;
      let n3 = stateVariables["/n3"].stateValues.value;
      let n4 = stateVariables["/n4"].stateValues.value;
      let n5 = stateVariables["/n5"].stateValues.value;

      let nums1 = stateVariables["/nums1"].replacements.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      let nums2 = stateVariables["/nums2"].replacements.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      let nums3 = stateVariables["/nums3"].replacements.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      let nums4 = stateVariables["/nums4"].replacements.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      let nums5 = stateVariables["/nums5"].replacements.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );

      expect(nums1.length).eq(n1);
      expect(nums2.length).eq(n2);
      expect(nums3.length).eq(n3);
      expect(nums4.length).eq(n4);
      expect(nums5.length).eq(n5);

      nums1.length = 5;
      nums2.length = 5;
      nums3.length = 5;
      nums4.length = 5;
      nums5.length = 5;

      nums1.fill("", n1);
      nums2.fill("", n2);
      nums3.fill("", n3);
      nums4.fill("", n4);
      nums5.fill("", n5);

      let l = ["a", "b", "c", "d", "e"];

      cy.get(cesc("#\\/p1")).should(
        "have.text",
        nums1
          .map((v, i) => `${l[i]}1=${v ? Math.round(v * 1e9) / 1e9 : ""}`)
          .join(", "),
      );
      cy.get(cesc("#\\/p2")).should(
        "have.text",
        nums2
          .map((v, i) => `${l[i]}2=${v ? Math.round(v * 1e9) / 1e9 : ""}`)
          .join(", "),
      );
      cy.get(cesc("#\\/p3")).should(
        "have.text",
        nums3
          .map((v, i) => `${l[i]}3=${v ? Math.round(v * 1e9) / 1e9 : ""}`)
          .join(", "),
      );
      cy.get(cesc("#\\/p4")).should(
        "have.text",
        nums4
          .map((v, i) => `${l[i]}4=${v ? Math.round(v * 1e9) / 1e9 : ""}`)
          .join(", "),
      );
      cy.get(cesc("#\\/p5")).should(
        "have.text",
        nums5
          .map((v, i) => `${l[i]}5=${v ? Math.round(v * 1e9) / 1e9 : ""}`)
          .join(", "),
      );
    });
  });

  it("rounding", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><aslist><selectRandomNumbers assignNames="n1" from="10" to="20" displayDigits="10" /></aslist></p>
    <p><aslist><selectRandomNumbers assignNames="n2" from="10" to="20" displayDigits="3" /></aslist></p>
    <p><aslist><selectRandomNumbers assignNames="n3" from="10" to="20" displayDecimals="3" /></aslist></p>
    <p><aslist><selectRandomNumbers assignNames="n4" type="discreteUniform" from="10" to="20" displayDigits="3" padZeros /></aslist></p>

    <p><number name="n1a">$n1</number></p>
    <p><number name="n2a">$n2</number></p>
    <p><number name="n3a">$n3</number></p>
    <p><number name="n4a">$n4</number></p>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let n1 = stateVariables["/n1"].stateValues.value;
      let n2 = stateVariables["/n2"].stateValues.value;
      let n3 = stateVariables["/n3"].stateValues.value;
      let n4 = stateVariables["/n4"].stateValues.value;

      cy.get(cesc("#\\/n1")).should(
        "have.text",
        String(Math.round(n1 * 10 ** 8) / 10 ** 8),
      );
      cy.get(cesc("#\\/n2")).should(
        "have.text",
        String(Math.round(n2 * 10 ** 1) / 10 ** 1),
      );
      cy.get(cesc("#\\/n3")).should(
        "have.text",
        String(Math.round(n3 * 10 ** 3) / 10 ** 3),
      );
      cy.get(cesc("#\\/n4")).should("have.text", String(n4) + ".0");

      cy.get(cesc("#\\/n1a")).should(
        "have.text",
        String(Math.round(n1 * 10 ** 8) / 10 ** 8),
      );
      cy.get(cesc("#\\/n2a")).should(
        "have.text",
        String(Math.round(n2 * 10 ** 1) / 10 ** 1),
      );
      cy.get(cesc("#\\/n3a")).should(
        "have.text",
        String(Math.round(n3 * 10 ** 3) / 10 ** 3),
      );
      cy.get(cesc("#\\/n4a")).should("have.text", String(n4) + ".0");
    });
  });
});
